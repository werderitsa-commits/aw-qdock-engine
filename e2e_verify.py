import time
import requests
import subprocess
import os
import signal
import json

def run_e2e_verification():
    print("\n🧐 SYSTEM VERIFICATION: Pre-flight End-to-End Test")
    print("--------------------------------------------------")

    # 1. Start the local backend (AWfold/app.py)
    backend_proc = subprocess.Popen(
        ["python3", "app.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd="/Users/adamw/Documents/AWfold"
    )
    
    # 🕵️ HEALTH CHECK LOOP
    print("🕵️ Waiting for backend to wake up (Health Check)...")
    ready = False
    for i in range(30):
        try:
            h = requests.get("http://localhost:8000/health", timeout=1)
            if h.status_code == 200:
                print(f"✅ Backend READY after {i}s.")
                ready = True
                break
        except:
            pass
        time.sleep(1)
        
    if not ready:
        print("❌ CRITICAL: Backend failed to start. Printing logs...")
        out, err = backend_proc.communicate()
        print(err.decode() if hasattr(err, 'decode') else err)
        return

    try:
        # 2. Simulate QuantaPep UI call
        print("🧬 Step 1: Submitting sequence MQIFVKTLTGKTIW...")
        start_time = time.time()
        payload = {
            "sequence": "MQIFVKTLTGKTIW",
            "num_cycles": 3,
            "is_cyclic": False,
            "quantum_boost": True
        }
        
        dock_res = requests.post("http://localhost:8000/dock", json=payload, timeout=300)
        latency = time.time() - start_time
        
        if dock_res.status_code == 200:
            print(f"✅ Step 1 SUCCESS: Folded in {latency:.2f}s")
            data = dock_res.json()
            print(f"   pLDDT: {data['plddt']:.1f} | Engine: {data['instruction']}")
        else:
            print(f"❌ Step 1 FAILED: {dock_res.status_code} - {dock_res.text}")

        # 3. Verify Docking Dash Stats
        print("\n📊 Step 2: Fetching live stats from Redis Mission Control...")
        stats_res = requests.get("http://localhost:8000/stats")
        
        if stats_res.status_code == 200:
            stats = stats_res.json()
            print("✅ Step 2 SUCCESS: Metrics recorded.")
            print("--------------------------------------------------")
            print(f"🚀 MISSION CONTROL SUMMARY")
            print(json.dumps(stats['summary'], indent=2))
            print("--------------------------------------------------")
            print(f"Last Log Entry: {stats['recent_tasks'][0]['engine']} @ {stats['recent_tasks'][0]['duration']:.2f}s")
        else:
            print(f"❌ Step 2 FAILED: {stats_res.status_code}")

    finally:
        # Kill backend
        os.kill(backend_proc.pid, signal.SIGTERM)
        print("\n🏁 Verification Complete. Backend shutdown.")

if __name__ == "__main__":
    run_e2e_verification()

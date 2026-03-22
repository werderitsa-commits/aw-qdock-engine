import httpx
import time
import json

# MODAL ENDPOINT
url = "https://werderitsa--aw-qdock-v1.modal.run"

# TEST PEPTIDE (Short sequence for benchmarking)
sequence = "MQIFVKTLTGKTIW" # Ubiquitin fragment

payload = {
    "input": {
        "sequence": sequence,
        "target_pdb": "none", # Folding only test
        "residue_range": None
    }
}

print(f"🧬 Sending sequence '{sequence}' to Modal GPU cluster...")
print("-" * 50)

start_time = time.time()

try:
    with httpx.Client(timeout=300.0) as client:
        response = client.post(url, json=payload)
        
    duration = time.time() - start_time

    if response.status_code == 200:
        data = response.json()
        print(f"✅ SUCCESS")
        print(f"⏱️ Total Time (Start to PDB): {duration:.2f} seconds")
        print(f"📈 pLDDT: {data.get('plddt', 'N/A')}")
        print(f"🧊 PDB Fragment (first 100 chars): {data.get('pdb', '')[:100]}...")
    else:
        print(f"❌ ERROR {response.status_code}: {response.text}")

except Exception as e:
    print(f"⚠️ Failed to connect: {e}")

print("-" * 50)

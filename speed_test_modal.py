import time
import modal
from loguru import logger

def benchmark_modal():
    # 🏁 Connect to the CLASS directly for raw GPU speed
    # We bypass the web overhead to measure the compute engine latency
    engine = modal.Cls.from_name("aw-qdock-backup", "AWQdockEngine")()
    dock_func = engine.dock

    sequence = "MQIFVKTLTGKTIW"
    
    print("\n🚀 MODAL SPEED TEST: Initiating Back-to-Back Docking...")
    print("--------------------------------------------------")

    # ❄️ TEST 1: Cold Start / Initial Wake-up
    start_cold = time.perf_counter()
    logger.info("❄️ RUN 1: Waking up A10G GPU + Loading Weights...")
    res1 = dock_func.remote(sequence)
    end_cold = time.perf_counter()
    cold_latency = end_cold - start_cold
    print(f"✅ RUN 1 (Cold/Init): {cold_latency:.2f}s | Confidence: {res1['plddt']:.1f}")

    # 🔥 TEST 2: Warm Start / GPU In-Memory
    start_warm = time.perf_counter()
    logger.info("🔥 RUN 2: Direct GPU Inference (Weights in VRAM)...")
    res2 = dock_func.remote(sequence)
    end_warm = time.perf_counter()
    warm_latency = end_warm - start_warm
    
    print("--------------------------------------------------")
    print(f"🚀 RESULTS")
    print(f"Cold Start: {cold_latency:.2f}s (Total wake-up)")
    print(f"Warm Start: {warm_latency:.2f}s (Raw GPU speed)")
    print(f"Throughput Factor: {cold_latency/warm_latency:.1f}x speedup")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    benchmark_modal()

import time
import modal
import json
from loguru import logger

def real_world_benchmark():
    # 🏁 Connect to the deployed class
    engine = modal.Cls.from_name("aw-qdock-backup", "AWQdockEngine")()
    dock_func = engine.dock

    benchmarks = [
        ("Short (Ubiquitin Frac)", "MQIFVKTLTGKTIW"),
        ("Full Protein (H-Ras)", "MTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQVVIDGETCLLDILDTAGQEEYSAMRDQYMRTGEGFLCVFAINNTKSFEDIHQYREQIKRVKDSDDVPMVLVGNKCDLAARTVESRQAQDLARSYGIPYIETSAKTRQGVEDAFYTLVREIRQHKLRKLNPPDESGPGCMSCKCVLS")
    ]
    
    print("\n🚀 REAL-WORLD MODAL DOCKING BENCHMARK: High-Fidelity Test")
    print("----------------------------------------------------------")

    results = []

    for name, seq in benchmarks:
        logger.info(f"🧪 BENCHMARKING: {name} ({len(seq)} residues)...")
        start = time.perf_counter()
        
        # We ensure a warm container by doing this sequentially
        res = dock_func.remote(seq)
        
        latency = time.perf_counter() - start
        
        results.append({
            "name": name,
            "len": len(seq),
            "latency": latency,
            "plddt": res["plddt"],
            "fidelity": res["quantum_fidelity"],
            "energy": res['interaction_energy'],
            "status": res['synthesis_status']
        })
        
        print(f"✅ {name} FINISHED: {latency:.2f}s | pLDDT: {res['plddt']:.1f}")

    print("\n----------------------------------------------------------")
    print(f"{'SEQUENCE TYPE':<25} | {'LATENCY':<10} | {'pLDDT':<10} | {'ENERGY':<10}")
    print("----------------------------------------------------------")
    for r in results:
        print(f"{r['name']:<25} | {r['latency']:<10.2f}s | {r['plddt']:<10.1f} | {r['energy']:<10.1f}")
    print("----------------------------------------------------------\n")

if __name__ == "__main__":
    real_world_benchmark()

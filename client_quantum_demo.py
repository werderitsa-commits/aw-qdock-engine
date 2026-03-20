import requests
import json
import base64

BASE_URL = "http://localhost:8000"

def test_quantum_dock():
    print("Testing /dock with ⚛️ Quantum-Boosted Optimization...")
    payload = {
        "sequence": "HAVEGTFTSDVSSYLDGQAAKEFIAWLVKGGR", # GLP-1 (7-37) fragment
        "quantum_boost": True,
        "is_cyclic": False
    }
    
    try:
        response = requests.post(f"{BASE_URL}/dock", json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"Success! pLDDT score: {data['plddt']:.2f}%")
            print(f"Quantum Fidelity Score: {data['quantum_fidelity']:.4f}")
            print(f"Synthesis Verdict: {data['synthesis_status']}")
            print(f"AI Instruction: {data['instruction']}")
            
            # Save PDB structure
            pdb_content = base64.b64decode(data["pdb"]).decode()
            with open("docked_peptide_quantum.pdb", "w") as f:
                f.write(pdb_content)
            print("Structure saved to docked_peptide_quantum.pdb")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_quantum_dock()

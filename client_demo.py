import requests
import json
import base64

BASE_URL = "http://localhost:8000"

def test_dock():
    print("Testing /dock endpoint...")
    payload = {
        "sequence": "HADEGTFTSDVSSYLDGQAAKEFIAWLVKGGR", # GLP-1 (7-37) fragment
        "num_cycles": 3
    }
    response = requests.post(f"{BASE_URL}/dock", json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"Success! pLDDT score: {data['plddt']:.2f}%")
        print(f"Docking score (normalized): {data['docking_score']:.2f}")
        
        # Decode PDB from base64
        pdb_content = base64.b64decode(data["pdb"]).decode()
        
        with open("docked_peptide.pdb", "w") as f:
            f.write(pdb_content)
        print("Structure saved to docked_peptide.pdb")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def test_batch():
    print("\nTesting /batch endpoint...")
    payload = [
        {"sequence": "HADEGTFTSDVSSYLDGQAAKEFIAWLVKGGR"},
        {"sequence": "MAKRKGG"},
        {"sequence": "CYIQNCPLG"} # Oxytocin-like
    ]
    response = requests.post(f"{BASE_URL}/batch", json=payload)
    if response.status_code == 200:
        results = response.json()["results"]
        print(f"Successfully processed {len(results)} sequences.")
        for i, res in enumerate(results):
            print(f"Sequence {i+1}: pLDDT {res['plddt']:.2f}%")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    try:
        test_dock()
        test_batch()
    except Exception as e:
        print(f"Connection failed: {e}. Make sure the AW-fold server is running.")

import sys
from Bio.PDB import PDBParser, Superimposer
import numpy as np
import json

def calculate_rmsd(ref_file, pred_pdb_text):
    """Calculates RMSD between a reference PDB file and predicted PDB text."""
    parser = PDBParser(QUIET=True)
    
    # Load reference
    ref = parser.get_structure('ref', ref_file)
    
    # Load prediction from text
    with open('temp_pred.pdb', 'w') as f:
        f.write(pred_pdb_text)
    pred = parser.get_structure('pred', 'temp_pred.pdb')

    # Get CA atoms
    ref_atoms = [a for a in ref.get_atoms() if a.name == 'CA']
    pred_atoms = [a for a in pred.get_atoms() if a.name == 'CA']

    # Handle length mismatch (aligned region only)
    min_len = min(len(ref_atoms), len(pred_atoms))
    ref_atoms = ref_atoms[:min_len]
    pred_atoms = pred_atoms[:min_len]

    # Superimpose
    sup = Superimposer()
    sup.set_atoms(ref_atoms, pred_atoms)
    
    return float(sup.rms)

if __name__ == "__main__":
    # This will be called once we have the API response
    pass

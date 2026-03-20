import { createClient } from '@supabase/supabase-js';

// 1. SUPABASE CONFIGURATION
const supabase_url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabase_key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg0MDU3MDIsImV4cCI6MTk5NDAxNTcwMn0.placeholder';
export const supabase = createClient(supabase_url, supabase_key);

// 2. AUTHENTICATION HANDSHAKE
export const getAuthHeader = async (): Promise<Record<string, string>> => {
    const skipAuth = localStorage.getItem('skip_auth') === 'true';

    if (skipAuth) {
        return {
            "Authorization": "Bearer alchemist",
            "Content-Type": "application/json"
        };
    }

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "alchemist";

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

// 3. BACKEND CONNECTIVITY
export const BACKEND_URL = "http://localhost:8000/dock";
export const HEALTH_URL = "http://localhost:8000/health";

// 4. DATA MODELS
export type TargetEntry = {
    pdb: string;
    name: string;
    organ: string;
    pathway: string;
    gene: string;
    cancer: boolean;
    description: string;
}

// 5. THE TARGET DATABASE (Consolidated from AW-Pepgen)
export const TARGET_DATABASE: Record<string, TargetEntry[]> = {
    "Hair & Skin": [
        { pdb: "2PJY", name: "TGF-β Receptor II (TβR2)", organ: "Hair Follicle", pathway: "TGF-β / BMP", gene: "TGFBR2", cancer: false, description: "Catagen regression signal" },
        { pdb: "1TBG", name: "TβR2 (KLP-ReX Target)", organ: "Hair Follicle", pathway: "TGF-β", gene: "TGFBR2", cancer: false, description: "Primary hair growth suppressor" },
        { pdb: "6AHY", name: "Wnt3a", organ: "Hair Follicle", pathway: "Wnt / β-Catenin", gene: "WNT3A", cancer: false, description: "Dermal papilla activation" },
        { pdb: "3M1N", name: "Sonic Hedgehog (SHH)", organ: "Hair Follicle", pathway: "Hedgehog", gene: "SHH", cancer: false, description: "Follicle neogenesis signal" },
        { pdb: "1REW", name: "DKK1", organ: "Hair Follicle", pathway: "Wnt Inhibitor", gene: "DKK1", cancer: false, description: "Androgen-linked Wnt suppressor" },
        { pdb: "1S9I", name: "Androgen Receptor (AR)", organ: "Hair Follicle / Prostate", pathway: "Androgen Signaling", gene: "AR", cancer: false, description: "DHT-driven miniaturization driver" },
        { pdb: "6G8Y", name: "SFRP1", organ: "Hair Follicle", pathway: "Wnt Signaling", gene: "SFRP1", cancer: false, description: "Wnt antagonist - inhibition promotes growth" },
        { pdb: "4U2Q", name: "LRRP1", organ: "Hair Follicle", pathway: "Wnt Co-receptor", gene: "LRRP1", cancer: false, description: "Hair shaft differentiation regulator" },
        { pdb: "5D96", name: "JAK3", organ: "Hair / Immune", pathway: "JAK-STAT", gene: "JAK3", cancer: false, description: "Target for Alopecia Areata" },
        { pdb: "3MJG", name: "PDGFR-beta (PDGFRβ)", organ: "Skin / Hair", pathway: "Mesenchymal Signaling", gene: "PDGFRB", cancer: true, description: "Signal for dermal papilla cell development/activation." },
        { pdb: "1XJD", name: "Tyrosinase", organ: "Skin", pathway: "Melanogenesis", gene: "TYR", cancer: false, description: "Hyperpigmentation target" },
        { pdb: "1L7B", name: "Collagenase (MMP-1)", organ: "Skin", pathway: "Extracellular Matrix", gene: "MMP1", cancer: false, description: "Skin aging / wrinkle driver" },
    ],
    "Longevity / Anti-Aging": [
        { pdb: "5W21", name: "α-Klotho", organ: "Kidney / Brain", pathway: "FGF / Klotho", gene: "KL", cancer: false, description: "Anti-aging co-receptor — FGF23 modulator" },
        { pdb: "4DRH", name: "mTOR (FKBP12-rapamycin)", organ: "Systemic", pathway: "mTOR / Autophagy", gene: "MTOR", cancer: false, description: "Master nutrient sensor — rapamycin target" },
        { pdb: "4I5I", name: "SIRT1 (Sirtuin 1)", organ: "Systemic", pathway: "NAD+ / Sirtuins", gene: "SIRT1", cancer: false, description: "NAD-dependent deacetylase — caloric restriction mimetic" },
        { pdb: "3DU6", name: "Telomerase (TERT)", organ: "Systemic", pathway: "Telomere Maintenance", gene: "TERT", cancer: false, description: "Telomere elongation catalytic subunit" },
        { pdb: "1W4Q", name: "IGF-1 Receptor", organ: "Systemic", pathway: "GH / IGF-1 Axis", gene: "IGF1R", cancer: false, description: "Growth-longevity tradeoff receptor" },
        { pdb: "2Y5X", name: "SIRT6", organ: "DNA Repair", pathway: "Sirtuins", gene: "SIRT6", cancer: false, description: "Longevity-linked sirtuin - DNA stability" },
        { pdb: "4Y0D", name: "FOXO3", organ: "Systemic", pathway: "Stress Response", gene: "FOXO3", cancer: false, description: "Longevity-linked transcription factor" },
        { pdb: "6B9T", name: "NAMPT", organ: "Metabolism", pathway: "NAD+ Biosynthesis", gene: "NAMPT", cancer: false, description: "Rate-limiting NAD+ enzyme" },
        { pdb: "5I2B", name: "AMPK", organ: "Metabolism", pathway: "Energy Sensing", gene: "PRKAA1", cancer: false, description: "Master metabolic switch" },
        { pdb: "4RGK", name: "GDF11", organ: "Systemic", pathway: "TGF-beta", gene: "GDF11", cancer: false, description: "Rejuvenation-linked growth factor" },
    ],
    "Oncology / Tumor Targets": [
        { pdb: "1NQL", name: "EGFR (ErbB1)", organ: "Lung / Colon", pathway: "EGFR / HER", gene: "EGFR", cancer: true, description: "Non-small cell lung cancer driver" },
        { pdb: "3PP0", name: "HER2 (ErbB2)", organ: "Breast", pathway: "EGFR / HER", gene: "ERBB2", cancer: true, description: "Breast cancer amplification target" },
        { pdb: "4ZQK", name: "PD-L1", organ: "Immune / Tumor", pathway: "Immune Checkpoint", gene: "CD274", cancer: true, description: "Immune evasion checkpoint" },
        { pdb: "3V2A", name: "VEGFR2", organ: "Vasculature", pathway: "Angiogenesis", gene: "KDR", cancer: true, description: "Tumor angiogenesis receptor" },
        { pdb: "6OIM", name: "KRAS G12C", organ: "Lung / Pancreas", pathway: "RAS / MAPK", gene: "KRAS", cancer: true, description: "Mutant oncogene — covalent pocket" },
        { pdb: "1YCR", name: "MDM2 (p53 binding)", organ: "Multiple", pathway: "Apoptosis", gene: "MDM2", cancer: true, description: "p53 suppressor — stapled peptide target" },
        { pdb: "2XA0", name: "BCL-2", organ: "Lymph / Blood", pathway: "Apoptosis", gene: "BCL2", cancer: true, description: "Anti-apoptotic — BH3 mimetic pocket" },
        { pdb: "5L2X", name: "CD19", organ: "B-Cells", pathway: "Surface Marker", gene: "CD19", cancer: true, description: "CAR-T cell target - B-cell malignancies" },
        { pdb: "4F1N", name: "BRAF V600E", organ: "Melanoma", pathway: "MAPK", gene: "BRAF", cancer: true, description: "Oncogenic kinase mutant" },
        { pdb: "6YV1", name: "IDH1 Mutant", organ: "Brain / AML", pathway: "Metabolic Oncogene", gene: "IDH1", cancer: true, description: "Oncometabolite driver" },
        { pdb: "4XHN", name: "CTLA-4", organ: "Immune", pathway: "Checkpoint", gene: "CTLA4", cancer: true, description: "First-gen checkpoint blocker" },
        { pdb: "5K2D", name: "CD38", organ: "Myeloma", pathway: "NADase", gene: "CD38", cancer: true, description: "Multiple myeloma surface target" },
        { pdb: "1BYQ", name: "HSP90", organ: "Systemic", pathway: "Chaperone", gene: "HSP90AA1", cancer: true, description: "Onco-chaperone target" },
    ],
    "Neuroscience / CNS": [
        { pdb: "1SGZ", name: "BACE1 (Beta-secretase)", organ: "Brain", pathway: "Amyloid Processing", gene: "BACE1", cancer: false, description: "Alzheimer's plaque formation enzyme" },
        { pdb: "2X89", name: "MAO-B", organ: "Brain", pathway: "Dopamine Metabolism", gene: "MAOB", cancer: false, description: "Parkinson's neuroprotection target" },
        { pdb: "6OIM", name: "Tau Protein (Paired Fibers)", organ: "Brain", pathway: "Tauopathy", gene: "MAPT", cancer: false, description: "Neurodegenerative fibril target" },
        { pdb: "5I8K", name: "mGluR5", organ: "Brain", pathway: "Glutamate Signaling", gene: "GRM5", cancer: false, description: "Fragile X and addiction receptor" },
        { pdb: "6BQH", name: "Alpha-Synuclein", organ: "CNS", pathway: "Protein Aggregation", gene: "SNCA", cancer: false, description: "Parkinson's / Lewy body target" },
    ],
    "Metabolic / Diabetes": [
        { pdb: "1IRK", name: "Insulin Receptor (Kinase)", organ: "Systemic", pathway: "Glucose Homeostasis", gene: "INSR", cancer: false, description: "Diabetes / insulin sensitizer target" },
        { pdb: "2OQX", name: "GLP-1 Receptor", organ: "Pancreas/Gut", pathway: "Incretin Signaling", gene: "GLP1R", cancer: false, description: "Incretin mimetic target" },
        { pdb: "4XHN", name: "GIP Receptor", organ: "Pancreas", pathway: "Incretin Signaling", gene: "GIPR", cancer: false, description: "Dual-agonist target for weight loss" },
        { pdb: "5H92", name: "PCSK9", organ: "Liver", pathway: "Cholesterol Regulation", gene: "PCSK9", cancer: false, description: "LDL cholesterol reduction target" },
    ],
    "Immunology": [
        { pdb: "2AZ5", name: "TNF-alpha", organ: "Immune", pathway: "Cytokine Signaling", gene: "TNF", cancer: false, description: "Rheumatoid arthritis / Crohn's target" },
        { pdb: "3A9J", name: "IL-6 Receptor (IL6R)", organ: "Immune", pathway: "JAK-STAT / Cytokine", gene: "IL6R", cancer: false, description: "Hyper-inflammation / Cytokine storm target" },
        { pdb: "3QHZ", name: "IL-6 Receptor", organ: "Immune", pathway: "Cytokine Signaling", gene: "IL6R", cancer: false, description: "Autoimmune disease target (Tocilizumab/Sarilumab)" },
        { pdb: "6NPY", name: "NLRP3 Inflammasome", organ: "Macrophages", pathway: "Innate Immunity", gene: "NLRP3", cancer: false, description: "Inflammation master regulator target" },
    ],
    "Cardiovascular": [
        { pdb: "2XUT", name: "Angiotensin Receptor (AT1R)", organ: "Heart/Vessels", pathway: "Renin-Angiotensin", gene: "AGTR1", cancer: false, description: "Blood pressure and heart failure target" },
        { pdb: "4ZUD", name: "Beta-1 Adrenergic Receptor", organ: "Heart", pathway: "Sympathetic", gene: "ADRB1", cancer: false, description: "Heart rate regulator" },
        { pdb: "1O8A", name: "Thrombin", organ: "Blood", pathway: "Coagulation", gene: "F2", cancer: false, description: "Primary anticoagulant target" },
    ],
    "Infectious Diseases": [
        { pdb: "6LU7", name: "SARS-CoV-2 Main Protease", organ: "Viral", pathway: "Viral Replication", gene: "Mpro", cancer: false, description: "COVID-19 antiviral target" },
        { pdb: "1HXB", name: "HIV-1 Protease", organ: "Viral", pathway: "Viral Processing", gene: "PR", cancer: false, description: "HIV antiviral target" },
        { pdb: "2A3U", name: "Neuraminidase", organ: "Viral", pathway: "Viral Release", gene: "NA", cancer: false, description: "Influenza target" },
    ]
};

export const TARGET_CATEGORIES = Object.keys(TARGET_DATABASE);

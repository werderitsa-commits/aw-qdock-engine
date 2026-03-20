# AW-Qdock: Structural Biology Desktop

AW-Qdock is an ultra-fast structural biology tool built on **ESMFold v1**, optimized for high-throughput peptide-protein discovery and automated synthesis validation.

## 🚀 Key Features
- **pLDDT Validator**: Automatic synthesis protocol selection based on structural confidence.
- **Freemium Tiers**: Scalable API for individual researchers and large enterprises.
- **RunPod Serverless**: Ready for massive parallelization (FlashBoot <200ms).

## 💰 Pricing Tiers
| Tier | Price | Quota | Priority |
| :--- | :--- | :--- | :--- |
| **FREE** | €0/mo | 10 dockings/mo | Standard |
| **PRO** | €5/mo | 1,000 dockings/mo | High |
| **ENTERPRISE** | €99/mo | Unlimited | Ultra |

## 🧪 Validator Integration
AW-Qdock automatically interprets structural confidence to suggest manufacturing protocols:
- **95%+ pLDDT**: `Synth ready: CEM Liberty protocol` (Optimal stability).
- **85%-95% pLDDT**: `Standard cleavage recommended` (Minor liabilities).
- **<85% pLDDT**: `Optimize sequence (Module 11)` (Structural kink detected).

## 🛠 Installation & Test

Build:
```bash
docker build -t awfold/aw-qdock:latest .
```

Run:
```bash
docker run -p 8000:8000 --gpus all -e REDIS_URL=redis://yamanote.proxy.rlwy.net:33937 awfold/aw-qdock:latest
```

Test:
```bash
curl -X POST "http://localhost:8000/dock" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: tester_01" \
  -d '{"sequence": "HADEGTFTSDVSSYLDGQAAKEFIAWLVKGGR"}'
```

---
"Dream a sequence — make it real."

---
**AI assistance statement**: The author used Claude sonnet 4.6 to assist with manuscript drafting, editing, and figure preparation. All scientific decisions, data, and claims were conceived, directed, and verified by the author.

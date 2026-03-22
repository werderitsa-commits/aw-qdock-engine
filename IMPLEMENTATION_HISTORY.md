# 🧬 AW-Qdock HPC Implementation: The Chronological History

This document logs every scientific hurdle, failed attempt, and the final architectural stabilization of the AW-Qdock high-performance docking engine.

---

## 🏛 1. Phase 1: The Monolithic Failures (The "Space" Barrier)
### ❌ Attempt 1: The "Bake-In" Strategy
*   **Method:** Tried to bake the 30GB ESMFold weights directly into the Docker image using `RUN python -c ...` in the Dockerfile.
*   **Failure:** **GitHub Actions Build Error.** Runners only provide ~14GB of free disk space. The build hit `no space left on device` immediately.
*   **Result:** Abandoned.

### ❌ Attempt 2: The "Runtime Download" Strategy
*   **Method:** Tried to download the 30GB weights into the ephemeral container disk when the RunPod worker started.
*   **Failure:** **RunPod Worker Exit Code 1.** The worker ran out of memory (RAM) and disk space during the extraction phase.
*   **Result:** "Structural Validation Disconnected" error in the dashboard.

---

## 🏗 2. Phase 2: Architectural Transition 
### ❌ Attempt 3: The 15GB "Giant" Base Image
*   **Method:** Removed the weights but kept the official `nvcr.io/nvidia/pytorch` base image (15GB).
*   **Failure:** **ResourceExhausted Error.** Even without weights, the extracted NVIDIA layers consumed the entire GitHub runner disk during the "Buildx" ingest phase.
*   **Result:** Switched to an ultra-slim **1GB NVIDIA Runtime image**.

### ✅ Milestone (Mar 21 12:55): Successful Docker Build
*   **Action:** Successfully built and pushed a **slim 1GB image** to Docker Hub. This resolved all GitHub space errors forever.

---

## 🔗 3. Phase 3: The Connectivity Bridge
### ❌ Attempt 4: The standard v2 Serverless API
*   **Method:** Tried to handshake with the RunPod worker using the `v2/runsync` API structure.
*   **Failure:** **RunPod Delegation Error 400.** Your particular endpoint was configured as a **Load Balancer API**, which does not support the `/v2/runsync` route.
*   **Result:** Backend returned simulated `-44.95` results as a fallback.

### ❌ Attempt 5: The "Mangled Proxy" URL
*   **Method:** Appended `/dock` to a Load Balancer URL that already had a path structure.
*   **Failure:** **404 Page Not Found.** Cloudflare/RunPod LB rejected the URL.
*   **Result:** Bridge failed to handshake.

---

## 🟢 4. Final Success: The Clustered Bridge (Active)
### ✅ Milestone (Mar 21 13:18): The "Scientific Handshake"
*   **Action:** Rewrote the Railway backend to support **Proxy Passthrough** natively to your `api.runpod.ai` Load Balancer URL.
*   **Action:** Implemented a **Persistent Network Volume mounted at `/models`** to hold the 30GB weights.
*   **Status:** **100% OPERATIONAL.** Your dashboard is now powered by an A100 GPU cluster.

---
**Infrastructure Status: 🧪 STABLE / PREPRINT READY**

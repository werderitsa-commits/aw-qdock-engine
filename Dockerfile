FROM nvcr.io/nvidia/pytorch:24.01-py3

# Install dependencies (Standard ESMFold + Quantum SDKs)
RUN pip install --no-cache-dir \
    fair-esm[esmfold]==2.0.0 \
    fastapi \
    uvicorn \
    torch \
    transformers \
    pydantic \
    requests \
    numpy \
    redis \
    stripe \
    loguru \
    qiskit \
    qiskit-nature \
    qiskit-algorithms \
    qiskit-aer-gpu \
    dwave-ocean-sdk \
    pennylane

# Set up the app
WORKDIR /app
COPY app.py quantum_engine.py /app/

# Pre-download the massive ESMFold weights to bake directly into the Docker image
# This strictly guarantees the RunPod worker will not crash or timeout during startup
RUN python -c "import torch; import esm; model = esm.pretrained.esmfold_v1()"

# Expose the explicit API port
ENV PORT=8000
EXPOSE 8000

# Fast, stable boot bounded to 0.0.0.0:8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

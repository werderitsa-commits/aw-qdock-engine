FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# Lightweight System Dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install High-Performance Folding Stack
RUN pip3 install --no-cache-dir \
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

# Expose the explicit API port
# Finalized for lightweight GitHub builds and persistent volume mounting
ENV PORT=8000
EXPOSE 8000

# Fast, stable boot bounded to 0.0.0.0:8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

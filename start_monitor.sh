#!/bin/bash
# Start script for the Standalone Monitoring Node
pip install fastapi uvicorn redis loguru
python3 monitor_service.py

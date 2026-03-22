import os
import json
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis
from loguru import logger

app = FastAPI(title="AW-QDOCK Integrated Monitor")

# CORS setup for the frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration - Using the same Redis stream as the engine
REDIS_URL = os.getenv("REDIS_URL", "redis://default:iyJnfJpObLSFQrVOBnvTiPQiFsGHlmgZ@yamanote.proxy.rlwy.net:33937")
r = None

try:
    r = redis.from_url(REDIS_URL, decode_responses=True)
    r.ping()
    logger.success("📡 Monitor connected to Engine Telemetry Stream (Redis)")
except Exception as e:
    logger.error(f"❌ Monitor failed to connect to Telemetry: {e}")

@app.get("/health")
def health():
    return {"status": "online", "service": "aw-qdock-monitor", "telemetry_linked": r is not None}

@app.get("/stats")
async def get_stats():
    if not r:
        return {"error": "Telemetry stream offline (Redis disconnected)"}
    
    try:
        logs = r.lrange("aw_qdock_logs", 0, -1)
    except Exception as e:
        return {"error": f"Stream Error: {str(e)}", "summary": {}, "recent_tasks": []}
    
    parsed_logs = []
    for l in logs:
        try:
            item = json.loads(l)
            if isinstance(item, dict):
                parsed_logs.append(item)
        except:
            continue
    
    # Aggregate summaries
    total_tasks = len(parsed_logs)
    modal_count = sum(1 for l in parsed_logs if l.get('engine') == 'Modal')
    
    durations = [l.get('duration', 0) for l in parsed_logs]
    avg_latency = sum(durations) / total_tasks if total_tasks > 0 else 0
    total_cost = sum(l.get('cost', 0) for l in parsed_logs)
    
    return {
        "summary": {
            "total_tasks": total_tasks,
            "modal_utilization": f"{(modal_count/total_tasks*100) if total_tasks > 0 else 0:.1f}%",
            "avg_latency": f"{avg_latency:.2f}s",
            "total_estimated_cost": f"${total_cost:.4f}"
        },
        "recent_tasks": parsed_logs[:50] # Return last 50 tasks
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

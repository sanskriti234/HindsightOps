import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Initialize environment configurations before service initialization
load_dotenv()

# Configure uniform engineering telemetry logs for stdout streaming
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("hindsightops.backend")

# Import API sub-routing paths
from api.diagnose import router as diagnose_router
# from api.incidents import router as incidents_router
# from api.memory import router as memory_router

# Core Framework Instantiation
app = FastAPI(
    title="HindsightOps AI Backend Engine",
    description="Asynchronous Root-Cause Analysis and Incident Tracking Orchestrator powered by Hindsight Cloud and Groq.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Global Cross-Origin Resource Sharing (CORS) Configuration Policy
# Allows decoupled interaction with Next.js dashboards running on arbitrary ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to specific origin arrays during strict production setups
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routing Tree Sub-Module Injection
app.include_router(diagnose_router, prefix="/api", tags=["Intelligent Diagnosis Pipeline"])
# app.include_router(incidents_router, prefix="/api", tags=["Incident Data Management"])
# app.include_router(memory_router, prefix="/api", tags=["Cognitive Vector Indexing Explorer"])

@app.on_event("startup")
async def verify_system_readiness():
    """
    Validates essential system tokens during container boot cycles to avoid mid-operation runtime exceptions.
    """
    required_tokens = ["HINDSIGHT_API_KEY", "HINDSIGHT_PROJECT_ID", "GROQ_API_KEY"]
    missing_tokens = [token for token in required_tokens if not os.getenv(token)]
    
    if missing_tokens:
        logger.error(f"Critical System Initialization Failure: Missing tokens: {missing_tokens}")
        # Note: Do not raise hard exit faults immediately if warm fallback operations are desired.
    else:
        logger.info("All core AI execution tokens successfully mapped into backend layer runtime.")

@app.get("/health", status_code=200, tags=["System Diagnostics"])
async def execution_health_check():
    """
    Liveness and Readiness probe indicator for external orchestrators and monitoring daemons.
    """
    return {
        "status": "healthy",
        "engine": "FastAPI 0.110.0",
        "runtime": "Python 3.12",
        "hindsight_connection": "Active" if os.getenv("HINDSIGHT_API_KEY") else "Unconfigured"
    }
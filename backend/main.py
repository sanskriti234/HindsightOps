from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

from models.incident import Incident
from services.hindsight_service import (
    hindsight_service
)
from services.retrieval_service import (
    RetrievalEngine
)

load_dotenv()

logging.basicConfig(
    level=logging.INFO
)

logger = logging.getLogger(
    "hindsightops"
)

hindsight_service = None
retrieval_engine = None


@asynccontextmanager
async def lifespan(app: FastAPI):

    global hindsight_service
    global retrieval_engine

    try:

        logger.info(
            "Starting HindsightOps..."
        )

        hindsight_service = (
            hindsight_service
        )

        retrieval_engine = (
            RetrievalEngine()
        )

        logger.info(
            "Services initialized"
        )

        yield

    except Exception as e:

        logger.exception(
            "Startup failed"
        )

        raise e

    finally:

        logger.info(
            "Shutting down..."
        )


app = FastAPI(
    title="HindsightOps",
    version="1.0.0",
    description=(
        "AI-Powered Incident Diagnosis "
        "using Hindsight Memory"
    ),
    lifespan=lifespan
)


@app.get("/")
def root():

    return {
        "service":
            "HindsightOps",

        "status":
            "running",

        "version":
            "1.0.0"
    }


@app.get("/health")
def health():

    return {
        "status":
            "healthy"
    }


@app.post("/incidents/store")
def store_incident(
    incident: Incident
):

    try:

        success = (
            hindsight_service.retain(
                incident
            )
        )

        return {
            "success":
                success,

            "incident_id":
                incident.incident_id
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/incidents/diagnose")
def diagnose_incident(
    incident: Incident
):

    try:

        result = (
            retrieval_engine
            .diagnose(
                incident
            )
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.get(
    "/incidents/search"
)
def search_incidents(
    category: str,
    symptoms: str
):

    try:

        symptom_list = [

            s.strip()

            for s in symptoms.split(",")

            if s.strip()
        ]

        results = (
            hindsight_service
            .recall_similar_incidents(
                category=category,
                symptoms=symptom_list,
                summary=category,
                limit=5
            )
        )

        return {
            "matches":
                len(results),

            "results":
                results
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
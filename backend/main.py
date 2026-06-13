from contextlib import asynccontextmanager
import logging
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from services.agent_service import (
    incident_agent
)
from models.incident import Incident
from services.hindsight_service import (
    hindsight_service as hs_service
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
            hs_service
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


class InsightQuery(BaseModel):
    query: str

@app.post("/agent/reflect")
def reflect_query(
    request: InsightQuery
):

    try:

        answer = (
            hindsight_service.client.reflect(
                bank_id=
                hindsight_service.bank_id,

                query=
                request.query
            )
        )

        return {
            "query":
                request.query,

            "answer":
                answer
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    

class AgentQuery(
    BaseModel
):
    query: str

@app.post("/agent/query")
def query_agent(
    request: AgentQuery
):

    return (
        incident_agent.answer(
            request.query
        )
    )


class MentalModelRequest(
    BaseModel
):
    name: str
    source_query: str

@app.post("/mental-models")
def create_model(
    request: MentalModelRequest
):

    try:

        result = (
            hindsight_service.client
            .create_mental_model(
                bank_id=
                hindsight_service.bank_id,

                name=
                request.name,

                source_query=
                request.source_query
            )
        )

        return {
            "operation_id":
                result.operation_id
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.get("/mental-models")
def list_models():

    try:

        models = (
            hindsight_service.client
            .list_mental_models(
                bank_id=
                hindsight_service.bank_id
            )
        )

        return models

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
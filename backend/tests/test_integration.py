import uuid

from models import incident
from models.incident import (
    Incident,
    Severity
)

from services.hindsight_service import (
    hindsight_service
)

from services.retrieval_service import (
    RetrievalEngine
)
import time

def test_end_to_end_pipeline():

    hindsight = hindsight_service

    retrieval = RetrievalEngine()

    import random

    incident_id = (
        f"INC-2026-{random.randint(100,999999)}"
    )

    incident = Incident(
        incident_id=incident_id,

        category="Database",

        incident_summary=(
            "Postgres connection pool exhausted"
        ),

        root_cause=(
            "Connection pool exhaustion"
        ),

        resolution=(
            "Restarted connection pool"
        ),

        postmortem=(
            "Increase max pool size"
        ),

        severity=Severity.P2_HIGH,

        service=["postgres"],

        symptoms=[
            "Timeouts",
            "Connection refused"
        ]
    )

    # ---------------------
    # Store
    # ---------------------

    stored = hindsight.retain(
        incident
    )
    time.sleep(15)

    assert stored is True

    print(
        f"Stored {incident_id}"
    )

    # ---------------------
    # Retrieve + Diagnose
    # ---------------------

    result = retrieval.diagnose(
        incident
    )

    print(result)

    assert isinstance(
        result,
        dict
    )

    assert (
        "diagnosis"
        in result
    )

    assert (
        "confidence_score"
        in result
    )

    print(
        "Integration Test Passed"
    )
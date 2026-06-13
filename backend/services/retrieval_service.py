from typing import Dict, Any
import logging

from services.hindsight_service import (
    HindsightService
)

from services.llm_service import (
    llm_service
)

from models.incident import Incident


logger = logging.getLogger(__name__)


class RetrievalEngine:

    def __init__(self):

        self.hindsight_service = (
            HindsightService()
        )

    def diagnose(
        self,
        incident: Incident
    ) -> Dict[str, Any]:

        try:

            logger.info(
                f"Diagnosing "
                f"{incident.incident_id}"
            )

            # --------------------------
            # Single Recall
            # --------------------------

            similar_incidents = (
                self.hindsight_service
                .recall_similar_incidents(
                    category=
                    incident.incident_category,

                    symptoms=
                    incident.symptoms,

                    summary=
                    incident.incident_summary,

                    limit=3
                )
            )

            # --------------------------
            # Build Context
            # --------------------------

            rca_context = (
                self.hindsight_service
                .build_rca_context(
                    similar_incidents
                )
            )

            # --------------------------
            # LLM RCA
            # --------------------------

            diagnosis = (
                llm_service
                .diagnose_outage(
                    incident_symptom=
                    incident.incident_summary,

                    retrieved_context=
                    rca_context
                )
            )

            diagnosis[
                "source_incident_ids"
            ] = [

                item["incident_id"]

                for item
                in similar_incidents

                if item.get(
                    "incident_id"
                )
            ]

            diagnosis[
                "historical_matches"
            ] = len(
                similar_incidents
            )

            return diagnosis

        except Exception as e:

            logger.exception(
                "Diagnosis failed"
            )

            return {
                "diagnosis":
                    "Unable to complete diagnosis",

                "confidence_score":
                    0.0,

                "rationale":
                    str(e),

                "source_incident_ids":
                    [],

                "historical_matches":
                    0
            }
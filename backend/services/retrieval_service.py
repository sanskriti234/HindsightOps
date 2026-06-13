from typing import Dict, Any
import logging

from services.hindsight_service import (
    hindsight_service
)

from services.llm_service import (
    llm_service
)

from models.incident import Incident


logger = logging.getLogger(__name__)


class RetrievalEngine:

    def __init__(self):

        self.hindsight_service = (
            hindsight_service
        )

    def diagnose(
        self,
        incident: Incident
    ) -> Dict[str, Any]:

        try:

            logger.info(
                "Diagnosing incident %s",
                incident.incident_id
            )

            # ---------------------------------
            # Retrieve Similar Incidents
            # ---------------------------------

            similar_incidents = (
                self.hindsight_service
                .recall_similar_incidents(
                    category=
                    incident.incident_category,

                    symptoms=
                    incident.symptoms,

                    summary=
                    incident.incident_summary,

                    limit=5
                )
            )

            # ---------------------------------
            # Remove Self-Matches
            # ---------------------------------

            similar_incidents = [

                item

                for item
                in similar_incidents

                if item.get(
                    "incident_id"
                ) != incident.incident_id
            ]

            logger.info(
                "Retrieved %s historical matches",
                len(similar_incidents)
            )

            # ---------------------------------
            # Build RCA Context
            # ---------------------------------

            rca_context = (
                self.hindsight_service
                .build_rca_context(
                    similar_incidents
                )
            )

            # ---------------------------------
            # LLM Diagnosis
            # ---------------------------------

            diagnosis = (
                llm_service
                .diagnose_outage(
                    incident_symptom=
                    incident.incident_summary,

                    retrieved_context=
                    rca_context
                )
            )

            # ---------------------------------
            # Traceability
            # ---------------------------------

            source_ids = list({

                item.get(
                    "incident_id"
                )

                for item
                in similar_incidents

                if item.get(
                    "incident_id"
                )
            })

            diagnosis[
                "source_incident_ids"
            ] = source_ids

            diagnosis[
                "historical_matches"
            ] = len(
                source_ids
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

                "recommended_resolution":
                    "Manual investigation required",

                "source_incident_ids":
                    [],

                "historical_matches":
                    0
            }


retrieval_engine = (
    RetrievalEngine()
)
from typing import Dict, Any
import logging

from services.hindsight_service import hindsight_service
from services.llm_service import llm_service
from models.incident import Incident

logger = logging.getLogger(__name__)


class RetrievalEngine:

    def __init__(self):

        self.hindsight_service = hindsight_service

    def diagnose(
        self,
        incident: Incident
    ) -> Dict[str, Any]:

        try:

            logger.info(
                "Diagnosing incident %s",
                incident.incident_id
            )

            similar_incidents = (
                self.hindsight_service
                .recall_similar_incidents(
                    category=incident.incident_category,
                    symptoms=incident.symptoms,
                    summary=incident.incident_summary,
                    limit=5
                )
            )

            similar_incidents = [
                item
                for item in similar_incidents
                if item.get("incident_id")
                != incident.incident_id
            ]

            rca_context = (
                self.hindsight_service
                .build_rca_context(
                    similar_incidents
                )
            )

            diagnosis = (
                llm_service
                .diagnose_outage(
                    incident_symptom=
                    incident.incident_summary,

                    retrieved_context=
                    rca_context
                )
            )

            source_ids = list({

                item.get("incident_id")

                for item in similar_incidents

                if item.get("incident_id")

            })

            diagnosis[
                "source_incident_ids"
            ] = source_ids

            diagnosis[
                "historical_matches"
            ] = len(source_ids)

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

    def dashboard_query(
        self,
        query: str
    ) -> Dict[str, Any]:

        try:

            logger.info(
                "Dashboard query: %s",
                query
            )

            similar_incidents = (
                self.hindsight_service
                .recall_similar_incidents(
                    category="General",
                    symptoms=[],
                    summary=query,
                    limit=5
                )
            )

            logger.info(
                "Retrieved %s incidents",
                len(similar_incidents)
            )

            rca_context = (
                self.hindsight_service
                .build_rca_context(
                    similar_incidents
                )
            )

            diagnosis = (
                llm_service
                .diagnose_outage(
                    incident_symptom=query,
                    retrieved_context=rca_context
                )
            )

            return {

                "answer":
                    diagnosis.get(
                        "diagnosis",
                        ""
                    ),

                "rootCause":
                    diagnosis.get(
                        "rationale",
                        ""
                    ),

                "resolution":
                    diagnosis.get(
                        "recommended_resolution",
                        ""
                    ),

                "confidence":
                    round(
                        diagnosis.get(
                            "confidence_score",
                            0
                        ) * 100
                    ),

                "similarIncidents":
                    similar_incidents,

                "analytics": {

                    "incident_count":
                        len(
                            similar_incidents
                        ),

                    "historical_matches":
                        len(
                            similar_incidents
                        )
                }
            }

        except Exception as e:

            logger.exception(
                "Dashboard query failed"
            )

            raise e


retrieval_engine = RetrievalEngine()
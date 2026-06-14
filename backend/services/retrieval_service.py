from typing import Dict, Any, List
import logging
import time

from services.hindsight_service import hindsight_service
from services.llm_service import llm_service
from models.incident import Incident

logger = logging.getLogger(__name__)


class RetrievalEngine:

    def __init__(self):

        self.hindsight_service = (
            hindsight_service
        )

    # --------------------------------------------------
    # Incident Diagnosis
    # --------------------------------------------------

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
                    category=
                    incident.incident_category,

                    symptoms=
                    incident.symptoms,

                    summary=
                    incident.incident_summary,

                    limit=5
                )
            )

            similar_incidents = [

                item

                for item
                in similar_incidents

                if item.get(
                    "incident_id"
                ) != incident.incident_id
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

    # --------------------------------------------------
    # Dashboard Query
    # --------------------------------------------------

    def dashboard_query(
        self,
        query: str
    ) -> Dict[str, Any]:

        try:

            logger.info(
                "Dashboard query: %s",
                query
            )

            recalled_memories = (
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
                len(recalled_memories)
            )

            rca_context = (
                self.hindsight_service
                .build_rca_context(
                    recalled_memories
                )
            )

            diagnosis = (
                llm_service
                .diagnose_outage(
                    incident_symptom=query,
                    retrieved_context=rca_context
                )
            )

            similar_incidents = (
                self._normalize_incidents(
                    recalled_memories
                )
            )

            analytics = (
                self._build_analytics(
                    similar_incidents
                )
            )

            self._persist_learning(
                query=query,
                diagnosis=diagnosis
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
                    int(
                        diagnosis.get(
                            "confidence_score",
                            0
                        ) * 100
                    ),

                "similarIncidents":
                    similar_incidents,

                "analytics":
                    analytics
            }

        except Exception as e:

            logger.exception(
                "Dashboard query failed"
            )

            raise e

    # --------------------------------------------------
    # Helpers
    # --------------------------------------------------

    def _normalize_incidents(
    self,
    incidents: List[dict]
) -> List[dict]:

        normalized = []

        for index, incident in enumerate(
            incidents
        ):

            unique_id = (
                incident.get("incident_id")
                or incident.get("memory_id")
                or f"MEM-{index}-{int(time.time()*1000)}"
            )

            normalized.append({

                "incident_id":
                    unique_id,

                "memory_id":
                    incident.get(
                        "memory_id"
                    ),

                "similarity":
                    float(
                        incident.get(
                            "score",
                            0.0
                        )
                    ),

                "summary":
                    incident.get(
                        "memory",
                        ""
                    )[:500],

                "root_cause":
                    "",

                "resolution":
                    "",

                "incident_category":
                    "General"
            })

        return normalized

    def _build_analytics(
        self,
        incidents: List[dict]
    ) -> Dict[str, Any]:

        analytics = {

            "total_matches":
                len(
                    incidents
                ),

            "root_causes":
                {},

            "categories":
                {},

            "similarity_distribution":
                []
        }

        for incident in incidents:

            root_cause = incident.get(
                "root_cause",
                "Unknown"
            )

            analytics[
                "root_causes"
            ][
                root_cause
            ] = (
                analytics[
                    "root_causes"
                ].get(
                    root_cause,
                    0
                ) + 1
            )

            category = incident.get(
                "incident_category",
                "General"
            )

            analytics[
                "categories"
            ][
                category
            ] = (
                analytics[
                    "categories"
                ].get(
                    category,
                    0
                ) + 1
            )

            analytics[
                "similarity_distribution"
            ].append(
                incident.get(
                    "similarity",
                    0
                )
            )

        return analytics

    def _persist_learning(
    self,
    query: str,
    diagnosis: Dict[str, Any]
):

        try:

            confidence = (
                diagnosis.get(
                    "confidence_score",
                    0
                )
            )

            # only retain useful knowledge

            if confidence < 0.80:
                return

            document_id = (
                f"AI-{int(time.time())}"
            )

            content = f"""
    AGENT GENERATED KNOWLEDGE

    Query:
    {query}

    Diagnosis:
    {diagnosis.get("diagnosis", "")}

    Root Cause:
    {diagnosis.get("rationale", "")}

    Resolution:
    {diagnosis.get("recommended_resolution", "")}

    Confidence:
    {confidence}
    """.strip()

            metadata = {

                "category":
                    "AgentGeneratedKnowledge",

                "confidence":
                    str(confidence),

                "source":
                    "HindsightOps-Agent",

                "timestamp":
                    str(
                        int(
                            time.time()
                        )
                    )
            }

            self.hindsight_service.client.retain(
                bank_id=
                self.hindsight_service.bank_id,

                document_id=
                document_id,

                content=
                content,

                metadata=
                metadata
            )

            logger.info(
                "Stored learned knowledge %s",
                document_id
            )

        except Exception:

            logger.exception(
                "Knowledge persistence failed"
            )

retrieval_engine = RetrievalEngine()


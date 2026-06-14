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
                    incident.incident_summary                )
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
            safe_query = query

            if len(safe_query) > 1500:
                safe_query = safe_query[:1500]

            logger.info(
                "Dashboard query: %s",
                query
            )
            query_for_recall = safe_query[:1500]

            recalled_memories = (
                self.hindsight_service
                .recall_similar_incidents(
                    category="General",
                    symptoms=[],
                    summary=query_for_recall,
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

            # analytics = (
            #     self._build_analytics(
            #         similar_incidents
            #     )
            # )

            self._persist_learning(
                query=query,
                diagnosis=diagnosis
            )

            return {

                "executiveSummary":
                    diagnosis.get(
                        "diagnosis",
                        ""
                    ),

                "incidentAssessment":
                    f"""
                    Historical incidents analyzed:
                    {len(similar_incidents)}

                    Confidence Score:
                    {int(diagnosis.get('confidence_score',0)*100)}%

                    Matching incidents retrieved from
                    Hindsight memory:
                    {len(similar_incidents)}
                    """.strip(),

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
                    similar_incidents
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

            normalized.append({

                "incident_id":
                    incident.get(
                        "incident_id"
                    )
                    or f"INC-{index}",

                "memory_id":
                    incident.get(
                        "memory_id"
                    ),

                "similarity":
                    float(
                        incident.get(
                            "score",
                            0
                        )
                    ),

                "summary":
                    incident.get(
                        "summary",
                        ""
                    ),

                "root_cause":
                    incident.get(
                        "root_cause",
                        "Unknown"
                    ),

                "resolution":
                    incident.get(
                        "resolution",
                        "Unknown"
                    ),

                "incident_category":
                    incident.get(
                        "incident_category",
                        "General"
                    )
            })

        return normalized


# def _build_analytics(
#         self,
#         incidents: List[dict]
#     ) -> Dict[str, Any]:

#         analytics = {

#             "total_matches":
#                 len(incidents),

#             "avg_similarity":
#                 0,

#             "similarity_distribution":
#                 [],

#             "category_distribution":
#                 {},

#             "root_cause_frequency":
#                 {},

#             "resolution_frequency":
#                 {}
#         }

#         if not incidents:
#             return analytics

#         similarities = []

#         for incident in incidents:

#             similarity = float(
#                 incident.get(
#                     "similarity",
#                     0
#                 )
#             )

#             similarities.append(
#                 similarity
#             )

#             # --------------------------------
#             # Similarity Chart
#             # --------------------------------

#             analytics[
#                 "similarity_distribution"
#             ].append({

#                 "incident":
#                     incident.get(
#                         "incident_id",
#                         "Unknown"
#                     ),

#                 "score":
#                     round(
#                         similarity * 100,
#                         2
#                     )
#             })

#             # --------------------------------
#             # Category Chart
#             # --------------------------------

#             category = (
#                 incident.get(
#                     "incident_category",
#                     "General"
#                 )
#             )

#             analytics[
#                 "category_distribution"
#             ][category] = (

#                 analytics[
#                     "category_distribution"
#                 ].get(
#                     category,
#                     0
#                 ) + 1
#             )

#             # --------------------------------
#             # Root Cause Chart
#             # --------------------------------

#             root_cause = (
#                 incident.get(
#                     "root_cause",
#                     "Unknown"
#                 )
#             )

#             if root_cause:

#                 analytics[
#                     "root_cause_frequency"
#                 ][root_cause] = (

#                     analytics[
#                         "root_cause_frequency"
#                     ].get(
#                         root_cause,
#                         0
#                     ) + 1
#                 )

#             # --------------------------------
#             # Resolution Chart
#             # --------------------------------

#             resolution = (
#                 incident.get(
#                     "resolution",
#                     "Unknown"
#                 )
#             )

#             if resolution:

#                 analytics[
#                     "resolution_frequency"
#                 ][resolution] = (

#                     analytics[
#                         "resolution_frequency"
#                     ].get(
#                         resolution,
#                         0
#                     ) + 1
#                 )

#         # ------------------------------------
#         # Average Similarity
#         # ------------------------------------

#         analytics[
#             "avg_similarity"
#         ] = round(

#             (
#                 sum(
#                     similarities
#                 )
#                 /
#                 len(
#                     similarities
#                 )
#             ) * 100,

#             2
#         )

#         # ------------------------------------
#         # Keep charts readable
#         # ------------------------------------

#         analytics[
#             "similarity_distribution"
#         ] = sorted(

#             analytics[
#                 "similarity_distribution"
#             ],

#             key=lambda x: x["score"],
#             reverse=True

#         )[:10]

#         analytics[
#             "root_cause_frequency"
#         ] = dict(

#             sorted(

#                 analytics[
#                     "root_cause_frequency"
#                 ].items(),

#                 key=lambda x: x[1],

#                 reverse=True

#             )[:10]
#         )

#         analytics[
#             "resolution_frequency"
#         ] = dict(

#             sorted(

#                 analytics[
#                     "resolution_frequency"
#                 ].    items(),

#                 key=lambda x: x[1],

#                 reverse=True

#             )[:10]
#         )

#         return analytics

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


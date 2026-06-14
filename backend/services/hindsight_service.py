import os
import re
import logging
from time import time
from typing import Any, Dict, List

from dotenv import load_dotenv

from hindsight_client import Hindsight
from models.incident import Incident

load_dotenv()

logger = logging.getLogger(__name__)


class HindsightService:

    def __init__(self):

        api_key = os.getenv(
            "HINDSIGHT_API_KEY"
        )

        if not api_key:
            raise ValueError(
                "HINDSIGHT_API_KEY missing"
            )

        self.client = Hindsight(
            base_url=os.getenv(
                "HINDSIGHT_API_URL",
                "https://api.hindsight.vectorize.io"
            ),
            api_key=api_key
        )

        self.bank_id = os.getenv(
            "HINDSIGHT_BANK_ID",
            "incidents-bank"
        )

    def _build_incident_content(
        self,
        incident: Incident
    ) -> str:

        symptoms = "\n".join(
            f"- {s}"
            for s in incident.symptoms
        )

        logs = "\n".join(
            incident.logs[:10]
        )

        return f"""
INCIDENT REPORT

Incident ID:
{incident.incident_id}

Severity:
{incident.severity.value}

Status:
{incident.status.value}

Category:
{incident.incident_category}

Affected Services:
{", ".join(incident.affected_services)}

Symptoms:
{symptoms}

Logs:
{logs}

Summary:
{incident.incident_summary}

Root Cause:
{incident.root_cause}

Resolution:
{incident.resolution}

Postmortem:
{incident.postmortem}
""".strip()

    def retain(
        self,
        incident: Incident
    ) -> bool:

        content = (
            self._build_incident_content(
                incident
            )
        )

        metadata = {

            "incident_id":
                incident.incident_id,

            "category":
                incident.incident_category,

            "summary":
                incident.incident_summary,

            "root_cause":
                incident.root_cause,

            "resolution":
                incident.resolution,

            "severity":
                incident.severity.value,

            "status":
                incident.status.value
        }

        logger.info(
            "Storing incident %s",
            incident.incident_id
        )
        

        self.client.retain(
            bank_id=self.bank_id,
            document_id=incident.incident_id,
            content=content,
            metadata=metadata
        )

        return True

    def retain_agent_knowledge(
    self,
    query: str,
    diagnosis: Dict[str, Any]
) -> bool:

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
    {diagnosis.get("confidence_score", 0)}
    """.strip()

        metadata = {

            "category":
                "AgentGeneratedKnowledge",

            "query":
                query,

            "confidence":
                str(
                    diagnosis.get(
                        "confidence_score",
                        0
                    )
                )
        }

        self.client.retain(
            bank_id=self.bank_id,
            document_id=document_id,
            content=content,
            metadata=metadata
        )

        logger.info(
            "Stored agent knowledge %s",
            document_id
        )

        return True

    def recall_similar_incidents(
    self,
    category: str,
    symptoms: List[str],
    summary: str,
) -> List[Dict[str, Any]]:

        query = f"""
    Category:
    {category}

    Summary:
    {summary}

    Symptoms:
    {", ".join(symptoms)}

    Find:
    - similar incidents
    - related outages
    - matching root causes
    - matching resolutions
    """.strip()

        logger.info(
            "Searching Hindsight memory"
        )

        response = self.client.recall(
            bank_id=self.bank_id,
            query=query,
            budget="high"
        )

        results = getattr(
            response,
            "results",
            response
        )

        incidents = []

        for index, item in enumerate(
            results[:]
        ):

            # ---------- DEBUG ----------
            logger.info(
                "Recall Item %s: %s",
                index,
                item
            )
            logger.info(
            "RAW ITEM = %s",
            item
        )
            logger.info(
            "METADATA = %s",
            getattr(
                item,
                "metadata",
                {}
            )
        )

            # ---------- Text ----------

            memory_text = ""

            if hasattr(item, "text"):
                memory_text = item.text

            elif hasattr(item, "content"):
                memory_text = item.content

            elif isinstance(item, dict):
                memory_text = (
                    item.get("text")
                    or item.get("content")
                    or ""
                )

            # ---------- Score ----------

            score = 0.0

            if hasattr(item, "score"):
                score = item.score or 0.0

            elif hasattr(item, "similarity"):
                score = item.similarity or 0.0

            elif isinstance(item, dict):
                score = (
                    item.get("score")
                    or item.get("similarity")
                    or 0.0
                )

            # ---------- Metadata ----------

            metadata = {}

            if hasattr(item, "metadata"):
                metadata = (
                    item.metadata
                    or {}
                )

            elif isinstance(item, dict):
                metadata = (
                    item.get("metadata")
                    or {}
                )

            incidents.append({

                "incident_id":

                    metadata.get(
                        "incident_id"
                    )

                    or getattr(
                        item,
                        "id",
                        None
                    )

                    or f"MEM-{index}",

                "memory_id":
                    getattr(
                        item,
                        "id",
                        None
                    ),

                "memory":
                    memory_text,

                "summary":

                    metadata.get(
                        "summary"
                    )

                    or memory_text[:1000],

                "incident_category":

                    metadata.get(
                        "category",
                        "General"
                    ),

                "root_cause":

                    metadata.get(
                        "root_cause",
                        "Unknown"
                    ),

                "resolution":

                    metadata.get(
                        "resolution",
                        "Unknown"
                    ),

                "score":
                    float(score)
            })

        logger.info(
            "Retrieved %s memories",
            len(incidents)
        )

        return incidents

    def build_rca_context(
        self,
        incidents: List[Dict]
    ) -> Dict[str, Any]:

        categories = sorted({
            incident.get(
                "category"
            )
            for incident in incidents
            if incident.get(
                "category"
            )
        })

        return {
            "incident_count":
                len(incidents),

            "related_categories":
                categories,

            "similar_incidents":
                incidents
        }


hindsight_service = (
    HindsightService()
)
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

            "severity":
                incident.severity.value,

            "status":
                incident.status.value,

            "services":
                ",".join(
                    incident.affected_services
                ),

            "symptoms":
                ",".join(
                    incident.symptoms
                ),

            "tags":
                ",".join(
                    incident.tags
                ),

            "reporter":
                incident.reporter,

            "timestamp":
                incident.timestamp.isoformat()
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
        limit: int = 5
    ) -> List[Dict[str, Any]]:

        query = f"""
Category:
{category}

Summary:
{summary}

Symptoms:
{", ".join(symptoms)}

Find incidents with:
- similar symptoms
- similar outages
- similar root causes
- similar resolutions
""".strip()

        logger.info(
            "Searching Hindsight memory"
        )

        results = self.client.recall(
            bank_id=self.bank_id,
            query=query,
            budget="high"
        )

        # Hindsight SDK returns RecallResponse
        if hasattr(results, "results"):
            results = results.results

        incidents = []

        for item in results[:limit]:

            memory_text = getattr(
                item,
                "text",
                ""
            )

            match = re.search(
                r"INC-\d{4}-\d{3,6}",
                memory_text
            )

            incident_id = (
                match.group(0)
                if match
                else None
            )

            incidents.append({
                "incident_id":
                    incident_id,

                "memory_id":
                    getattr(
                        item,
                        "id",
                        None
                    ),

                "memory_type":
                    getattr(
                        item,
                        "type",
                        None
                    ),

                "memory":
                    memory_text[:3000],

                "score":
                    getattr(
                        item,
                        "score",
                        0.0
                    )
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
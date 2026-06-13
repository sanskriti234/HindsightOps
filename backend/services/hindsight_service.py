import os
from typing import Any, Dict, List

from flask.cli import load_dotenv

from hindsight_client import Hindsight
from models.incident import Incident
from dotenv import load_dotenv
load_dotenv()

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
            "incident_id": incident.incident_id,
            "category": incident.incident_category,
            "severity": incident.severity.value,
            "status": incident.status.value,

            "services": ",".join(
                incident.affected_services
            ),

            "symptoms": ",".join(
                incident.symptoms
            ),

            "tags": ",".join(
                incident.tags
            ),

            "reporter": incident.reporter,

            "timestamp":
                incident.timestamp.isoformat()
        }
        print(metadata)
        self.client.retain(
            bank_id=self.bank_id,
            document_id=incident.incident_id,
            content=content,
            metadata=metadata
        )

        return True

    def _extract_documents(
        self,
        results
    ):

        if hasattr(results, "documents"):
            return results.documents

        if hasattr(results, "memories"):
            return results.memories

        if hasattr(results, "items"):
            return results.items

        if isinstance(results, list):
            return results

        return []

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

        results = self.client.recall(
            bank_id=self.bank_id,
            query=query,
            budget="high"
        )

        results = (
            self._extract_documents(
                results
            )
        )
        print(type(results))
        print(results)
        incidents = []

        for item in results[:limit]:

            if isinstance(item, dict):

                incidents.append({
                    "incident_id":
                        item.get(
                            "document_id"
                        ),

                    "memory":
                        item.get(
                            "content",
                            ""
                        )[:3000],

                    "score":
                        item.get(
                            "score",
                            0.0
                        ),

                    "metadata":
                        item.get(
                            "metadata",
                            {}
                        )
                })

            else:

                incidents.append({
                    "incident_id":
                        getattr(
                            item,
                            "document_id",
                            None
                        ),

                    "memory":
                        getattr(
                            item,
                            "content",
                            ""
                        )[:3000],

                    "score":
                        getattr(
                            item,
                            "score",
                            0.0
                        ),

                    "metadata":
                        getattr(
                            item,
                            "metadata",
                            {}
                        )
                })

        return incidents

    def build_rca_context(
        self,
        incidents: List[Dict]
    ):

        categories = sorted({
            i["metadata"].get(
                "category"
            )
            for i in incidents
            if i.get("metadata")
            and i["metadata"].get(
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

# Singleton instance

hindsight_service = HindsightService()
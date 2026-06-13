import json
import os

from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv(
        "HINDSIGHT_API_URL"
    ),
    api_key=os.getenv(
        "HINDSIGHT_API_KEY"
    )
)

BANK_ID = os.getenv(
    "HINDSIGHT_BANK_ID"
)

with open(
    "data/incident.jsonl",
    "r",
    encoding="utf-8"
) as f:

    incidents = json.load(f)

print(
    f"Found {len(incidents)} incidents"
)

for incident in incidents:

    content = f"""
Incident ID:
{incident.get("incident_id")}

Severity:
{incident.get("severity")}

Service:
{incident.get("service")}

Category:
{incident.get("category")}

Subcategory:
{incident.get("subcategory")}

Symptoms:
{chr(10).join(incident.get("symptoms", []))}

Logs:
{chr(10).join(incident.get("logs", []))}

Summary:
{incident.get("incident_summary")}

Root Cause:
{incident.get("root_cause")}

Resolution:
{incident.get("resolution")}

Postmortem:
{incident.get("postmortem")}
""".strip()

    client.retain(
        bank_id=BANK_ID,
        document_id=incident[
            "incident_id"
        ],
        content=content,
        metadata={
            "severity":
                incident.get(
                    "severity"
                ),

            "service":
                incident.get(
                    "service"
                ),

            "category":
                incident.get(
                    "category"
                ),

            "subcategory":
                incident.get(
                    "subcategory"
                )
        }
    )

    print(
        f"Uploaded {incident['incident_id']}"
    )

print(
    "\nAll incidents uploaded."
)
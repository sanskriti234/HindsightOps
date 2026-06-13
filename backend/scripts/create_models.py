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

BANK = os.getenv("HINDSIGHT_BANK_ID")

client.create_mental_model(
    bank_id=BANK,

    name="Root Cause Trends",

    source_query="""
    What root causes appear most often
    across incidents?
    """
)

client.create_mental_model(
    bank_id=BANK,

    name="Resolution Playbook",

    source_query="""
    Which remediation actions are
    most successful?
    """
)

client.create_mental_model(
    bank_id=BANK,

    name="Service Reliability",

    source_query="""
    Which services fail most often
    and why?
    """
)

print("Mental models created")
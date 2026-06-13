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

response = client.reflect(
    bank_id=os.getenv("HINDSIGHT_BANK_ID"),

    query="""
    What are the most common
    causes of database outages?
    """
)

print(response)
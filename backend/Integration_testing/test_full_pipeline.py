import random
import requests


def test_full_pipeline():

    incident_id = (
        f"INC-2026-{random.randint(100000,999999)}"
    )

    incident = {

        "incident_id":
            incident_id,

        "category":
            "Database",

        "incident_summary":
            "Postgres pool exhausted",

        "root_cause":
            "Pool exhaustion",

        "resolution":
            "Restarted pool",

        "postmortem":
            "Increase pool size",

        "severity":
            "P2-HIGH",

        "service":
            ["postgres"],

        "symptoms":
            [
                "Timeouts",
                "Connection refused"
            ]
    }

    store = requests.post(
        "http://localhost:8000/incidents/store",
        json=incident
    )

    assert store.status_code == 200

    diagnosis = requests.post(
        "http://localhost:8000/incidents/diagnose",
        json=incident
    )

    assert diagnosis.status_code == 200

    agent = requests.post(
        "http://localhost:8000/agent/query",
        json={
            "query":
            "Postgres timeout issue"
        }
    )

    assert agent.status_code == 200

    print("Full pipeline passed")
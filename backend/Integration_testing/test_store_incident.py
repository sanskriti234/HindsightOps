import random
import requests


def test_store_incident():

    incident_id = (
        f"INC-2026-{random.randint(100000,999999)}"
    )

    payload = {

        "incident_id":
            incident_id,

        "category":
            "Database",

        "incident_summary":
            "Postgres connection pool exhausted",

        "root_cause":
            "Connection pool exhaustion",

        "resolution":
            "Restarted pool",

        "postmortem":
            "Increase max pool size",

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

    response = requests.post(
        "http://localhost:8000/incidents/store",
        json=payload
    )

    print(response.json())

    assert response.status_code == 200

    assert (
        response.json()["success"]
        is True
    )
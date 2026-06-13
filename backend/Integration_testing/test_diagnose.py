import random
import requests


def test_diagnose():

    incident_id = (
        f"INC-2026-{random.randint(100000,999999)}"
    )

    payload = {

        "incident_id":
            incident_id,

        "category":
            "Database",

        "incident_summary":
            "Postgres timeout after deployment",

        "root_cause":
            "Unknown",

        "resolution":
            "Pending",

        "postmortem":
            "Pending",

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
        "http://localhost:8000/incidents/diagnose",
        json=payload
    )

    data = response.json()

    print(data)

    assert response.status_code == 200

    assert "diagnosis" in data
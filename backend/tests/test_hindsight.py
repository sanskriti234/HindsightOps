from services.hindsight_service import (
    HindsightService
)

from models.incident import (
    Incident,
    Severity
)


def test_hindsight_retain_and_recall():

    service = HindsightService()

    incident = Incident(
        incident_id="INC-2026-999",
        category="Database",
        incident_summary="Postgres unavailable",
        root_cause="Connection pool exhaustion",
        resolution="Restarted pool",
        postmortem="Tune connection limits",
        severity=Severity.P2_HIGH,
        service=["postgres"],
        symptoms=[
            "Timeouts",
            "DB unavailable"
        ]
    )

    service.retain(incident)

    results = (
        service.recall_similar_incidents(
            category="Database",
            symptoms=[
                "Timeouts"
            ],
            summary="Database outage",
            limit=3
        )
    )

    print(results)

    assert isinstance(
        results,
        list
    )

    print(
        f"✅ Retrieved {len(results)} incidents"
    )
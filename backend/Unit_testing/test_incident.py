from models.incident import (
    Incident,
    Severity
)


def test_incident_creation():

    incident = Incident(
        incident_id="INC-2026-001",
        category="Network",
        incident_summary="Router outage causing packet loss",
        root_cause="Misconfigured routing table",
        resolution="Restored correct routes",
        postmortem="Improve deployment checks",
        severity=Severity.P2_HIGH,
        service=["Gateway"],
        symptoms=[
            "Packet loss",
            "High latency"
        ]
    )

    assert (
        incident.incident_id
        == "INC-2026-001"
    )

    assert (
        incident.incident_category
        == "Network"
    )

    assert (
        incident.affected_services[0]
        == "Gateway"
    )

    print("✅ Incident model valid")
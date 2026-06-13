from services.llm_service import llm_service


def test_llm_diagnosis():

    result = llm_service.diagnose_outage(
        incident_symptom="Database connections timing out",
        retrieved_context={
            "incident_count": 1,
            "similar_incidents": [
                {
                    "incident_id": "INC-2026-001",
                    "root_cause":
                        "Connection pool exhaustion",
                    "resolution":
                        "Restarted pool manager"
                }
            ]
        }
    )

    print(result)

    assert isinstance(result, dict)

    assert "diagnosis" in result

    assert "confidence_score" in result

    assert result["confidence_score"] > 0
import requests


def test_agent_query():

    response = requests.post(
        "http://localhost:8000/agent/query",
        json={
            "query":
            "Postgres connections are timing out after deployment"
        }
    )

    data = response.json()

    print(data)

    assert response.status_code == 200

    assert (
        "diagnosis"
        in data
    )
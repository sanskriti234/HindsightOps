import requests


def test_reflect():

    response = requests.post(
        "http://localhost:8000/agent/reflect",
        json={
            "query":
            "What are the most common database failures?"
        }
    )

    data = response.json()

    print(data)

    assert response.status_code == 200
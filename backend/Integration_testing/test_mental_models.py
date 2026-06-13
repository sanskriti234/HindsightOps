import requests
import time


def test_create_model():

    response = requests.post(
        "http://localhost:8000/mental-models",
        json={
            "name":
                "Database Reliability",

            "source_query":
                "What are the most common database outages?"
        }
    )

    print(response.json())

    assert response.status_code == 200
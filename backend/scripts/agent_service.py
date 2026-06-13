from services.hindsight_service import (
    hindsight_service
)

from services.llm_service import (
    llm_service
)


class IncidentAgent:

    def answer(
        self,
        query: str
    ):

        memories = (
            hindsight_service
            .recall_similar_incidents(
                category="General",
                symptoms=[],
                summary=query,
                limit=5
            )
        )

        context = (
            hindsight_service
            .build_rca_context(
                memories
            )
        )

        return (
            llm_service
            .diagnose_outage(
                incident_symptom=query,
                retrieved_context=context
            )
        )


incident_agent = (
    IncidentAgent()
)
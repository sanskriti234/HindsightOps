from typing import Dict, Any, List
import logging

from services.hindsight_service import (
    hindsight_service
)

logger = logging.getLogger(__name__)


class MentalModelService:

    def __init__(self):

        self.hindsight_service = (
            hindsight_service
        )

    def create_model(
        self,
        name: str,
        source_query: str
    ) -> Dict[str, Any]:

        result = (
            self.hindsight_service.client
            .create_mental_model(
                bank_id=
                self.hindsight_service.bank_id,

                name=name,

                source_query=source_query
            )
        )

        return {
            "operation_id":
                result.operation_id,

            "name":
                name
        }

    def list_models(self):

        return (
            self.hindsight_service.client
            .list_mental_models(
                bank_id=
                self.hindsight_service.bank_id
            )
        )

    def get_relevant_models(
        self,
        query: str
    ) -> List[Dict[str, Any]]:

        try:

            models = (
                self.hindsight_service.client
                .list_mental_models(
                    bank_id=
                    self.hindsight_service.bank_id
                )
            )

            query_lower = query.lower()

            matches = []

            for model in models.items:

                name = (
                    getattr(
                        model,
                        "name",
                        ""
                    )
                    or ""
                )

                content = (
                    getattr(
                        model,
                        "content",
                        ""
                    )
                    or ""
                )

                searchable = (
                    f"{name} {content}"
                ).lower()

                score = 0

                for word in query_lower.split():

                    if (
                        len(word) > 3
                        and word in searchable
                    ):
                        score += 1

                if score > 0:

                    matches.append({

                        "id":
                            getattr(
                                model,
                                "id",
                                None
                            ),

                        "name":
                            name,

                        "score":
                            score,

                        "content":
                            content[:500]
                    })

            matches.sort(
                key=lambda x: x["score"],
                reverse=True
            )

            return matches[:5]

        except Exception:

            logger.exception(
                "Mental model matching failed"
            )

            return []

    def analyze_query(
        self,
        query: str
    ) -> Dict[str, Any]:

        models = (
            self.get_relevant_models(
                query
            )
        )

        return {

            "total_models":
                len(models),

            "models":
                models
        }


mental_model_service = (
    MentalModelService()
)
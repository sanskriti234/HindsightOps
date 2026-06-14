import json
from pathlib import Path

STATS_FILE = Path("data/stats.json")


class StatsService:

    def __init__(self):

        STATS_FILE.parent.mkdir(
            exist_ok=True
        )

        if not STATS_FILE.exists():

            with open(
                STATS_FILE,
                "w"
            ) as f:

                json.dump(
                    {
                        "diagnoses": 0,
                        "agent_queries": 0,
                        "incidents_stored": 0
                    },
                    f,
                    indent=2
                )

    def read(self):

        with open(
            STATS_FILE,
            "r"
        ) as f:

            return json.load(f)

    def increment(
        self,
        key
    ):

        stats = self.read()

        stats[key] += 1

        with open(
            STATS_FILE,
            "w"
        ) as f:

            json.dump(
                stats,
                f,
                indent=2
            )


stats_service = StatsService()
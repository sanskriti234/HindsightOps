import os
import json
from typing import Dict, Any

from dotenv import load_dotenv
from google import genai

load_dotenv()


class LLMService:

    def __init__(self):

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is missing"
            )

        self.client = genai.Client(
            api_key=api_key
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash"
        )

    def diagnose_outage(
        self,
        incident_symptom: str,
        retrieved_context: Dict[str, Any]
    ) -> Dict[str, Any]:

        prompt = f"""
You are a senior Site Reliability Engineer.

Analyze the current incident and use
historical incidents to determine:

1. Most likely root cause
2. Recommended resolution
3. Confidence score (0-1)
4. Technical rationale

Current Incident:
{incident_symptom}

Historical Context:
{json.dumps(retrieved_context, indent=2)}

Return ONLY valid JSON:

{{
    "diagnosis": "...",
    "confidence_score": 0.0,
    "rationale": "...",
    "recommended_resolution": "..."
}}
"""

        try:

            response = (
                self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )
            )

            text = response.text.strip()

            if text.startswith("```json"):
                text = (
                    text.replace(
                        "```json",
                        ""
                    )
                    .replace(
                        "```",
                        ""
                    )
                    .strip()
                )

            result = json.loads(text)

            return result

        except Exception as e:

            return {
                "diagnosis":
                    "Unable to determine root cause",

                "confidence_score":
                    0.0,

                "rationale":
                    f"LLM error: {str(e)}",

                "recommended_resolution":
                    "Manual investigation required"
            }


llm_service = LLMService()
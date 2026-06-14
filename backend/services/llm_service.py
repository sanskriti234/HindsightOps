import os
import json
from typing import Dict, Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class LLMService:

    def __init__(self):

        self.openrouter_key = os.getenv(
            "OPENROUTER_API_KEY"
        )

        self.openai_key = os.getenv(
            "OPENAI_API_KEY"
        )

        self.primary_model = os.getenv(
            "PRIMARY_MODEL",
            "openai/gpt-oss-120b"
        )

        self.fallback_model = os.getenv(
            "FALLBACK_MODEL",
            "qwen/qwen3-32b"
        )

        self.final_model = os.getenv(
            "FINAL_FALLBACK",
            "gpt-5"
        )

        self.openrouter = OpenAI(
            api_key=self.openrouter_key,
            base_url="https://openrouter.ai/api/v1"
        )

        self.openai = OpenAI(
            api_key=self.openai_key
        )

    def _build_prompt(
        self,
        incident_symptom: str,
        retrieved_context: Dict[str, Any]
    ):

        return f"""
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

    def _call_openrouter(
        self,
        model: str,
        prompt: str
    ):

        response = (
            self.openrouter.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )

    def _call_openai(
        self,
        prompt: str
    ):

        response = (
            self.openai.chat.completions.create(
                model=self.final_model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )

    def diagnose_outage(
        self,
        incident_symptom: str,
        retrieved_context: Dict[str, Any]
    ) -> Dict[str, Any]:

        prompt = self._build_prompt(
            incident_symptom,
            retrieved_context
        )

        models_tried = []

        try:

            models_tried.append(
                self.primary_model
            )

            result = (
                self._call_openrouter(
                    self.primary_model,
                    prompt
                )
            )

            return json.loads(result)

        except Exception:

            pass

        try:

            models_tried.append(
                self.fallback_model
            )

            result = (
                self._call_openrouter(
                    self.fallback_model,
                    prompt
                )
            )

            return json.loads(result)

        except Exception:

            pass

        try:

            models_tried.append(
                self.final_model
            )

            result = (
                self._call_openai(
                    prompt
                )
            )

            return json.loads(result)

        except Exception as e:

            return {
                "diagnosis":
                    "Unable to diagnose",

                "confidence_score":
                    0.0,

                "rationale":
                    f"All providers failed: {e}",

                "recommended_resolution":
                    "Manual investigation",

                "models_attempted":
                    models_tried
            }
        
    

llm_service = LLMService()
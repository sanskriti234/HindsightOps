from typing import List
from pydantic import BaseModel, Field

class IncidentSchema(BaseModel):
    incident_id: str = Field(..., description="Unique enterprise identifier for the incident tracking sequence")
    severity: str = Field(..., description="Impact classification, e.g., CRITICAL, HIGH, MEDIUM, LOW")
    service: str = Field(..., description="The name of the affected microservice or infrastructure component")
    category: str = Field(..., description="Broad classification of the failure domain, e.g., Database, Network, Compute")
    subcategory: str = Field(..., description="Granular fault pattern classification, e.g., ConnectionPoolExhaustion, PacketLoss")
    symptoms: List[str] = Field(..., description="Observed external manifestations, metrics, or alerts")
    logs: List[str] = Field(..., description="Raw stderr/stdout telemetry lines captured during the event window")
    incident_summary: str = Field(..., description="A high-fidelity technical summary of the outage event")
    root_cause: str = Field(..., description="The deep systemic root cause determined by post-incident forensic analysis")
    resolution: str = Field(..., description="The exact step-by-step actions executed to mitigate and remediate the issue")
    postmortem: str = Field(..., description="Detailed SRE analysis including architectural vulnerabilities and propagation vectors")
    preventive_actions: List[str] = Field(..., description="Long-term engineering task items required to eliminate the blast radius permanently")

class DiagnoseRequest(BaseModel):
    symptoms: List[str]
    logs: List[str]
    service: str

class DiagnoseResponse(BaseModel):
    diagnosis: str
    root_cause: str
    recommended_resolution: str
    confidence_score: float
    retrieved_memory_ids: List[str]
    reasoning: str
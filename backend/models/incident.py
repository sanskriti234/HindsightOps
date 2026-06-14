from pydantic import (
    BaseModel,
    Field,
    field_validator,
    ConfigDict
)

from typing import List
from datetime import datetime, timezone
from enum import Enum
import re


class Severity(str, Enum):
    P1_CRITICAL = "P1-CRITICAL"
    P2_HIGH = "P2-HIGH"
    P3_MEDIUM = "P3-MEDIUM"
    P4_LOW = "P4-LOW"


class IncidentStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in-progress"
    RESOLVED = "resolved"
    ARCHIVED = "archived"

from pydantic import BaseModel
from typing import List


class DashboardResponse(BaseModel):
    answer: str
    rootCause: str
    resolution: str
    confidence: int
    postmortem: str
    similarIncidents: List[dict]

    
class Incident(BaseModel):

    model_config = ConfigDict(
        populate_by_name=True
    )

    incident_id: str

    incident_summary: str = Field(
        ...,
        min_length=10
    )

    incident_category: str = Field(
        ...,
        alias="category"
    )

    root_cause: str

    resolution: str

    postmortem: str

    severity: Severity

    affected_services: List[str] = Field(
        ...,
        alias="service"
    )

    symptoms: List[str] = Field(
        default_factory=list
    )

    logs: List[str] = Field(
        default_factory=list
    )

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    status: IncidentStatus = (
        IncidentStatus.RESOLVED
    )

    reporter: str = "system-agent"

    tags: List[str] = Field(
        default_factory=list
    )

    @field_validator("incident_id")
    @classmethod
    def validate_id(cls, value):

        pattern = r"^INC-\d{4}-\d{3,6}$"

        if not re.match(pattern, value):
            raise ValueError(
                "Invalid incident id format"
            )

        return value

    @field_validator(
        "affected_services",
        mode="before"
    )
    @classmethod
    def normalize_services(
        cls,
        value
    ):

        if isinstance(value, str):
            return [value]

        return value
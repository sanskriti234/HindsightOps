from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List
from datetime import datetime, UTC
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


class Incident(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True
    )

    incident_id: str

    incident_summary: str

    incident_category: str = Field(
        ...,
        alias="category"
    )

    subcategory: str

    severity: Severity

    affected_services: List[str] = Field(
        ...,
        alias="service"
    )

    symptoms: List[str]

    logs: List[str]

    root_cause: str

    resolution: str

    postmortem: str

    preventive_actions: List[str]

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC)
    )

    status: IncidentStatus = IncidentStatus.RESOLVED

    reporter: str = "system-agent"

    tags: List[str] = Field(default_factory=list)

    @field_validator("incident_id")
    @classmethod
    def validate_id_format(cls, value):
        pattern = r"^INC-\d{4}-\d{3,6}$"

        if not re.match(pattern, value):
            raise ValueError(
                "incident_id must follow INC-YYYY-XXX"
            )

        return value
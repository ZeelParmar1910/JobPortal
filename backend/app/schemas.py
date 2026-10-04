from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

Status = Literal["Applied", "Interview", "Offer", "Rejected", "Accepted"]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ApplicationBase(BaseModel):
    company: str
    role: str
    track: str
    status: Status = "Applied"
    notes: str | None = None
    date_applied: date


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    track: str | None = None
    status: Status | None = None
    notes: str | None = None
    date_applied: date | None = None


class ApplicationOut(ApplicationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalyticsSummary(BaseModel):
    total_applications: int
    total_responses: int
    response_rate: float
    by_track: dict[str, int]
    by_status: dict[str, int]

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.security_event import EventSeverity, EventStatus


class SecurityEventCreate(BaseModel):
    event_type: str = Field(min_length=2, max_length=120)
    severity: EventSeverity
    status: EventStatus = EventStatus.OPEN
    description: str = Field(min_length=3)


class SecurityEventUpdate(BaseModel):
    severity: EventSeverity | None = None
    status: EventStatus | None = None
    description: str | None = Field(default=None, min_length=3)


class SecurityEventRead(BaseModel):
    id: int
    event_type: str
    severity: EventSeverity
    status: EventStatus
    description: str
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

from datetime import datetime

from pydantic import BaseModel


class AuditLogRead(BaseModel):
    id: int
    action: str
    resource_type: str
    resource_id: str | None
    details: str | None
    actor_user_id: int | None
    created_at: datetime

    class Config:
        from_attributes = True

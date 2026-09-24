from datetime import datetime

from pydantic import BaseModel

from app.schemas.audit import AuditLogRead


class DashboardMetrics(BaseModel):
    tenant_name: str
    user_count: int
    campaign_count: int
    open_events: int
    critical_events: int
    recent_activity: list[AuditLogRead]

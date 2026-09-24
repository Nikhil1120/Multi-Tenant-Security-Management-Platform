from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.campaign import Campaign
from app.models.security_event import EventSeverity, EventStatus, SecurityEvent
from app.models.user import User
from app.schemas.dashboard import DashboardMetrics

router = APIRouter()


@router.get("/metrics", response_model=DashboardMetrics)
def dashboard_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    user_count = db.scalar(select(func.count()).select_from(User).where(User.tenant_id == tenant_id)) or 0
    campaign_count = db.scalar(select(func.count()).select_from(Campaign).where(Campaign.tenant_id == tenant_id)) or 0
    open_events = (
        db.scalar(
            select(func.count())
            .select_from(SecurityEvent)
            .where(
                SecurityEvent.tenant_id == tenant_id,
                SecurityEvent.status.in_([EventStatus.OPEN, EventStatus.INVESTIGATING]),
            )
        )
        or 0
    )
    critical_events = (
        db.scalar(
            select(func.count())
            .select_from(SecurityEvent)
            .where(SecurityEvent.tenant_id == tenant_id, SecurityEvent.severity == EventSeverity.CRITICAL)
        )
        or 0
    )
    recent_activity = db.scalars(
        select(AuditLog)
        .where(AuditLog.tenant_id == tenant_id)
        .order_by(AuditLog.created_at.desc())
        .limit(8)
    ).all()

    return DashboardMetrics(
        tenant_name=current_user.tenant.name,
        user_count=user_count,
        campaign_count=campaign_count,
        open_events=open_events,
        critical_events=critical_events,
        recent_activity=recent_activity,
    )

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.user import User


def record_audit(
    db: Session,
    *,
    tenant_id: int,
    actor: User | None,
    action: str,
    resource_type: str,
    resource_id: str | int | None = None,
    details: str | None = None,
) -> None:
    entry = AuditLog(
        tenant_id=tenant_id,
        actor_user_id=actor.id if actor else None,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id is not None else None,
        details=details,
    )
    db.add(entry)

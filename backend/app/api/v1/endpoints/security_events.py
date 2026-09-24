import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.core.permissions import Role
from app.db.session import get_db
from app.models.security_event import EventSeverity, EventStatus, SecurityEvent
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.security_event import SecurityEventCreate, SecurityEventRead, SecurityEventUpdate
from app.services.audit import record_audit

router = APIRouter()


@router.get("", response_model=PaginatedResponse[SecurityEventRead])
def list_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    severity: EventSeverity | None = None,
    status_filter: EventStatus | None = Query(default=None, alias="status"),
    event_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(SecurityEvent).where(SecurityEvent.tenant_id == current_user.tenant_id)
    if severity:
        stmt = stmt.where(SecurityEvent.severity == severity)
    if status_filter:
        stmt = stmt.where(SecurityEvent.status == status_filter)
    if event_type:
        stmt = stmt.where(SecurityEvent.event_type.ilike(f"%{event_type}%"))

    stmt = stmt.order_by(SecurityEvent.created_at.desc())
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    events = db.scalars(stmt.offset((page - 1) * page_size).limit(page_size)).all()
    pages = max(1, math.ceil(total / page_size)) if total else 1
    return PaginatedResponse(items=events, total=total, page=page, page_size=page_size, pages=pages)


@router.post("", response_model=SecurityEventRead, status_code=status.HTTP_201_CREATED)
def create_event(
    payload: SecurityEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    event = SecurityEvent(
        tenant_id=current_user.tenant_id,
        event_type=payload.event_type,
        severity=payload.severity,
        status=payload.status,
        description=payload.description,
    )
    db.add(event)
    db.flush()
    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="SECURITY_EVENT_CREATED",
        resource_type="security_event",
        resource_id=event.id,
        details=f"Event {event.event_type} ({event.severity.value})",
    )
    db.commit()
    db.refresh(event)
    return event


@router.patch("/{event_id}", response_model=SecurityEventRead)
def update_event(
    event_id: int,
    payload: SecurityEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    event = db.get(SecurityEvent, event_id)
    if not event or event.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if payload.severity is not None:
        event.severity = payload.severity
    if payload.status is not None:
        event.status = payload.status
    if payload.description is not None:
        event.description = payload.description

    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="SECURITY_EVENT_UPDATED",
        resource_type="security_event",
        resource_id=event.id,
        details=f"Updated security event {event.id}",
    )
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", response_model=MessageResponse)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN)),
):
    event = db.get(SecurityEvent, event_id)
    if not event or event.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="SECURITY_EVENT_DELETED",
        resource_type="security_event",
        resource_id=event_id,
        details="Security event deleted",
    )
    db.commit()
    return MessageResponse(message="Event deleted")

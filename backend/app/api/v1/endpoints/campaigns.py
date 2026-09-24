import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.deps import get_current_user, require_roles
from app.core.permissions import Role, can_manage_campaigns
from app.db.session import get_db
from app.models.campaign import Campaign, CampaignStatus, campaign_assignments
from app.models.user import User, UserRole
from app.schemas.campaign import CampaignAssignRequest, CampaignCreate, CampaignRead, CampaignUpdate
from app.schemas.common import MessageResponse, PaginatedResponse
from app.services.audit import record_audit
from app.services.campaigns import validate_status_transition

router = APIRouter()


def _campaign_query_for_user(user: User):
    stmt = select(Campaign).where(Campaign.tenant_id == user.tenant_id).options(selectinload(Campaign.assigned_users))
    if user.role == UserRole.USER:
        stmt = stmt.join(campaign_assignments).where(campaign_assignments.c.user_id == user.id)
    return stmt


def _get_campaign_or_404(db: Session, user: User, campaign_id: int) -> Campaign:
    campaign = db.scalar(
        select(Campaign)
        .where(Campaign.id == campaign_id, Campaign.tenant_id == user.tenant_id)
        .options(selectinload(Campaign.assigned_users))
    )
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    if user.role == UserRole.USER and user not in campaign.assigned_users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign


@router.get("", response_model=PaginatedResponse[CampaignRead])
def list_campaigns(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status_filter: CampaignStatus | None = Query(default=None, alias="status"),
    sort_by: str = Query("created_at"),
    sort_dir: str = Query("desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = _campaign_query_for_user(current_user)
    if search:
        like = f"%{search}%"
        stmt = stmt.where(or_(Campaign.name.ilike(like), Campaign.description.ilike(like)))
    if status_filter:
        stmt = stmt.where(Campaign.status == status_filter)

    sort_column = getattr(Campaign, sort_by, Campaign.created_at)
    stmt = stmt.order_by(sort_column.desc() if sort_dir.lower() == "desc" else sort_column.asc())

    stmt = stmt.distinct()
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    campaigns = db.scalars(stmt.offset((page - 1) * page_size).limit(page_size)).all()
    pages = max(1, math.ceil(total / page_size)) if total else 1
    return PaginatedResponse(items=campaigns, total=total, page=page, page_size=page_size, pages=pages)


@router.post("", response_model=CampaignRead, status_code=status.HTTP_201_CREATED)
def create_campaign(
    payload: CampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    campaign = Campaign(
        tenant_id=current_user.tenant_id,
        name=payload.name,
        description=payload.description,
        status=payload.status,
        created_by_id=current_user.id,
    )
    db.add(campaign)
    db.flush()
    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="CAMPAIGN_CREATED",
        resource_type="campaign",
        resource_id=campaign.id,
        details=f"Campaign '{campaign.name}' created",
    )
    db.commit()
    db.refresh(campaign)
    return campaign


@router.get("/{campaign_id}", response_model=CampaignRead)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_campaign_or_404(db, current_user, campaign_id)


@router.patch("/{campaign_id}", response_model=CampaignRead)
def update_campaign(
    campaign_id: int,
    payload: CampaignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not can_manage_campaigns(Role(current_user.role.value)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    campaign = _get_campaign_or_404(db, current_user, campaign_id)
    if payload.status is not None:
        validate_status_transition(campaign.status, payload.status)
        campaign.status = payload.status
    if payload.name is not None:
        campaign.name = payload.name
    if payload.description is not None:
        campaign.description = payload.description

    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="CAMPAIGN_UPDATED",
        resource_type="campaign",
        resource_id=campaign.id,
        details=f"Campaign '{campaign.name}' updated",
    )
    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete("/{campaign_id}", response_model=MessageResponse)
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    campaign = _get_campaign_or_404(db, current_user, campaign_id)
    name = campaign.name
    db.delete(campaign)
    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="CAMPAIGN_DELETED",
        resource_type="campaign",
        resource_id=campaign_id,
        details=f"Campaign '{name}' deleted",
    )
    db.commit()
    return MessageResponse(message="Campaign deleted")


@router.post("/{campaign_id}/assign", response_model=CampaignRead)
def assign_user(
    campaign_id: int,
    payload: CampaignAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    campaign = _get_campaign_or_404(db, current_user, campaign_id)
    user = db.get(User, payload.user_id)
    if not user or user.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in tenant")

    if user not in campaign.assigned_users:
        campaign.assigned_users.append(user)
        record_audit(
            db,
            tenant_id=current_user.tenant_id,
            actor=current_user,
            action="CAMPAIGN_USER_ASSIGNED",
            resource_type="campaign",
            resource_id=campaign.id,
            details=f"Assigned user {user.email} to campaign '{campaign.name}'",
        )
    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete("/{campaign_id}/assign/{user_id}", response_model=CampaignRead)
def remove_user(
    campaign_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.MANAGER)),
):
    campaign = _get_campaign_or_404(db, current_user, campaign_id)
    user = db.get(User, user_id)
    if not user or user.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in tenant")

    if user in campaign.assigned_users:
        campaign.assigned_users.remove(user)
        record_audit(
            db,
            tenant_id=current_user.tenant_id,
            actor=current_user,
            action="CAMPAIGN_USER_REMOVED",
            resource_type="campaign",
            resource_id=campaign.id,
            details=f"Removed user {user.email} from campaign '{campaign.name}'",
        )
    db.commit()
    db.refresh(campaign)
    return campaign

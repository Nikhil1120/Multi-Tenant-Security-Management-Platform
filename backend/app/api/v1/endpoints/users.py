import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.core.permissions import Role
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.audit import record_audit

router = APIRouter()


@router.get("", response_model=PaginatedResponse[UserRead])
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(User).where(User.tenant_id == current_user.tenant_id)
    if search:
        like = f"%{search}%"
        stmt = stmt.where((User.full_name.ilike(like)) | (User.email.ilike(like)))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    users = db.scalars(
        stmt.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    ).all()
    pages = max(1, math.ceil(total / page_size)) if total else 1
    return PaginatedResponse(items=users, total=total, page=page, page_size=page_size, pages=pages)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN)),
):
    exists = db.scalar(
        select(User).where(User.tenant_id == current_user.tenant_id, User.email == payload.email)
    )
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists in tenant")

    user = User(
        tenant_id=current_user.tenant_id,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()
    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="USER_CREATED",
        resource_type="user",
        resource_id=user.id,
        details=f"Created user {user.email} with role {user.role.value}",
    )
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN)),
):
    user = db.get(User, user_id)
    if not user or user.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active

    record_audit(
        db,
        tenant_id=current_user.tenant_id,
        actor=current_user,
        action="USER_UPDATED",
        resource_type="user",
        resource_id=user.id,
        details=f"Updated user {user.email}",
    )
    db.commit()
    db.refresh(user)
    return user

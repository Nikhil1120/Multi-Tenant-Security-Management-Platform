from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthUser, TokenResponse
from app.services.audit import record_audit

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == form_data.username)
    user = db.scalar(stmt)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token(
        str(user.id),
        {"tenant_id": user.tenant_id, "role": user.role.value},
    )
    record_audit(
        db,
        tenant_id=user.tenant_id,
        actor=user,
        action="LOGIN",
        resource_type="user",
        resource_id=user.id,
        details=f"User {user.email} logged in",
    )
    db.commit()
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AuthUser)
def me(current_user: User = Depends(get_current_user)):
    return AuthUser(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        tenant_id=current_user.tenant_id,
        tenant_name=current_user.tenant.name,
    )

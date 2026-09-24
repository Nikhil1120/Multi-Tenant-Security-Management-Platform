from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthUser(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    tenant_id: int
    tenant_name: str

    class Config:
        from_attributes = True

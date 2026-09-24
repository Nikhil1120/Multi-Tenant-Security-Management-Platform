from datetime import datetime

from pydantic import BaseModel, Field

from app.models.campaign import CampaignStatus
from app.schemas.user import UserRead


class CampaignBase(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None


class CampaignCreate(CampaignBase):
    status: CampaignStatus = CampaignStatus.DRAFT


class CampaignUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    status: CampaignStatus | None = None


class CampaignRead(CampaignBase):
    id: int
    status: CampaignStatus
    tenant_id: int
    created_at: datetime
    updated_at: datetime
    assigned_users: list[UserRead] = []

    class Config:
        from_attributes = True


class CampaignAssignRequest(BaseModel):
    user_id: int

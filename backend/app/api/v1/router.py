from fastapi import APIRouter

from app.api.v1.endpoints import audit, auth, campaigns, dashboard, security_events, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
api_router.include_router(security_events.router, prefix="/security-events", tags=["security-events"])
api_router.include_router(audit.router, prefix="/audit-logs", tags=["audit-logs"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

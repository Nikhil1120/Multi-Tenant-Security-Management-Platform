from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.campaign import Campaign, CampaignStatus
from app.models.security_event import EventSeverity, EventStatus, SecurityEvent
from app.models.tenant import Tenant
from app.models.user import User, UserRole


def seed_database() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(Tenant).limit(1)):
            return

        tenant_a = Tenant(name="Acme Security", slug="acme")
        tenant_b = Tenant(name="Globex Cyber", slug="globex")
        db.add_all([tenant_a, tenant_b])
        db.flush()

        users = [
            User(
                tenant_id=tenant_a.id,
                email="admin@acme.test",
                full_name="Acme Admin",
                hashed_password=hash_password("Admin@123"),
                role=UserRole.ADMIN,
            ),
            User(
                tenant_id=tenant_a.id,
                email="manager@acme.test",
                full_name="Acme Manager",
                hashed_password=hash_password("Manager@123"),
                role=UserRole.MANAGER,
            ),
            User(
                tenant_id=tenant_a.id,
                email="user@acme.test",
                full_name="Acme User",
                hashed_password=hash_password("User@123"),
                role=UserRole.USER,
            ),
            User(
                tenant_id=tenant_b.id,
                email="admin@globex.test",
                full_name="Globex Admin",
                hashed_password=hash_password("Admin@123"),
                role=UserRole.ADMIN,
            ),
        ]
        db.add_all(users)
        db.flush()

        campaign_a = Campaign(
            tenant_id=tenant_a.id,
            name="Phishing Awareness Q3",
            description="Employee phishing simulation",
            status=CampaignStatus.ACTIVE,
            created_by_id=users[1].id,
        )
        campaign_b = Campaign(
            tenant_id=tenant_b.id,
            id=201,
            name="Tenant B Incident Response",
            description="Cross-tenant isolation test campaign",
            status=CampaignStatus.ACTIVE,
            created_by_id=users[3].id,
        )
        db.add_all([campaign_a, campaign_b])
        db.flush()
        campaign_a.assigned_users.append(users[2])

        events = [
            SecurityEvent(
                tenant_id=tenant_a.id,
                event_type="FAILED_LOGIN",
                severity=EventSeverity.MEDIUM,
                status=EventStatus.OPEN,
                description="Multiple failed logins detected for user@acme.test",
            ),
            SecurityEvent(
                tenant_id=tenant_a.id,
                event_type="MALWARE_ALERT",
                severity=EventSeverity.CRITICAL,
                status=EventStatus.INVESTIGATING,
                description="Endpoint agent flagged suspicious process",
            ),
            SecurityEvent(
                tenant_id=tenant_b.id,
                event_type="POLICY_VIOLATION",
                severity=EventSeverity.HIGH,
                status=EventStatus.OPEN,
                description="Unauthorized USB device on secure workstation",
            ),
        ]
        db.add_all(events)
        db.commit()
        if db.bind and db.bind.dialect.name == "postgresql":
            from sqlalchemy import text

            db.execute(
                text(
                    "SELECT setval(pg_get_serial_sequence('campaigns', 'id'), "
                    "(SELECT COALESCE(MAX(id), 1) FROM campaigns))"
                )
            )
            db.commit()
    finally:
        db.close()

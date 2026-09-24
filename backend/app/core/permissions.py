from enum import Enum


class Role(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    USER = "USER"


ROLE_HIERARCHY = {Role.ADMIN: 3, Role.MANAGER: 2, Role.USER: 1}


def role_at_least(user_role: Role, required: Role) -> bool:
    return ROLE_HIERARCHY[user_role] >= ROLE_HIERARCHY[required]


def can_manage_users(role: Role) -> bool:
    return role == Role.ADMIN


def can_manage_campaigns(role: Role) -> bool:
    return role in {Role.ADMIN, Role.MANAGER}


def can_view_audit_logs(role: Role) -> bool:
    return role in {Role.ADMIN, Role.MANAGER}


def can_manage_security_events(role: Role) -> bool:
    return role in {Role.ADMIN, Role.MANAGER}

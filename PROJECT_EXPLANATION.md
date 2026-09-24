# Project Explanation

## What this application does

This is a **Multi-Tenant Security Management Platform** built for the Deep Trace Cybernetics full-stack assessment. Each organization (tenant) uses the same deployed app, but users only see and modify data for their own tenant.

Main modules:

1. **Authentication** — Email/password login, JWT access token, bcrypt hashing.
2. **RBAC** — `ADMIN`, `MANAGER`, `USER` with backend-enforced permissions.
3. **Campaigns** — CRUD, status workflow, assign/remove users.
4. **Security Events** — Log incidents with severity/status, filter and paginate.
5. **Audit Logs** — Track sensitive actions (login, campaign/user changes).
6. **Dashboard** — Tenant metrics and recent activity feed.

## Why this architecture

The project follows the same layered flow used in your previous full-stack builds:

`React (Vite) → API Service Layer → FastAPI Routes → Auth/RBAC → Services → PostgreSQL/SQLite`

Benefits:
- Clear separation of UI, transport, authorization, and business rules
- Easy to test tenant isolation in the service/query layer
- Frontend stays thin (no trusted tenant/role values from client)

## Assessment mapping

| PDF requirement | Implementation |
|---|---|
| JWT + protected APIs | `core/security.py`, `core/deps.py`, `/api/auth/*` |
| RBAC (ADMIN/MANAGER/USER) | `core/permissions.py` + route dependencies |
| Multi-tenancy isolation | `tenant_id` scoping in all queries |
| Campaign module | `/api/campaigns` + assignments table |
| Security events + filters | `/api/security-events` |
| Audit logs | `services/audit.py`, `/api/audit-logs` |
| React screens | `frontend/src/pages/*` |
| SQL + pagination | SQLAlchemy ORM + paginated list endpoints |
| Cross-tenant scenario | Campaign `201` seeded in Tenant B; Tenant A gets `404` |

## Demo script (for your video)

1. Login as `admin@acme.test` / `Admin@123`.
2. Show dashboard counts and recent login audit entry.
3. Create/update a campaign and assign `user@acme.test`.
4. Open security events and filter by `CRITICAL`.
5. Open users list and (as admin) create a user.
6. In Swagger or browser devtools, call `GET /api/campaigns/201` with Tenant A token → `404`.
7. Logout and login as `admin@globex.test` → campaign `201` is visible.

## Submission artifacts in repo

- `docs/Deep_Trace_Full_Stack_Assessment.pdf` — original brief
- `docs/assignment-extracted.txt` — extracted text
- `SYSTEM_DESIGN.md` — architecture and data model
- `README.md` — setup, credentials, security notes

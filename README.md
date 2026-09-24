# Deep Trace Cybernetics — Multi-Tenant Security Management Platform

Full-stack assessment implementation for a simplified **multi-tenant security management platform** with JWT auth, RBAC, tenant isolation, campaigns, security events, and audit logs.

**Stack (as requested):**
- Frontend: React + Vite
- Backend: Python + FastAPI
- Database: PostgreSQL

> The official PDF mentions Node/Express; this repository uses **FastAPI** per your instruction while meeting the same functional and security requirements.

## Project structure

```
Deep Trace Cybernetics/
├── frontend/                 # React UI (pages, layouts, API client, auth context)
├── backend/
│   └── app/
│       ├── api/v1/endpoints/ # Route handlers
│       ├── core/             # Config, JWT, RBAC, dependencies
│       ├── db/               # SQLAlchemy engine/session
│       ├── models/           # ORM models
│       ├── schemas/          # Pydantic DTOs
│       ├── services/         # Business rules + audit helper
│       └── scripts/seed.py   # Demo tenants/users/data
├── docs/                     # Assessment PDF + extracted notes
├── docker-compose.yml        # PostgreSQL
├── SYSTEM_DESIGN.md
└── README.md
```

## System flow

`React UI → API client (Axios) → FastAPI routes → Auth/RBAC deps → Services → PostgreSQL`

Tenant and role are taken from the **JWT + database user**, never from client-supplied `tenantId`.

## Quick start

### 1) Database

```bash
docker compose up -d
```

### 2) Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

### 3) Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

## Seed credentials

| Tenant | Email | Password | Role |
|---|---|---|---|
| Acme Security (A) | admin@acme.test | Admin@123 | ADMIN |
| Acme Security (A) | manager@acme.test | Manager@123 | MANAGER |
| Acme Security (A) | user@acme.test | User@123 | USER |
| Globex Cyber (B) | admin@globex.test | Admin@123 | ADMIN |

**Cross-tenant test:** Campaign `201` belongs to **Tenant B**. Log in as `admin@acme.test` and call `GET /api/campaigns/201` → **404** (no Tenant B data leaked).

## Core API surface

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST/PATCH /api/users` (admin user management)
- `GET/POST/PATCH/DELETE /api/campaigns`, assign/remove users
- `GET/POST/PATCH/DELETE /api/security-events`
- `GET /api/audit-logs` (ADMIN/MANAGER)
- `GET /api/dashboard/metrics`

## Security highlights

- Bcrypt password hashing
- JWT access tokens
- RBAC: `ADMIN`, `MANAGER`, `USER`
- Tenant scoping on every query (`tenant_id` from authenticated user)
- Server-side pagination/filtering/sorting
- SQLAlchemy ORM (parameterized queries)
- Audit log entries for login and sensitive mutations

## Engineering notes (README answers)

### Scale to 1,000 tenants / 1M users
- Shard or partition by `tenant_id`, read replicas for reporting, connection pooling (PgBouncer), cache hot dashboard aggregates (Redis), async workers for audit/event ingestion, and per-tenant rate limits at API gateway.

### JWT revocation
- Short-lived access tokens + refresh tokens stored server-side (or token version on user row). For immediate revoke, maintain a denylist/redis set of `jti` until expiry, or rotate `token_version` on logout/password reset and validate on each request.

### Troubleshoot many 500 errors in production
- Check structured logs/trace IDs, error rate by endpoint, DB latency/connection pool saturation, recent deploys/migrations, and dependency health. Roll back if correlated with release; add alerts on 5xx ratio and p95 latency.

## Submission checklist

- [ ] Push full repo to GitHub
- [ ] Record 5–10 min demo (login, dashboard, campaigns, events, RBAC, cross-tenant 404)
- [ ] Submit repo + Google Drive video link before **24 Sep 2026, 6:00 PM IST**

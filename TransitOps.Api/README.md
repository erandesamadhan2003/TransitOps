# TransitOps API

Production-ready Express.js REST API for the TransitOps fleet management platform.

## Features

- **RBAC & Authentication**: JWT login, bcrypt password hashing, rate-limiting (5 attempts → 15-min lockout), role-based access per route.
- **Vehicle Management**: Full CRUD, status tracking (Available / On Trip / In Shop / Retired), photo upload, document management.
- **Driver Management**: Full CRUD, 4-state status (`Available`, `On Trip`, `Off Duty`, `Suspended`), suspend/reinstate/off-duty/wake endpoints, safety score updates, license expiry tracking, document management.
- **Trip Lifecycle**: Draft → Dispatch → Complete/Cancel with atomic status locking; completes update vehicle odometer and driver status automatically.
- **Maintenance Logs**: Create (sets vehicle to `In Shop`), close (returns vehicle to `Available`), cost tracking.
- **Fuel Logs & Expenses**: Per-vehicle fuel fill records and general expense categories.
- **Dashboard Analytics**: Aggregated KPIs, vehicle status breakdown, recent trips, filters by type/status/region.
- **Reports / Analytics**: Fleet utilization, revenue trends, cost breakdown (served to Recharts on frontend).
- **Settings**: Depot name, currency, distance unit stored in DB; GET/PATCH `/settings`.
- **User Management**: Full CRUD + role assignment + bulk import via Excel (`/users/import`) + template download.
- **Documents**: Upload insurance/RC/permit/license scan PDFs for vehicles and drivers; expiry date tracking.
- **Scheduled Jobs**: Daily cron for license-expiry email reminders (requires SMTP config).

## Documentation

Full endpoint reference: [api.md](./api.md)

## Default Seeded Accounts

| Role              | Email                      | Password    |
|-------------------|----------------------------|-------------|
| Admin             | admin@transitops.com       | password123 |
| Fleet Manager     | fleet@transitops.com       | password123 |
| Dispatcher        | dispatcher@transitops.com  | password123 |
| Safety Officer    | safety@transitops.com      | password123 |
| Financial Analyst | finance@transitops.com     | password123 |

## Developer Setup

### 1. Environment

```bash
cp .env.example .env
# Fill in: DB_URL (PostgreSQL), JWT_SECRET, optional SMTP_* settings
```

### 2. Install & Migrate

```bash
# Using bun (recommended):
bun install
bun run migrate        # schema + seeds
bun run dev            # dev server on port 5000

# Using npm:
npm install
npm run migrate
npm run dev
```

### 3. Optional Docker (PostgreSQL only)

```bash
docker-compose up -d postgres
```

## Roles

`Admin` · `Fleet Manager` · `Dispatcher` · `Safety Officer` · `Financial Analyst`

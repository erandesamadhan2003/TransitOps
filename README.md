# TransitOps

A production-ready, full-stack fleet operations management platform for dispatching trips, tracking vehicles, managing drivers, logging fuel & expenses, and reporting analytics — all behind a role-based access control system.

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/erandesamadhan2003/TransitOps.git
cd TransitOps

# 2. API
cd TransitOps.Api
cp .env.example .env          # fill in DB_URL and optional SMTP settings
bun install
bun run migrate               # creates schema + seeds all default users
bun run dev                   # starts on http://localhost:5000

# 3. Web (new terminal)
cd ../TransitOps.web
bun install
bun dev                       # starts on http://localhost:5173
```

---

## Default Credentials

| Role              | Email                      | Password    |
|-------------------|----------------------------|-------------|
| Admin             | admin@transitops.com       | password123 |
| Fleet Manager     | fleet@transitops.com       | password123 |
| Dispatcher        | dispatcher@transitops.com  | password123 |
| Safety Officer    | safety@transitops.com      | password123 |
| Financial Analyst | finance@transitops.com     | password123 |

---

## Feature Modules

| Module             | Implemented Features |
|--------------------|----------------------|
| **Auth**           | JWT login, bcrypt passwords, rate limiting (5 attempts / 15 min lockout), RBAC route guards |
| **Dashboard**      | Live KPI cards, vehicle status breakdown chart, recent trips list, dynamic frontend filtering |
| **Fleet**          | Vehicle CRUD, status tracking (Pending → Available → On Trip → In Shop), odometer auto-update |
| **Drivers**        | Driver CRUD, status tracking, automated background license expiry alerts (via Node-Cron) |
| **Trips**          | Transactional DB dispatching, available-only dropdowns, actual distance & fuel calculation |
| **Maintenance**    | Automated vehicle status syncing (In Shop), close records, repair cost tracking |
| **Compliance**     | Upload & verify documents (insurance, licenses). Unverified assets cannot be dispatched. |
| **Analytics**      | 6-month visual trends for utilization, revenue, and fuel costs. 1-click **PDF & CSV Exports**. |
| **Settings**       | Depot configuration, currency, distance unit settings; read-only RBAC matrix |
| **Users**          | Full CRUD, role assignment, bulk Excel import (`/users/import`), Excel template download |

---

## Role & Access Control (RBAC)

| Module         | Admin | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|----------------|-------|---------------|------------|----------------|-------------------|
| Fleet          | edit  | edit          | view       | none           | view              |
| Drivers        | edit  | edit          | none       | edit           | none              |
| Trips          | edit  | none          | edit       | view           | none              |
| Fuel/Expenses  | edit  | none          | none       | none           | edit              |
| Analytics      | edit  | edit          | none       | none           | edit              |

Route-level guards (`RequirePermission`) redirect unauthorized access to `/dashboard` instead of returning broken screens.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **API** | Node.js · Express · PostgreSQL · JWT · bcrypt · Bun · Nodemon |
| **Web** | React 19 · Vite · TanStack Query · TanStack Table · React Router v7 · Zod · Recharts · Tailwind v4 |

---

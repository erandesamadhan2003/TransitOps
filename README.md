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
| **Dashboard**      | Live KPI cards (vehicles, trips, drivers), vehicle status breakdown chart, recent trips list, type/status/region filters |
| **Fleet**          | Vehicle CRUD, status tracking (Available/On Trip/In Shop/Retired), odometer auto-update on trip completion |
| **Drivers**        | Driver CRUD, 4-state status toggle (Available ↔ Off Duty, Suspend ↔ Reinstate), safety scores, license expiry alerts |
| **Trips**          | Draft → Dispatch → Complete/Cancel lifecycle, available-only vehicle+driver dropdowns, actual distance & fuel on completion |
| **Maintenance**    | Log vehicle issues (marks vehicle In Shop), close records, cost tracking |
| **Fuel & Expenses**| Fuel logs + general expense tracking per vehicle |
| **Analytics**      | Fleet utilization, revenue, trip volume, fuel cost trends (Recharts) |
| **Settings**       | Depot name, currency, distance unit; read-only RBAC matrix |
| **User Management**| Full CRUD, role assignment, bulk Excel import (`/users/import`), Excel template download |
| **Documents**      | Upload insurance/RC/permit/license scans (vehicle & driver), expiry badges |
| **Dark Mode**      | Toggle persisted in `localStorage`, full CSS variable overrides |
| **Mobile**         | Responsive mobile drawer sidebar, hamburger navigation |

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

## Intentional Deviations from the Wireframes

### Login — Role dropdown removed
The mockup included a "Role" dropdown. This was removed. Role is a server-side attribute — clients must not self-declare their role at login time. Use the seed accounts above to switch personas.

### Forgot Password
The UI flow is complete but the backend email-sending step is not yet wired (requires SMTP configuration). The button is wired, the screen is not a dead link.

# TransitOps — Web Application

React 19 single-page application for the TransitOps fleet management platform.

## Tech Stack

- **React 19** — UI framework
- **Vite** — build tool and dev server
- **TanStack Query v5** — server state, caching, and mutation management
- **TanStack Table v8** — headless table rendering
- **React Router v7** — client-side routing with lazy-loaded pages
- **Zod** — runtime schema validation for all forms
- **Recharts** — analytics charts
- **Tailwind CSS v4** — utility-first styling with a custom design system

---

## Development

```bash
bun install
bun dev           # starts on http://localhost:5173
bun run build     # production bundle
```

The API URL is configured via `VITE_API_URL` in `.env` (defaults to `http://localhost:5000/api`).

---

## Project Structure

```
src/
├── api/                  # axios instance, interceptors, all endpoint paths
├── components/
│   ├── common/           # Table (smart TanStack wrapper), Modal, Button, Input...
│   ├── forms/            # Select, Textarea
│   ├── layout/           # AppLayout, Sidebar (desktop hover + mobile drawer), Navbar
│   ├── charts/           # Recharts wrappers: StatusBreakdownBars, CostliestVehiclesBars...
│   └── ui/               # Card, Badge, StatusBadge, StatCard
├── constants/            # app.js (status enums, RBAC roles), routes.js
├── features/             # one folder per module
│   ├── auth/             # LoginPage, forgot password
│   ├── dashboard/        # DashboardPage, KPI cards, filters, charts
│   ├── vehicles/         # VehiclesPage, VehicleFormModal, VehicleFilters
│   ├── drivers/          # DriversPage (4-state status toggle), DriverFormModal
│   ├── trips/            # TripsPage, TripFormModal, CompleteModal
│   ├── maintenance/      # MaintenancePage, MaintenanceFormModal
│   ├── expenses/         # ExpensesPage (fuel logs + general expenses)
│   ├── reports/          # ReportsPage (analytics charts)
│   ├── settings/         # SettingsPage, RBAC matrix display
│   └── users/            # UsersPage, UserFormModal, ImportUsersModal
├── hooks/                # useDebounce, useToast, useTheme (dark mode), useMediaQuery
├── routes/               # AppRouter, ProtectedRoute, RequirePermission
├── services/             # auth.service, permission.service, storage.service
├── styles/               # theme.css (CSS variables + dark mode overrides)
└── utils/                # format.js, cn.js, validators.js
```

---

## Dark Mode

Toggled via the Moon/Sun button in the mobile Navbar and the floating button on desktop.  
Preference is persisted in `localStorage` under the key `"theme"`.  
The `.dark` class is applied to `<html>` and overrides all CSS variables defined in `styles/theme.css`.

---

## RBAC & Route Guards

- `RequirePermission` wraps each protected route and redirects to `/dashboard` if the current user's role lacks access.
- Sidebar links are also hidden for inaccessible modules using `permissionService.can(module, "view")`.
- The `Users` page is restricted to `Admin` role only (both sidebar and route-level).

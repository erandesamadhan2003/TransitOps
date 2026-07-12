# TransitOps

A full-stack fleet management platform.

## Quick Start

```bash
# API
cd TransitOps.Api
bun install
bun run migrate   # creates schema + seeds default users
bun run dev       # http://localhost:5000

# Web
cd TransitOps.web
bun install
bun dev           # http://localhost:5173
```

## Default Credentials

| Role              | Email                       | Password      |
|-------------------|-----------------------------|---------------|
| Admin             | admin@transitops.com        | password123   |
| Fleet Manager     | fleet@transitops.com        | password123   |
| Dispatcher        | dispatcher@transitops.com   | password123   |
| Safety Officer    | safety@transitops.com       | password123   |
| Financial Analyst | finance@transitops.com      | password123   |

## Intentional Deviations from the Wireframes

### Login screen — Role (RBAC) dropdown removed

The original mockup included a "Role" dropdown on the login screen so reviewers
could quickly switch between personas. **This was intentionally removed** from the
production implementation.

**Reason:** Role is an attribute of the server-side user account, not something
a user selects at login time. Allowing a client to declare its own role at
authentication is a security anti-pattern. The same demo experience is achieved
by logging in with the role-specific seed accounts listed in the table above.

This is a deliberate architectural decision, not an oversight.

### "Forgot password?" flow

The Forgot Password screen collects an email address and shows a confirmation
message, but the backend endpoint for actually sending a reset email is not yet
implemented. The UI clearly labels this as a placeholder ("coming soon"). The
button is fully wired — it is not a dead link.

## Tech Stack

**API** — Node.js · Express · PostgreSQL · JWT · bcrypt · Bun
**Web** — React 19 · Vite · TanStack Query · React Router v7 · Zod · Recharts · Tailwind v4

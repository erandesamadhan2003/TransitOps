# TransitOps API 

A comprehensive backend ERP API for fleet and transit operations.

## Features

- **RBAC & Authentication**: JWT-based login with role-based access control (Admin, Fleet Manager, Dispatcher, Safety Officer, Financial Analyst).
- **Vehicle & Driver Management**: Status tracking, photo uploads, and document management (PDFs/Images).
- **Trip Operations**: Draft, dispatch, and complete trips with atomic state locking.
- **Maintenance & Fuel Logs**: Cost tracking and fleet utilization.
- **Settings & CSV Exports**: Global configurations and data export capabilities.
- **Scheduled Jobs**: Daily cron jobs for license-expiry email reminders.

## Documentation

Full endpoint documentation is available in [api.md](./api.md).

## Default Seeded Accounts

After running the database seed (`npm run seed`), several test accounts will be created for each role (e.g., `admin@transitops.com`, `fleet@transitops.com`, `dispatcher@transitops.com`).
The default password for all seeded accounts is: **`password123`**

## Developer Setup

You can use either `bun` or `npm`.

### Environment Configuration
First, copy the example environment file and fill in the necessary details (such as your Postgres URL and optional SMTP settings).
```bash
cp .env.example .env 
```

### Installation & Startup

**Using npm:**
```bash
npm install                       # Install dependencies
docker-compose up -d postgres     # Start PostgreSQL database (if using Docker)
npm run drop                      # Drop all tables (if resetting database)
npm run migrate                   # Run DB schema migrations 
npm run seed                      # Run DB seeds (Roles, Users, Demo Data)
npm run dev                       # Start dev server on port 5000 (uses nodemon)
```

**Using bun:**
```bash
bun install                       
docker-compose up -d postgres     
bun run drop                      
bun run migrate                   
bun run seed                      
bun run dev                       
```

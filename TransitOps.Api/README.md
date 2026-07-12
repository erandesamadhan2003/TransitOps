# TransitOps API 

## Developer Setup (Bun)

```bash
cp .env.example .env              # Set up environment variables
bun install                       # Install dependencies
docker-compose up -d postgres     # Start PostgreSQL database
bun run migrate                   # Run DB schema migrations & seeds
bun run dev                       # Start dev server on port 5000
```

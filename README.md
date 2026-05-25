# EPK Template v1

A single-artist EPK template built with Bun, Hono, React, Vite, TailwindCSS, Drizzle, Postgres, TanStack Query, and Zustand.

This project is intentionally set up for one EPK per deployed site. Public pages read from one JSON-backed EPK record, while dashboard writes and uploads require an admin key.

## Project Layout

```txt
apps/web       React + Vite public site and dashboard
apps/server    Hono API, uploads, Postgres persistence
packages/schema shared Zod EPK schema and TypeScript types
examples       example EPK JSON payloads
scripts        local dev and import utilities
```

## Requirements

- Bun
- Docker, for local Postgres

If Bun is installed but not on your shell `PATH`, use `~/.bun/bin/bun` in place of `bun`.

## Install

Install dependencies in each package:

```bash
bun install
cd apps/server && bun install
cd ../web && bun install
cd ../../packages/schema && bun install
```

## Configure

Create the server env file:

```bash
cp apps/server/.env.example apps/server/.env
```

Local defaults:

```txt
DATABASE_URL=postgresql://postgres:password@localhost:5432/epk_db
EPK_SLUG=site
ADMIN_API_KEY=change-me-to-a-long-random-secret
```

`EPK_SLUG` is internal. The public site still uses clean single-artist routes like `/`, `/music`, and `/tour`.

## Database

Start local Postgres:

```bash
docker run -d --name epk-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=epk_db \
  -p 5432:5432 \
  postgres:16-alpine
```

If the container already exists:

```bash
docker start epk-postgres
```

Run migrations:

```bash
cd apps/server
bunx drizzle-kit migrate
```

## Run

From the repo root:

```bash
bun run dev
```

This starts:

- Web: `http://localhost:5173`
- API: `http://localhost:3001`

Public pages:

```txt
/
/music
/videos
/tour
/vip
/shop
/about
/newsletter
```

Dashboard:

```txt
/dashboard
/dashboard/music
```

The dashboard key gate stores the entered key in `localStorage`. Server writes still require `X-Admin-Key`.

## Create An EPK

Use [examples/demo-epk.example.json](examples/demo-epk.example.json) as the expected shape.

Validate only:

```bash
bun run import:epk examples/demo-epk.example.json
```

Import into the running local API:

```bash
bun run import:epk examples/demo-epk.example.json \
  --admin-key "$ADMIN_API_KEY" \
  --confirm
```

The import utility is a safe local tool. It is dry-run by default and only writes when `--confirm` is provided.

## API

Public:

```txt
GET /api/epk
GET /uploads/site/assets/<file>
GET /uploads/site/photos/<file>
GET /uploads/site/branding/<file>
```

Protected by `X-Admin-Key`:

```txt
POST /api/epk
POST /api/upload/:type
```

Valid upload types:

```txt
photos
branding
assets
```

## Verify

Useful checks:

```bash
cd apps/web && bun run build
cd apps/server && bun run ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
```

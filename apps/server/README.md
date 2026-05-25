# EPK Server

Hono API for the single-artist EPK template. It stores one EPK JSON record in Postgres and serves uploaded files from local disk during development.

## Environment

Copy the example env:

```bash
cp .env.example .env
```

Variables:

```txt
DATABASE_URL=postgresql://postgres:password@localhost:5432/epk_db
EPK_SLUG=site
ADMIN_API_KEY=change-me-to-a-long-random-secret
```

`EPK_SLUG` is the internal database key for the single EPK.

## Database

Start Postgres from the repo root:

```bash
docker run -d --name epk-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=epk_db \
  -p 5432:5432 \
  postgres:16-alpine
```

Run migrations:

```bash
bunx drizzle-kit migrate
```

Generate migrations after schema changes:

```bash
bunx drizzle-kit generate
```

## Run

Server only:

```bash
bun run index.ts
```

Full stack from repo root:

```bash
bun run dev
```

## Routes

Public:

```txt
GET /api/epk
GET /uploads/site/assets/<file>
GET /uploads/site/photos/<file>
GET /uploads/site/branding/<file>
```

Protected:

```txt
POST /api/epk
POST /api/upload/:type
```

Protected routes require:

```txt
X-Admin-Key: <ADMIN_API_KEY>
```

Upload types:

```txt
photos
branding
assets
```

## Production Notes

The local server writes uploads to `apps/server/uploads` and serves them from `/uploads/*`. That is useful for local development, but production deployments should use durable object storage such as S3, R2, Vercel Blob, or Cloudinary.

Do not use the example `ADMIN_API_KEY` in production. The server refuses production startup when the key is missing or set to a known local default.

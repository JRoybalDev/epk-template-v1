# EPK Template v1

A single-artist EPK template built with Bun, Hono, React, Vite, TailwindCSS, Drizzle, Postgres, TanStack Query, and Zustand.

This project is intentionally set up for one EPK per deployed site. Public pages read from one JSON-backed EPK record, while dashboard saves and uploads require an admin key.

## Project Layout

```txt
apps/web          React + Vite public site and dashboard
apps/server       Hono API, uploads, Postgres persistence
packages/schema   Shared Zod EPK schema and TypeScript types
examples          Example EPK JSON payloads
scripts           Local dev and import utilities
docs              Production and cleanup handoff docs
```

## Requirements

- Bun
- Docker, for local Postgres

If Bun is installed but not on your shell `PATH`, use `~/.bun/bin/bun` in place of `bun`.

## Quick Start

Install dependencies:

```bash
bun install
cd apps/server && bun install
cd ../web && bun install
cd ../../packages/schema && bun install
```

Create the server env file:

```bash
cp apps/server/.env.example apps/server/.env
```

You can also start from the root env reference:

```bash
cp .env.example apps/server/.env
```

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

List local Docker containers:

```bash
docker ps -a
```

List databases in the local Postgres container:

```bash
docker exec -it epk-postgres psql -U postgres -l
```

If the app logs `password authentication failed for user "postgres"`, make sure `DATABASE_URL` uses the same password the Docker container was created with. Container passwords are set at creation time.

Run migrations:

```bash
cd apps/server
bunx drizzle-kit migrate
cd ../..
```

Start the API and web app together:

```bash
bun run dev
```

Local URLs:

```txt
Web: http://localhost:5173
API: http://localhost:3001
Dashboard: http://localhost:5173/dashboard
```

## Environment

Local defaults:

```txt
DATABASE_URL=postgresql://postgres:password@localhost:5432/epk_db
EPK_SLUG=site
ADMIN_API_KEY=change-me-to-a-long-random-secret
```

`EPK_SLUG` is internal and should normally stay `site`. Public routes stay clean single-artist routes like `/`, `/music`, and `/tour`.

`ADMIN_API_KEY` is required for dashboard saves and uploads. The dashboard key gate stores the entered key in `localStorage`, but the server still protects writes with the `X-Admin-Key` header.

## Create An EPK

Use [examples/demo-epk.example.json](examples/demo-epk.example.json) as the expected shape.

## Documentation Guide

Use these docs for different audiences:

| Document | Intended recipient | Purpose |
| --- | --- | --- |
| [docs/client-marketing-content-kit.md](docs/client-marketing-content-kit.md) | Clients, artist teams, managers, labels, and marketing teams | Plain-language content intake guide explaining what each field means, what is optional, and how EPK data is handled. |
| [docs/frontend-handoff.md](docs/frontend-handoff.md) | Frontend developers and designers | Explains the data-ready frontend scaffold, routed public components, logic boundaries, and what visual/frontend work is intentionally unfinished. |
| [docs/production-checklist.md](docs/production-checklist.md) | Developers, launch managers, and deployment owners | Pre-launch checklist for environment variables, database migrations, media storage, dashboard access, routes, metadata, and final handoff. |
| [docs/template-cleanup.md](docs/template-cleanup.md) | Developers or content admins preparing a real artist site | Checklist for replacing demo content, removing placeholder URLs, confirming media paths, and preparing the final EPK. |
| [packages/schema/README.md](packages/schema/README.md) | Developers and technical content admins | Field-by-field schema reference for EPK JSON, including required and optional fields. |
| [examples/README.md](examples/README.md) | Developers and technical content admins | Notes for validating and importing example EPK JSON files. |
| [apps/server/README.md](apps/server/README.md) | Backend developers and deployment owners | API, Postgres, migration, upload, and YouTube metadata endpoint notes. |
| [apps/web/README.md](apps/web/README.md) | Frontend developers | Vite app, dashboard, public route, styling, and editor notes. |

Validate only:

```bash
bun run validate:epk examples/demo-epk.example.json
```

Import into the running local API:

```bash
bun run import:epk examples/demo-epk.example.json \
  --admin-key "$ADMIN_API_KEY" \
  --confirm
```

The import utility is a safe local tool. It is dry-run by default and only writes when `--confirm` is provided.

The dashboard `JSON` section can also export the current draft as a JSON backup or import a complete EPK JSON file into the dashboard draft. Dashboard imports are local draft changes until `Save EPK` is clicked.

## Dashboard

Dashboard route:

```txt
/dashboard
/dashboard/:section
```

Dashboard sections:

```txt
Navigation
Layout
Branding
Fonts & Text Styling
Metadata
Home
Music
Videos
Tour
VIP
Shop
About
Newsletter
Contact
JSON
Assets
Footer
```

Main dashboard workflow:

```txt
1. Enter the admin key.
2. Edit EPK sections.
3. Upload assets if needed and copy returned paths.
4. Review the public EPK with "View EPK".
5. Save changes with "Save EPK".
6. Export a JSON backup from the JSON section.
```

The dashboard warns before leaving with unsaved changes and shows an `Unsaved` badge when the draft has pending edits.

The dashboard has its own light/dark toggle. Public EPK color, font, and texture controls live under `Branding` and `Fonts & Text Styling` and do not change the dashboard theme.

List-heavy editors use collapsible rows:

```txt
Music releases
Videos
Tour dates
Font element settings
```

The `Layout` section controls public navigation order and which full sections can also be shown on the home page. The `Videos` section can import a YouTube URL or video ID and ask the API to fill title, channel name, publish date, video ID, and an inferred type.

## Public Routes

```txt
/             Home
/music        Releases
/videos       Videos
/tour         Tour dates
/vip          VIP page or external VIP link
/shop         Featured shop items or external shop link
/about        Bio, accolades, press, and artist details
/newsletter   Newsletter signup
/*            Not found page
```

The public site reads from `GET /api/epk`. If no EPK has been imported yet, the public shell shows a setup state.

## API Reference

Base local API URL:

```txt
http://localhost:3001
```

### `GET /api/epk`

Returns the current single EPK JSON.

Success:

```json
{
  "slug": "site",
  "artistName": "Demo Artist"
}
```

Missing EPK:

```json
{
  "error": "EPK not found"
}
```

### `POST /api/epk`

Saves the single EPK record. Requires `X-Admin-Key`.

Headers:

```txt
Content-Type: application/json
X-Admin-Key: <ADMIN_API_KEY>
```

Body:

```txt
Complete EPK JSON matching packages/schema/index.ts
```

Success:

```json
{
  "ok": true,
  "epk": {
    "slug": "site",
    "artistName": "Demo Artist"
  }
}
```

Validation error:

```json
{
  "error": "EPK validation failed",
  "issues": [
    {
      "path": "artistName",
      "message": "Invalid input: expected string"
    }
  ]
}
```

Unauthorized:

```json
{
  "error": "Unauthorized"
}
```

### `POST /api/upload/:type`

Uploads a local file and returns a path for EPK JSON fields. Requires `X-Admin-Key`.

Valid upload types:

```txt
photos
branding
assets
fonts
```

Headers:

```txt
X-Admin-Key: <ADMIN_API_KEY>
```

Body:

```txt
multipart/form-data with a file field named "file"
```

Success:

```json
{
  "path": "/uploads/site/assets/file.jpg"
}
```

Invalid type:

```json
{
  "error": "Invalid upload type"
}
```

### Static Upload Routes

Local uploads are served from:

```txt
GET /uploads/site/assets/<file>
GET /uploads/site/photos/<file>
GET /uploads/site/branding/<file>
GET /uploads/site/fonts/<file>
```

### `GET /api/youtube-metadata`

Fetches metadata for a YouTube URL or video ID. The dashboard uses this when importing videos.

Query:

```txt
url=<youtube-url-or-id>
```

Success:

```json
{
  "youtubeVideoId": "dQw4w9WgXcQ",
  "title": "Example Video",
  "channelName": "Example Channel",
  "publishedDate": "2026-05-01",
  "type": "video"
}
```

If this route returns `404` during local development, restart `bun run dev` so the server process picks up the route.

## Metadata And Social Preview

Use the dashboard `Metadata` section to control the browser title, description, Open Graph image, favicon, theme color, and canonical site URL. The section also shows a share preview card so you can check the social preview before saving.

Recommended Open Graph image size:

```txt
1200 x 630 pixels
```

Upload share images through the dashboard `Assets` section, then copy the returned path into the metadata image field. Local uploaded paths look like:

```txt
/uploads/site/assets/social-share.jpg
/uploads/site/branding/favicon.ico
```

Metadata falls back in this order:

```txt
Title: metadata.title -> "<artistName> | <page>"
Description: metadata.description -> about.shortBio -> home announcement -> generated artist fallback
Image: metadata.socialImage -> home featured release cover
Theme color: metadata.themeColor -> branding accent color
Favicon: metadata.faviconPath -> branding favicon path
```

Public branding supports:

```txt
Color theme tokens
Google font imports
Uploaded fonts
Per-element font settings
Full-page background texture
Logo and favicon paths
```

## Useful Commands

```bash
bun run dev
bun run validate:epk examples/demo-epk.example.json
bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm
cd apps/web && bun run build
cd apps/server && bun x tsc --noEmit
```

## Production Notes

Local uploads are served from `apps/server/uploads` during development. For production, move uploaded media to durable object storage such as S3, R2, Vercel Blob, or Cloudinary, then store the returned public URLs in the EPK JSON.

Do not deploy with the example admin key. In production, `ADMIN_API_KEY` must be set to a strong secret and must not be one of the default local values.

Before launch, follow [docs/production-checklist.md](docs/production-checklist.md).

When replacing demo content for a real artist, follow [docs/template-cleanup.md](docs/template-cleanup.md).

For client-facing intake, content planning, optional fields, and a plain-language explanation of how EPK data is handled, use [docs/client-marketing-content-kit.md](docs/client-marketing-content-kit.md).

For frontend implementation notes, use [docs/frontend-handoff.md](docs/frontend-handoff.md). The public web app is intentionally a data-ready scaffold rather than a finished visual frontend.

## Verify

Useful checks:

```bash
bun run validate:epk examples/demo-epk.example.json
cd apps/web && bun run build
cd apps/server && bun x tsc --noEmit
```

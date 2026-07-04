# EPK Server

Hono API for the single-artist EPK template. It stores one EPK JSON record in Postgres and serves uploaded files from local disk during development, or from Vercel Blob when deployed to Vercel. The app itself (`index.ts`) is runtime-agnostic — no `hono/bun` or other Bun-only APIs — so the exact same code runs under `bun run index.ts` locally and as a Vercel Node.js serverless function (see `apps/web/api/[[...route]].ts`).

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
ALLOWED_ORIGIN=
BLOB_READ_WRITE_TOKEN=
```

`EPK_SLUG` is the internal database key for the single EPK.

`ALLOWED_ORIGIN` is an optional comma-separated list of frontend origins allowed by CORS. Leave it unset locally. In production, an unset value allows requests from any origin.

`BLOB_READ_WRITE_TOKEN` is only needed in production. Leave it unset locally — uploads fall back to local disk automatically. On Vercel, enabling Blob storage on the project sets this variable for you; once it's present, the upload route switches to writing through `@vercel/blob` and storing the returned public URL instead of a local path.

When `DATABASE_URL` points at a pooled/serverless Postgres endpoint (Neon, Supabase — anything using pgbouncer-style transaction pooling), the client (`db/client.ts`) already accounts for it: `prepare: false` avoids prepared statements the pooler can't hold across connections, and `max` is capped to 1 connection per invocation when `process.env.VERCEL` is set (a normal local Postgres keeps the larger `max: 10` pool).

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
GET /api/youtube-metadata?url=<youtube-url-or-id>
GET /uploads/site/assets/<file>
GET /uploads/site/photos/<file>
GET /uploads/site/branding/<file>
GET /uploads/site/fonts/<file>
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

Upload types and their allowed file extensions:

```txt
photos    .jpg .jpeg .png .webp .gif
branding  .jpg .jpeg .png .webp .gif .ico
assets    .jpg .jpeg .png .webp .gif .pdf
fonts     .woff .woff2 .ttf .otf
```

Uploads are capped at 15MB and are always written to disk under a randomly generated filename, regardless of the name the file was uploaded with.

## YouTube Metadata

`GET /api/youtube-metadata` accepts a YouTube URL or 11-character video ID through the `url` query parameter. It also accepts `id=<youtube-video-id>`. It is used by the dashboard to create video rows from pasted YouTube links.

Example:

```bash
curl "http://localhost:3001/api/youtube-metadata?url=https://youtu.be/dQw4w9WgXcQ"
```

Response:

```json
{
  "youtubeVideoId": "dQw4w9WgXcQ",
  "title": "Example Video",
  "channelName": "Example Channel",
  "publishedDate": "2026-05-01",
  "type": "video"
}
```

The metadata lookup is best-effort. Title and channel come from YouTube oEmbed. Publish date is read from the public watch page when available. Type is inferred and can be edited in the dashboard.

When YouTube does not expose a publish date, the API falls back to the current local date in `YYYY-MM-DD` format.

## Production Notes

The local server writes uploads to `apps/server/uploads` and serves them from `/uploads/*`. On Vercel, set `BLOB_READ_WRITE_TOKEN` (see Environment above) and uploads go to Vercel Blob instead — no code changes needed.

Do not use the example `ADMIN_API_KEY` in production. The server refuses production startup when the key is missing, shorter than 24 characters, or set to a known local default.

All `/api/*` routes are rate limited to 300 requests per minute per IP. `X-Admin-Key` failures are tracked separately: after 10 failed attempts from the same IP within 15 minutes, that IP is locked out of protected routes (including with the correct key) for the remainder of the window. **This tracking is an in-memory `Map`**, so under Vercel it is scoped to a single warm serverless instance — it is a best-effort deterrent, not a guaranteed global lockout, since concurrent requests can land on different instances that don't share this state. A real cross-instance guarantee would need an external store (e.g. Upstash Redis) and is out of scope here.

Every save, upload, and auth failure is logged to stdout as a structured JSON line (`{"timestamp", "ip", "action", ...}`) for basic audit visibility. Forward these logs to your hosting platform's log viewer if you want to retain them.

All responses include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`. These only apply to this server's responses (the API and `/uploads/*`); the separately hosted dashboard frontend needs equivalent headers configured at its own hosting layer.

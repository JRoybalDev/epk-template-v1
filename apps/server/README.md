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

Upload types:

```txt
photos
branding
assets
fonts
```

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

The local server writes uploads to `apps/server/uploads` and serves them from `/uploads/*`. That is useful for local development, but production deployments should use durable object storage such as S3, R2, Vercel Blob, or Cloudinary.

Do not use the example `ADMIN_API_KEY` in production. The server refuses production startup when the key is missing or set to a known local default.

# EPK API

A small Hono API that sits alongside the EPK frontend. It doesn't serve site content (that's static, in `apps/web/src/content/epk.ts`). It exists so you can add server-side work that can't run in the browser, such as third-party APIs that need secret keys, form handlers, webhooks, and cached feeds.

The app (`src/index.ts`) uses no Bun-only APIs, so the same code runs locally under Bun and on Vercel as a serverless function (see the root `api/[[...route]].ts`).

## Run

```bash
bun run dev      # from apps/api, with hot reload, on http://localhost:3001
```

Or from the repo root: `bun run dev` (web + API) or `bun run dev:api`.

## Environment

Optional. Copy `.env.example` to `.env` to change defaults:

```txt
PORT=3001
ALLOWED_ORIGIN=      # comma-separated CORS origins; unset allows any origin
DATABASE_URL=        # only needed once a route imports src/db
```

## Structure

```txt
src/
  index.ts                # app setup: security headers, CORS, /api/health, error handling
  integrations/
    index.ts              # mounts each integration at /api/integrations/<name>
    youtube.ts            # example integration
  db/
    client.ts             # Drizzle + postgres-js client (serverless-friendly settings)
    schema.ts             # example table, replace with your own
drizzle.config.ts
```

## Routes

```txt
GET /api/health
GET /api/integrations/youtube?url=<youtube-url-or-id>
```

Example YouTube response:

```json
{
  "youtubeVideoId": "dQw4w9WgXcQ",
  "title": "Example Video",
  "channelName": "Example Channel",
  "publishedDate": "2009-10-24"
}
```

## Adding an integration

```ts
// src/integrations/spotify.ts
import { Hono } from 'hono'

export const spotify = new Hono()

spotify.get('/artist', async (c) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  if (!clientId) return c.json({ error: 'Spotify is not configured' }, 503)

  // call the third-party API with server-side credentials...
  return c.json({ ok: true })
})
```

```ts
// src/integrations/index.ts
integrations.route('/spotify', spotify)
```

Then add the env vars to `.env.example` and call `/api/integrations/spotify/artist` from the frontend.

Guidelines:

- Keep secrets in env vars and never return them to the client.
- Return a clear `503` when an integration's env vars are missing, so the rest of the API still runs.
- Integrations with credentials should validate input and consider rate limiting before going live.

## Database (optional)

Nothing imports `src/db` yet, so the API runs without Postgres. When an integration needs storage:

1. Define tables in `src/db/schema.ts`.
2. Set `DATABASE_URL` (local Docker example below).
3. Generate and apply migrations:

```bash
bun run db:generate
bun run db:migrate
bun run db:studio   # optional browser
```

Local Postgres:

```bash
docker run -d --name epk-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=epk_db \
  -p 5432:5432 \
  postgres:16-alpine
```

On Vercel, use a pooled connection string (Neon, Supabase). `src/db/client.ts` already sets `prepare: false` and caps connections when `VERCEL` is set.

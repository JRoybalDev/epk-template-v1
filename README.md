# EPK Template v1

A single-artist EPK (electronic press kit) website template, structured as a Bun workspaces monorepo. The frontend is a static site driven by one typed TypeScript content file. A small Hono API sits alongside it as the place to add third-party integrations.

## Stack

**Frontend (`apps/web`)**
- **[Vite](https://vite.dev/)** + **[React 19](https://react.dev/)** + **TypeScript**
- **[React Router](https://reactrouter.com/)**: public routes (`/`, `/music`, `/tour`, ...)
- **[Tailwind CSS v4](https://tailwindcss.com/)** + **[daisyUI](https://daisyui.com/)** via `@tailwindcss/vite`
- **[Zod](https://zod.dev/)**: validates site content against the EPK schema
- **[framer-motion](https://motion.dev/)**, **[react-icons](https://react-icons.github.io/react-icons/)**

**Backend (`apps/api`)**
- **[Hono](https://hono.dev/)** on **[Bun](https://bun.sh/)**: health route plus an `integrations/` folder for third-party APIs
- **[Drizzle ORM](https://orm.drizzle.team/)** + **PostgreSQL**: optional, scaffolded but unused until an integration needs storage

## Project structure

```
apps/
  web/                      # frontend
    public/media/           # images, logos, fonts referenced from content
    src/
      content/
        epk.ts            # ALL site content: edit this
        schema.ts           # Zod schema + types for epk.ts
        index.ts            # validates epk.ts and exports the typed `epk`
        README.md           # field-by-field content reference
      components/
        epk/                # public section components (read EPK content)
        shared/             # copy-paste portable components, reusable across projects
      pages/                # EPK layout shell + 404
      hooks/ utils/         # meta tags, branding theme, date formatting
    vite.config.ts          # proxies /api to the API in dev
  api/                      # backend
    src/
      index.ts              # Hono app: CORS, /api/health, mounts integrations
      integrations/
        index.ts            # registers each integration under /api/integrations/<name>
        youtube.ts          # example integration (YouTube metadata lookup)
      db/                   # optional Drizzle client + schema
    drizzle.config.ts
    .env.example
api/[[...route]].ts         # Vercel serverless entry: forwards /api/* to apps/api
scripts/                    # dev runner, content validator
docs/                       # handoff and launch docs
vercel.json
```

## Getting started

Install once from the repo root:

```bash
bun install
```

```bash
bun run dev               # web (http://localhost:5173) + API (http://localhost:3001)
bun run dev:web           # web only
bun run dev:api           # API only
bun run build             # production build to apps/web/dist/
bun run validate:content  # check apps/web/src/content/epk.ts against the schema
bun run lint
```

In dev, Vite proxies `/api/*` to `http://localhost:3001`, so the frontend can call `fetch('/api/...')` with no CORS setup.

The API needs no env to run. To change defaults, copy `apps/api/.env.example` to `apps/api/.env`.

## Editing content

Everything the public site shows comes from [apps/web/src/content/epk.ts](apps/web/src/content/epk.ts): artist name, branding, navigation, releases, videos, tour dates, shop, VIP, about, newsletter, footer, and contact. The demo file is complete, so start by replacing its values.

- Field reference: [apps/web/src/content/README.md](apps/web/src/content/README.md)
- Media: drop files in `apps/web/public/media/` and reference them as `/media/<file>`.
- The file is typed against the schema (`satisfies EPKInput`), so your editor autocompletes fields and flags typos, wrong types, and missing required fields as you edit.
- URL and email formats are validated at startup and by `bun run validate:content`. Invalid content fails loudly instead of rendering a broken page.

## Public routes

```txt
/             Home
/music        Releases
/videos       Videos
/tour         Tour dates
/vip          VIP page or external VIP link
/shop         External shop link or item-link shop cards
/about        Bio, accolades, press, and artist details
/newsletter   Newsletter signup
/*            Not found page
```

The `contact` nav item renders as a `mailto:` link to `contact.bookingEmail` rather than a route.

## API

```txt
GET /api/health                                   { "status": "ok", "timestamp": "..." }
GET /api/integrations/youtube?url=<url-or-id>     YouTube title, channel, publish date
```

### Adding a third-party integration

1. Create `apps/api/src/integrations/<name>.ts` that exports a Hono router. Use `youtube.ts` as the pattern.
2. Read secrets from `process.env` and list them in `apps/api/.env.example`. Never expose them to the frontend.
3. Mount it in `apps/api/src/integrations/index.ts`: `integrations.route('/<name>', <name>)`.
4. Call it from the frontend at `/api/integrations/<name>/...`.

If an integration needs to persist data (signups, cached feeds, tokens), define tables in `apps/api/src/db/schema.ts`, set `DATABASE_URL`, then:

```bash
cd apps/api
bun run db:generate
bun run db:migrate
```

See [apps/api/README.md](apps/api/README.md) for details.

## Deploying to Vercel

The web app and API deploy together as one Vercel project. [vercel.json](vercel.json) builds `apps/web` as the static frontend, and [api/[[...route]].ts](api/[[...route]].ts) runs the Hono app from `apps/api` as a serverless function. Import the repo as-is with no Root Directory or build overrides.

Set any integration env vars (and `DATABASE_URL`, if you use the database) on the Vercel project. For Postgres on Vercel, use a pooled serverless connection string (e.g. Neon or Supabase).

Before launch, follow [docs/production-checklist.md](docs/production-checklist.md).

## Documentation

| Document | Audience | Purpose |
| --- | --- | --- |
| [docs/client-marketing-content-kit.md](docs/client-marketing-content-kit.md) | Clients, artist teams, managers, labels | Plain-language content intake guide. |
| [docs/frontend-handoff.md](docs/frontend-handoff.md) | Frontend developers and designers | The data-ready frontend scaffold and what visual work is intentionally unfinished. |
| [docs/production-checklist.md](docs/production-checklist.md) | Developers and deployment owners | Pre-launch checklist. |
| [docs/template-cleanup.md](docs/template-cleanup.md) | Developers preparing a real artist site | Replacing demo content and placeholder media. |
| [apps/web/src/content/README.md](apps/web/src/content/README.md) | Developers and technical content editors | Field-by-field content reference. |
| [apps/api/README.md](apps/api/README.md) | Backend developers | API structure, integrations, optional database. |
| [apps/web/README.md](apps/web/README.md) | Frontend developers | Vite app, routes, styling. |
| [apps/web/src/components/shared/README.md](apps/web/src/components/shared/README.md) | Frontend developers | Rules and inventory for copy-paste portable components. |

# EPK Web

React + Vite frontend for the single-artist EPK template.

## Run

```bash
bun run dev     # from apps/web, on http://localhost:5173
```

From the repo root, `bun run dev` starts the web app and the API together. API requests to `/api` are proxied to `http://localhost:3001`.

## Content

All content comes from `src/content/epk.ts`, validated against `src/content/schema.ts` on startup. Import it anywhere:

```ts
import { epk } from './content'
```

The EPK layout (`src/pages/EPKPage.tsx`) also passes it to routed sections through outlet context (`useEPKOutlet()`).

See [src/content/README.md](src/content/README.md) for the field reference. Put media in `public/media/` and reference it as `/media/<file>`.

## Components

- `src/components/epk/`: section components that read EPK content. Specific to this template.
- `src/components/shared/`: portable components that only depend on React and take everything through props, so they can be copied into other projects as-is. Lint enforces the import rules. See [src/components/shared/README.md](src/components/shared/README.md) for the rules and inventory.

## Public Routes

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

The `contact` nav value renders as a `mailto:` link to `contact.bookingEmail` rather than a dedicated route.

## Styling

- `src/index.css`: Tailwind + daisyUI import, root resets, page positioning
- `src/App.css`: theme tokens, color system, shared utility classes
- `src/utils/brandingTheme.ts`: artist-specific CSS variables, font imports, font assignments, and background texture, driven by `branding` in `epk.ts`

Document title, description, Open Graph tags, favicon, and theme color are set per route by `src/hooks/useEPKMeta.ts`.

## Calling the API

Use relative paths so the dev proxy and the Vercel deploy both work:

```ts
const res = await fetch(`/api/integrations/youtube?url=${encodeURIComponent(url)}`)
```

## Build

```bash
bun run build
```

# EPK Web

React + Vite frontend for the single-artist EPK template.

## Run

Web only:

```bash
bun run dev
```

Full stack from repo root:

```bash
bun run dev
```

The Vite dev server runs at:

```txt
http://localhost:5173
```

API requests to `/api` are proxied to `http://localhost:3001`.

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

The public layout fetches `GET /api/epk` through `useEPK()` and passes the loaded EPK JSON to routed sections.

## Dashboard Routes

```txt
/dashboard
/dashboard/:section
```

The dashboard uses a simple key gate instead of full authentication. The entered key is stored in `localStorage` as `epk-admin-key` and should be sent with write requests as `X-Admin-Key`.

## Styling

Global CSS is split intentionally:

- `src/index.css`: root resets and page positioning
- `src/App.css`: theme tokens, color system, shared utility classes
- component CSS files: component-specific layout and presentation

Public EPK styles live in:

```txt
src/App.css
src/utils/brandingTheme.ts
src/components/epk/*.tsx
```

Dashboard styles live in:

```txt
src/pages/DashboardPage.css
src/components/dashboard/DashboardEditors.css
```

The public EPK receives artist-specific CSS variables, font imports, font assignments, and full-page background texture rules from `src/utils/brandingTheme.ts`. The dashboard has a separate light/dark theme toggle and does not use public EPK color mode settings.

## Data Helpers

API client:

```txt
src/api/client.ts
```

Shared EPK query:

```txt
src/hooks/useEPK.ts
```

Dashboard draft store:

```txt
src/hooks/useEPKStore.ts
```

The dashboard loads the shared EPK query into a Zustand draft. Editors modify the draft locally, and `Save EPK` sends the whole draft to `POST /api/epk` with `X-Admin-Key`.

The video importer calls `GET /api/youtube-metadata` so pasted YouTube URLs can create rows with title, channel name, publish date, video ID, and inferred type.

## Editors

The dashboard includes form editors for:

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
Footer
Assets
```

Music releases, videos, tour dates, and font element settings use collapsible rows so large lists stay manageable. The JSON tools remain available for full-file import/export and backup workflows.

## Build

```bash
bun run build
```

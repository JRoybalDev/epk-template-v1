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

The `contact` nav value is valid EPK data, but it renders as a `mailto:` link to `contact.bookingEmail` rather than a dedicated route.

## Dashboard Routes

```txt
/dashboard
/dashboard/:section
```

The dashboard uses a simple key gate instead of full authentication. The entered key is stored in `localStorage` as `epk-admin-key` and should be sent with write requests as `X-Admin-Key`.

Dashboard theme preference is stored separately in `localStorage` as `epk-dashboard-theme`. The dashboard nav is grouped into collapsible sections and uses a mobile bottom sheet for small screens.

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

Document title and favicon values are cached in local storage so route changes and dashboard transitions can keep a recent artist title/favicon available while fresh EPK data loads.

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

The video importer calls `GET /api/youtube-metadata` so pasted YouTube URLs or 11-character video IDs can create rows with title, channel name, publish date, video ID, and inferred type.

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

Music releases, videos, tour dates, and font element settings use collapsible rows so large lists stay manageable. The Layout editor uses drag-and-drop controls for public navigation order and reusable home section order. The JSON tools remain available for full-file import/export and backup workflows, and the workspace header also includes a quick `Export EPK` action.

## Build

```bash
bun run build
```

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
src/pages/EPKPage.css
src/components/epk/EPKSections.css
src/components/epk/SiteFooter.css
```

Dashboard styles live in:

```txt
src/pages/DashboardPage.css
```

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

## Build

```bash
bun run build
```

# Frontend Handoff

The web app is intentionally set up as a data-ready frontend scaffold, not a finished EPK design.

## What Is Already Wired

- Public routes exist for home, music, videos, tour, VIP, shop, about, and newsletter.
- `contact` can appear in public navigation, but it renders as a `mailto:` link to the booking email rather than a routed page.
- The public shell fetches the current EPK from `GET /api/epk`.
- Public route components read typed EPK data through `useEPKOutlet()`.
- Metadata is populated from EPK data through `useEPKMeta()`.
- Document title and favicon values are cached in local storage while fresh EPK data loads.
- Navigation is driven by the EPK `nav` array.
- Home can render selected full sections through `home.sectionsOnHome`.
- Links, sorting, conditional sections, image fallbacks, and empty states are in place.
- Videos render YouTube iframes through `YouTubeEmbed`.
- Tour dates keep ISO dates in data and render with `tour.dateDisplayFormat`; the Tour page can render either manual listings or Seated embed/widget content.
- Public branding applies color variables, font imports, font assignments, and full-page background texture through `getEPKBrandingStyle()`.
- The dashboard can load, edit, validate, save, import/export JSON, upload assets/fonts, reorder layout sections with drag-and-drop, and import YouTube metadata.

## What Is Intentionally Not Finished

- Public EPK styling.
- Final layout.
- Final responsive behavior.
- Final typography.
- Final animation.
- Final visual treatment for cards, grids, media, tour rows, and calls to action.

## How To Build The Frontend

Use the existing public components as logical data boundaries:

- `HomeSection.tsx` handles featured release and home tour preview data.
- `MusicGrid.tsx` handles release sorting and release links.
- `VideoGrid.tsx` handles YouTube embeds and video ordering.
- `TourList.tsx` handles date formatting, hidden regions, passed-date announcements, ticket links, VIP links, sold-out labels, and Seated embed/widget rendering.
- `VIPPage.tsx` handles optional VIP data and external store links.
- `ShopGrid.tsx` handles optional shop data, External mode, and Item links mode with external Buy URLs.
- `AboutSection.tsx` handles bio, accolades, genres, and press quote data.
- `NewsletterSection.tsx` handles optional newsletter data.
- `SiteFooter.tsx` handles socials, legal links, and powered-by links.

The current markup includes `data-section`, `data-list`, `data-item`, and `data-field` attributes so future frontend work can target stable content areas without changing the data-fetching contract first.

## Backend Contract

The frontend should continue to treat the backend as the source of truth:

- Read public EPK content from `GET /api/epk`.
- Save dashboard edits through `POST /api/epk`.
- Upload assets through `POST /api/upload/:type`.
- Fetch YouTube metadata for dashboard imports through `GET /api/youtube-metadata` with a YouTube URL or video ID.
- Validate EPK payloads with the shared schema in `packages/schema`.

The frontend should not hardcode artist content. Artist-specific content belongs in the EPK JSON/database record.

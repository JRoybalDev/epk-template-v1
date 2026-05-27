# Frontend Handoff

The web app is intentionally set up as a data-ready frontend scaffold, not a finished EPK design.

## What Is Already Wired

- Public routes exist for home, music, videos, tour, VIP, shop, about, and newsletter.
- The public shell fetches the current EPK from `GET /api/epk`.
- Public route components read typed EPK data through `useEPKOutlet()`.
- Metadata is populated from EPK data through `useEPKMeta()`.
- Navigation is driven by the EPK `nav` array.
- Links, sorting, conditional sections, image fallbacks, and empty states are in place.
- The dashboard can load, edit, validate, save, import/export JSON, and upload assets.

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
- `VideoGrid.tsx` handles YouTube embed URLs and video ordering.
- `TourList.tsx` handles tour dates, ticket links, VIP links, and sold-out labels.
- `VIPPage.tsx` handles optional VIP data and external store links.
- `ShopGrid.tsx` handles optional shop data and featured items.
- `AboutSection.tsx` handles bio, accolades, genres, and press quote data.
- `NewsletterSection.tsx` handles optional newsletter data.
- `SiteFooter.tsx` handles socials, legal links, and powered-by links.

The current markup includes `data-section`, `data-list`, `data-item`, and `data-field` attributes so future frontend work can target stable content areas without changing the data-fetching contract first.

## Backend Contract

The frontend should continue to treat the backend as the source of truth:

- Read public EPK content from `GET /api/epk`.
- Save dashboard edits through `POST /api/epk`.
- Upload assets through `POST /api/upload/:type`.
- Validate EPK payloads with the shared schema in `packages/schema`.

The frontend should not hardcode artist content. Artist-specific content belongs in the EPK JSON/database record.

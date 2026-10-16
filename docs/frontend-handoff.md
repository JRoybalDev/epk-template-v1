# Frontend Handoff

The web app is intentionally set up as a data-ready frontend scaffold, not a finished EPK design.

## What Is Already Wired

- Public routes exist for home, music, videos, tour, VIP, shop, about, and newsletter.
- `contact` can appear in public navigation, but it renders as a `mailto:` link to the booking email rather than a routed page.
- Site content is loaded from `src/content/epk.ts` and validated against `src/content/schema.ts` at startup.
- Public route components read typed EPK data through `useEPKOutlet()`.
- Metadata is populated from EPK data through `useEPKMeta()`.
- Navigation is driven by the EPK `nav` array.
- Home can render selected full sections through `home.sectionsOnHome`.
- Links, sorting, conditional sections, image fallbacks, and empty states are in place.
- Videos render YouTube iframes through the shared `YouTubeEmbed` component, and images fall back to a placeholder through the shared `FallbackImage` component. Both live in `components/shared/`, which holds copy-paste portable components (see its README).
- Tour dates keep ISO dates in data and render with `tour.dateDisplayFormat`; the Tour page can render either manual listings or Seated embed/widget content.
- Public branding applies color variables, font imports, font assignments, and full-page background texture through `getEPKBrandingStyle()`.

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

The current markup includes `data-section`, `data-list`, `data-item`, and `data-field` attributes so future frontend work can target stable content areas without changing the content contract first.

## Content And API Contract

- Artist content lives in `apps/web/src/content/epk.ts`. Components should not hardcode artist content.
- If a design needs a new field, add it to `src/content/schema.ts` first, then to `epk.ts`.
- Media lives in `apps/web/public/media/` and is referenced as `/media/<file>`.
- Anything that needs a server or secret keys (third-party APIs, form handlers) goes in `apps/api/src/integrations/` and is called from the frontend at `/api/integrations/<name>`.

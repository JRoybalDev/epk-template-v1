# Template Cleanup Guide

Use this when turning the demo template into a real artist EPK.

## Content To Replace

- `artistName`
- `pageTitle`
- `metadata.title`
- `metadata.description`
- `metadata.socialImage`
- `metadata.siteUrl`
- `branding.logoText`
- `branding.logoImage`
- `branding.faviconPath`
- `branding.backgroundTexture`
- `branding.theme`
- `branding.fonts`
- `home.featuredRelease`
- `music.releases`
- `videos`
- `tour.dates`
- `vip`
- `shop`
- `about`
- `newsletter`
- `footer.socials`
- `contact`

## Demo URLs To Remove

Search `apps/web/src/content/epk.ts` for these before launch:

```txt
example.com
booking@example.com
press@example.com
management@example.com
sync@example.com
Demo Artist
```

## Media Paths

Media lives in `apps/web/public/media/` and is referenced from `epk.ts` as `/media/<file>`. The demo content points at placeholder files that don't exist. Replace each one with a real file, or use full URLs for media hosted on a CDN.

If the artist uses custom font files, confirm the font licenses allow web use.

## Social Sharing

Set these in `metadata` and `branding`:

- Browser title
- Meta description
- Open Graph/social image
- Canonical site URL
- Theme color
- Favicon

Recommended share image size:

```txt
1200 x 630 pixels
```

## Content Review

- Order `nav` the way public navigation should appear, and set `home.sectionsOnHome` for which sections appear on the home page.
- Confirm `branding` colors, background texture, Google fonts, font files, and per-element text settings.
- To fill video details from a YouTube link, call `GET /api/integrations/youtube?url=<link>` with the API running.
- Confirm whether `tour` should use manual date listings or a Seated widget/embed.
- If VIP mode is External, set the main VIP store URL and confirm tour date VIP packages use that Default External URL.
- If VIP mode is Manual, define reusable VIP packages, reference them on each manual tour date, and use date-specific VIP package URLs only when a package has its own venue or date purchase page.
- Configure `shop` as either External mode with one default store URL or Item links mode with featured items and per-item store URLs.
- Run `bun run validate:content` and review every route in the browser.

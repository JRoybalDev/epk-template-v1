# Production Checklist

Use this checklist before handing off or deploying a finished single-artist EPK.

## Environment

- Set `DATABASE_URL` to the production Postgres connection string.
- Set `EPK_SLUG=site` unless you intentionally changed the single-record slug.
- Set `ADMIN_API_KEY` to a long random secret.
- Confirm `ADMIN_API_KEY` is not a local placeholder such as `change-me-to-a-long-random-secret`.
- Set `NODE_ENV=production` for the server runtime.

## Database

- Run the server migrations against the production database.
- Confirm `GET /api/epk` returns `404` before the first save/import or the expected EPK after content is saved.

## Content

- If using a prepared JSON file, validate it locally:

```bash
bun run validate:epk examples/demo-epk.example.json
```

- Import prepared JSON only after validation passes:

```bash
bun run import:epk path/to/artist-epk.json --admin-key "$ADMIN_API_KEY" --confirm
```

- Open the dashboard. If no EPK has been saved yet, confirm the starter draft appears and the editors are available.
- If importing JSON, verify every section loads from the imported content. If starting from the dashboard starter draft, replace all placeholder content before handoff.
- Save once from the dashboard to create or update the live EPK record and confirm the admin key and write route work.
- Use the `JSON` section to export a backup of the final draft.
- If importing through the dashboard `JSON` section, confirm the imported draft is reviewed and saved.
- Fill out the `Contact` section with booking, press, management, and sync emails as needed.
- Review `Music`, `Videos`, `Tour`, and `Shop` using the form editors instead of editing raw JSON.
- If VIP mode is External, confirm the main VIP store URL is correct and tour date VIP packages use that Default External URL.
- If VIP mode is Manual, confirm VIP packages are created in `VIP`, selected on the correct manual tour dates, and any date-specific VIP package URLs intentionally override package or main VIP site links.
- Confirm Shop mode is correct. In External mode, verify the default store URL; in Item links mode, verify every featured item has the correct external item store URL.
- Confirm optional fields that can be blank are intentionally blank, including release dates, tour regions, and accolades.
- If using video URL import, restart the API after deployment and confirm `GET /api/youtube-metadata` works.

## Media

- Decide where production media should live: S3, R2, Vercel Blob, Cloudinary, or another durable store.
- Upload final images, PDFs, and brand assets to that store.
- Replace local `/uploads/site/...` placeholder paths with production public URLs when local disk uploads are not durable.
- Check press photo, release art, newsletter background, logo, favicon, and downloadable asset links.
- Check background texture and uploaded font paths if the artist branding uses them.
- Use the `Copy path` button after dashboard uploads to paste media paths into image fields.
- Use a 1200 x 630 image for the Open Graph/social share image.

## Public Site

- Verify routes:
  - `/`
  - `/music`
  - `/videos`
  - `/tour`
  - `/vip`
  - `/shop`
  - `/about`
  - `/newsletter`
- Confirm the browser title, description, theme color, and favicon match the artist.
- Confirm browser titles follow the `<artist name> | <page>` pattern.
- Confirm the dashboard `Metadata` preview matches the intended social share card.
- Confirm public EPK color theme, fonts, and background texture apply only to the public site.
- Check mobile and desktop layouts.
- Confirm external links open correctly.

## Dashboard

- Confirm `/dashboard` requires the admin key gate.
- Confirm `Sign out` clears access from `localStorage`.
- Confirm unsaved changes warn before reload, sign out, or dashboard navigation.
- Confirm protected API writes fail without `X-Admin-Key`.
- Confirm dashboard light/dark mode does not affect the public EPK theme.

## Final Hand-Off

- Remove demo-only text, links, and placeholder images from the final JSON.
- Keep `examples/demo-epk.example.json` as a template reference only.
- Store the admin key in a secure password manager for the artist/team.

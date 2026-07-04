# Production Checklist

Use this checklist before handing off or deploying a finished single-artist EPK.

## Environment

- Set `DATABASE_URL` to the production Postgres connection string.
- Set `EPK_SLUG=site` unless you intentionally changed the single-record slug.
- Set `ADMIN_API_KEY` to a long random secret, at least 24 characters. The server refuses to start in production with a shorter or placeholder key.
- Confirm `ADMIN_API_KEY` is not a local placeholder such as `change-me-to-a-long-random-secret`.
- Set `NODE_ENV=production` for the server runtime.
- Set `ALLOWED_ORIGIN` to your deployed frontend origin(s), comma-separated. If left unset, the API accepts requests from any origin.
- Serve the API and the dashboard over HTTPS only. The admin key is sent as a plain header on every write, so it is interceptable over plain HTTP.

## Deploying to Vercel

Only applies if deploying the web app + API together as one Vercel project (see [README.md](../README.md#deploying-to-vercel)).

- Vercel project **Root Directory** is set to `apps/web`.
- `DATABASE_URL` is a **pooled** connection string (Neon or Supabase's pgbouncer-style endpoint), not a direct/unpooled one — a direct connection can exhaust the database's connection limit under serverless concurrency.
- Migrations have been run against the production `DATABASE_URL` at least once (`bunx drizzle-kit migrate` from `apps/server`, using the production connection string) before the first deploy.
- Vercel Blob is enabled on the project and `BLOB_READ_WRITE_TOKEN` is set in its environment variables.
- `ADMIN_API_KEY` and `EPK_SLUG` are set as Vercel environment variables (not just in a local `.env`).
- After the first deploy, check the Vercel function logs for the first `/api/epk` request to confirm the serverless function connects to the database and (if applicable) Blob without cold-start errors.
- Know the rate-limiter caveat: the brute-force lockout on `X-Admin-Key` failures (see Monitoring below) is an in-memory `Map` scoped to a single warm serverless instance. Under Vercel this is best-effort, not a global guarantee — concurrent requests can land on different instances that don't share lockout state. Treat it as a deterrent, not a hard limit, until/unless it's backed by an external store like Upstash Redis.

## Security Headers

- The API server (`apps/server`) already sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin` on every response, including uploaded files under `/uploads`.
- These headers do **not** cover the dashboard itself, since `apps/web` is typically deployed separately as a static site. Configure your static host (Vercel, Netlify, etc.) to send `X-Frame-Options: DENY` (or a CSP `frame-ancestors 'none'`) for the `/dashboard` route, so the unlock/save UI cannot be embedded in a hostile iframe for clickjacking.
- If you rely on the `newsletter.embedCode` or `tour.seatedEmbedCode` fields, know that whoever holds the admin key can inject arbitrary JavaScript that runs on the public EPK page for every visitor. Treat a leaked admin key as a full site compromise, not just "edit access."

## Monitoring

- Server writes (`epk.save`, `asset.upload`) and auth failures (`auth.failed`, `auth.locked_out`) are logged to stdout as structured JSON lines with timestamp, IP, and action. Forward these logs to your hosting platform's log viewer or a log aggregator so a leaked or brute-forced key is detectable after the fact.

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
- Use the `Import / Export` section to export a backup of the final draft.
- If importing through the dashboard `Import / Export` section, confirm the imported draft is reviewed and saved.
- Fill out the `Contact` section with booking, press, management, and sync emails as needed.
- Review `Releases`, `Videos`, `Tour dates`, and `Shop` using the form editors instead of editing raw JSON.
- If VIP mode is External, confirm the main VIP store URL is correct and tour date VIP packages use that Default External URL.
- If VIP mode is Manual, confirm VIP packages are created in `VIP upgrades`, selected on the correct manual tour dates, and any date-specific VIP package URLs intentionally override package or main VIP site links.
- Confirm Shop mode is correct. In External mode, verify the default store URL; in Item links mode, verify every featured item has the correct external item store URL.
- Confirm optional fields that can be blank are intentionally blank, including release dates, tour regions, and accolades.
- If using video URL import, restart the API after deployment and confirm `GET /api/youtube-metadata` works.

## Media

- If deploying to Vercel with `BLOB_READ_WRITE_TOKEN` set, uploads already go to Vercel Blob automatically — no manual step needed. Otherwise, decide where production media should live (S3, R2, Cloudinary, or another durable store) and update `apps/server/index.ts`'s upload route accordingly.
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
- Confirm the dashboard `Share preview` section matches the intended social share card.
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

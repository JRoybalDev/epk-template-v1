# Production Checklist

Use this checklist before handing off or deploying a finished single-artist EPK.

## Environment

- Set `ALLOWED_ORIGIN` to your deployed frontend origin(s), comma-separated, if the API is called cross-origin. If left unset, the API accepts requests from any origin.
- Set every env var your integrations need (see `apps/api/.env.example`) on the hosting platform, not just in a local `.env`.
- If an integration uses the database, set `DATABASE_URL` and run `bun run db:migrate` from `apps/api` against the production database.

## Deploying to Vercel

Only applies if deploying the web app + API together as one Vercel project (see [README.md](../README.md#deploying-to-vercel)).

- Import the repo as-is. `vercel.json` already sets the install, build, and output settings.
- If using Postgres, `DATABASE_URL` is a **pooled** connection string (Neon or Supabase), not a direct one. A direct connection can exhaust the database's connection limit under serverless concurrency.
- After the first deploy, confirm `GET /api/health` returns `{ "status": "ok" }`.

## Security

- The API sets `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` on every response.
- Keep third-party secrets in API env vars only. Never put them in `epk.ts` or frontend code, since both ship to every visitor.
- `newsletter.embedCode` and `tour.seatedEmbedCode` are rendered as raw HTML. Only paste embed code from trusted providers.
- Before launch, add input validation and rate limiting to integrations that use paid or credentialed third-party APIs.

## Content

- Validate the content file:

```bash
bun run validate:content
```

- Fill out `contact` with booking, press, management, and sync emails as needed.
- If VIP mode is External, confirm the main VIP store URL is correct and tour date VIP packages use that Default External URL.
- If VIP mode is Manual, confirm VIP packages are defined, referenced on the correct manual tour dates, and any date-specific VIP package URLs intentionally override package or main VIP site links.
- Confirm Shop mode is correct. In External mode, verify the default store URL; in Item links mode, verify every featured item has the correct external item store URL.
- Confirm optional fields that can be blank are intentionally blank, including release dates, tour regions, and accolades.

## Media

- Put final images, PDFs, logos, and fonts in `apps/web/public/media/` (or a CDN) and reference them from `epk.ts`.
- Replace every demo `/media/...` path with a real file. Missing images fall back gracefully but should not ship.
- Check press photo, release art, newsletter background, logo, favicon, and downloadable asset links.
- Check background texture and font paths if the artist branding uses them.
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
- Check the social share card with a preview tool (e.g. opengraph.xyz) after deploying.
- Confirm public EPK color theme, fonts, and background texture apply only to the public site.
- Check mobile and desktop layouts.
- Confirm external links open correctly.

## Final Hand-Off

- Remove demo-only text, links, and placeholder images from `epk.ts`.
- Store integration API keys in a secure password manager for the artist/team.

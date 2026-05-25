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

Search the EPK JSON for these before launch:

```txt
example.com
booking@example.com
press@example.com
management@example.com
sync@example.com
Demo Artist
```

## Media Paths

Local dashboard uploads use:

```txt
/uploads/site/assets/<file>
/uploads/site/photos/<file>
/uploads/site/branding/<file>
```

For production, move final media to durable storage and replace local paths if the deployment cannot keep local upload files permanently.

## Social Sharing

Use the dashboard `Metadata` section for:

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

## Dashboard Handoff

- Use `JSON` to export a backup before making major edits.
- Use `JSON` to import a completed EPK file into the dashboard draft.
- Review the imported draft in each dashboard section.
- Click `Save EPK` only after the draft validates and looks correct.
- Use `Sign out` after editing on shared machines.

## Production Settings

- Replace the local `ADMIN_API_KEY` with a long random secret.
- Confirm `NODE_ENV=production`.
- Confirm production `DATABASE_URL`.
- Run database migrations.
- Import the final EPK JSON or save the final draft from the dashboard.

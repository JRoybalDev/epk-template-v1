# Example EPK JSON

This folder contains example EPK payloads that can be validated, imported, copied, or used as a starting point for a real artist.

Main example:

```txt
examples/demo-epk.example.json
```

The example is intentionally complete. It shows every major section that can be included in the single-artist EPK.

## How To Use It

Validate the example without writing anything:

```bash
bun run validate:epk examples/demo-epk.example.json
```

Import it into a running local API:

```bash
bun run import:epk examples/demo-epk.example.json \
  --admin-key "$ADMIN_API_KEY" \
  --confirm
```

Use it as a template for a real artist:

```bash
cp examples/demo-epk.example.json examples/artist-epk.json
```

Then replace demo text, URLs, emails, and media paths.

## Included Sections

### Root Info

```json
{
  "slug": "site",
  "artistName": "Demo Artist",
  "pageTitle": "Demo Artist | Official Site"
}
```

`slug` should stay `site` for this single-EPK template. The API stores one EPK record and forces the internal slug to the configured `EPK_SLUG`.

### Metadata

Used for browser metadata and social previews.

```json
{
  "metadata": {
    "title": "Demo Artist | Official EPK",
    "description": "Demo Artist blends alt-soul, left-field pop, and cinematic R&B from Los Angeles.",
    "socialImage": "/uploads/site/assets/social-share.jpg",
    "faviconPath": "/uploads/site/branding/favicon.ico",
    "themeColor": "#3B1A1A",
    "siteUrl": "https://example.com"
  }
}
```

Recommended social image size:

```txt
1200 x 630 pixels
```

### Branding

Used for global visual identity.

```json
{
  "branding": {
    "accentColor": "#3B1A1A",
    "backgroundTexture": "/uploads/site/branding/linen-texture.jpg",
    "logoImage": "/uploads/site/branding/logo.png",
    "logoText": "Demo Artist",
    "fontStyle": "script",
    "cornerMotif": "/uploads/site/branding/corner-motif.svg",
    "faviconPath": "/uploads/site/branding/favicon.ico"
  }
}
```

### Navigation

Controls the public nav order and visible sections.

```json
{
  "nav": ["home", "music", "tour", "vip", "shop", "about", "newsletter"]
}
```

Add `"contact"` if you want the nav to include a booking email link.

### Home

Used by the home route `/`.

```json
{
  "home": {
    "featuredRelease": {
      "title": "Midnight Signal",
      "subtitle": "new single out now",
      "coverImage": "/uploads/site/assets/midnight-signal-cover.jpg",
      "smartLinkUrl": "https://example.com/listen",
      "directStreamUrl": "https://open.spotify.com"
    },
    "showTourDatesOnHome": true,
    "featuredVideoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "announcement": {
      "text": "North American tour dates are on sale now.",
      "linkUrl": "https://example.com/tour",
      "linkLabel": "Get tickets"
    }
  }
}
```

### Music

Used by `/music`.

```json
{
  "music": {
    "releases": [
      {
        "id": "release-001",
        "title": "Midnight Signal",
        "type": "single",
        "releaseDate": "2026-05-01",
        "heroImage": "/uploads/site/assets/midnight-signal-hero.jpg",
        "smartLinkUrl": "https://example.com/listen/midnight-signal",
        "isFeatured": true,
        "displayOrder": 1
      }
    ],
    "gridColumns": "2"
  }
}
```

Optional platform links can be added under `streamingLinks`.

### Videos

Used by `/videos`.

```json
{
  "videos": [
    {
      "id": "video-001",
      "title": "Demo Artist - Midnight Signal",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "channelName": "DemoArtistVEVO",
      "type": "music_video",
      "publishedDate": "2026-05-02",
      "isFeatured": true,
      "displayOrder": 1
    }
  ]
}
```

Use the YouTube ID only, not the full embed URL.

### Tour

Used by `/tour` and optionally shown on `/`.

```json
{
  "tour": {
    "tourName": "The Midnight Signal Tour",
    "dates": [
      {
        "id": "show-001",
        "date": "2026-08-15",
        "venue": "The Echo",
        "city": "Los Angeles",
        "region": "CA",
        "country": "USA",
        "ticketUrl": "https://example.com/tickets/la",
        "vipUrl": "https://example.com/vip/la",
        "isSoldOut": false,
        "supportingActs": ["Opening Artist"],
        "isAnnounced": true
      }
    ]
  }
}
```

### VIP

Used by `/vip`.

```json
{
  "vip": {
    "externalStoreUrl": "https://example.com/vip",
    "headline": "VIP Upgrades",
    "description": "Meet and greet upgrades are available for select shows.",
    "redirectOnly": false
  }
}
```

### Shop

Used by `/shop`.

```json
{
  "shop": {
    "externalStoreUrl": "https://example.com/store",
    "headline": "Featured Merch",
    "featuredItems": [
      {
        "id": "merch-001",
        "name": "Midnight Signal Tee",
        "price": "35.00",
        "currency": "USD",
        "image": "/uploads/site/assets/tee.jpg",
        "purchaseUrl": "https://example.com/store/midnight-signal-tee",
        "category": "apparel",
        "isFeatured": true
      }
    ],
    "redirectOnly": false
  }
}
```

### About

Used by `/about`.

```json
{
  "about": {
    "shortBio": "Demo Artist blends alt-soul, left-field pop, and cinematic R&B from Los Angeles.",
    "longBio": "Long-form artist biography goes here.",
    "genres": ["Alt-Soul", "R&B", "Indie Pop"],
    "similarArtists": ["Artist Reference One"],
    "accolades": ["Featured on national editorial playlists"],
    "awards": [],
    "pressQuotes": [],
    "pressPhotos": [],
    "downloadableAssetsUrl": "https://example.com/press-kit.zip",
    "techRiderUrl": "https://example.com/tech-rider.pdf"
  }
}
```

`awards`, `pressQuotes`, and `pressPhotos` can stay empty arrays if the artist does not need them yet.

### Newsletter

Used by `/newsletter`.

```json
{
  "newsletter": {
    "headline": "Stay in the loop",
    "subheadline": "Get new music, tour dates, and merch drops first.",
    "backgroundImage": "/uploads/site/assets/newsletter-bg.jpg",
    "externalSignupUrl": "https://example.com/newsletter",
    "provider": "mailchimp"
  }
}
```

Use `externalSignupUrl` for the simplest setup, or `embedCode` for an inline provider form.

### Footer

Used globally on public pages.

```json
{
  "footer": {
    "socials": {
      "instagram": "https://instagram.com/demoartist",
      "youtube": "https://youtube.com/@demoartist",
      "spotify": "https://open.spotify.com",
      "website": "https://example.com"
    },
    "copyrightName": "Demo Artist",
    "legalLinks": [
      {
        "label": "Privacy Policy",
        "url": "https://example.com/privacy"
      }
    ],
    "poweredByLabel": "Powered by JRoybalDev",
    "poweredByUrl": "https://example.com"
  }
}
```

### Contact

Used by dashboard/contact data and optional public nav contact mail link.

```json
{
  "contact": {
    "bookingEmail": "booking@example.com",
    "pressEmail": "press@example.com",
    "managementEmail": "management@example.com",
    "syncEmail": "sync@example.com"
  }
}
```

## Media Path Examples

Local uploaded files are served from:

```txt
/uploads/site/assets/<file>
/uploads/site/photos/<file>
/uploads/site/branding/<file>
```

Common examples:

```txt
/uploads/site/assets/social-share.jpg
/uploads/site/assets/release-cover.jpg
/uploads/site/photos/press-landscape.jpg
/uploads/site/branding/logo.png
/uploads/site/branding/favicon.ico
```

## Validation Notes

The schema requires valid URLs for URL fields and valid emails for email fields.

These are valid examples:

```json
{
  "smartLinkUrl": "https://example.com/listen",
  "bookingEmail": "booking@example.com"
}
```

These are not valid:

```json
{
  "smartLinkUrl": "example.com/listen",
  "bookingEmail": "booking"
}
```

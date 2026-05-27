# EPK Schema Reference

This package documents and exports the shared EPK JSON schema used by the API, import utility, and dashboard.

Main file:

```txt
packages/schema/index.ts
```

The schema is written with Zod. Use `EPKSchema` or `validateEPK(data)` whenever JSON needs to be checked before saving or importing.

## Example Payload

Main example:

```txt
examples/demo-epk.example.json
```

The example is intentionally complete. It shows every major section that can be included in the single-artist EPK.

Validate it without writing anything:

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

## Root Shape

```json
{
  "slug": "site",
  "artistName": "Demo Artist",
  "pageTitle": "Demo Artist | Official Site",
  "metadata": {},
  "branding": {},
  "nav": ["home", "music", "videos", "tour"],
  "home": {},
  "music": {},
  "videos": [],
  "tour": {},
  "vip": {},
  "shop": {},
  "about": {},
  "newsletter": {},
  "footer": {},
  "contact": {}
}
```

Required root fields:

```txt
slug
artistName
branding
nav
home
music
videos
tour
about
footer
contact
```

Optional root fields:

```txt
pageTitle
metadata
vip
shop
newsletter
```

`slug` should stay `site` for this single-EPK template. The API stores one EPK record and forces the internal slug to the configured `EPK_SLUG`.

## Section Reference

### Metadata

Controls browser and social sharing metadata.

```json
{
  "title": "Demo Artist | Official EPK",
  "description": "Short share description for search and social previews.",
  "socialImage": "/uploads/site/assets/social-share.jpg",
  "faviconPath": "/uploads/site/branding/favicon.ico",
  "themeColor": "#3B1A1A",
  "siteUrl": "https://example.com"
}
```

### Branding

Controls global visual identity.

```json
{
  "accentColor": "#3B1A1A",
  "backgroundTexture": "/uploads/site/branding/linen-texture.jpg",
  "logoImage": "/uploads/site/branding/logo.png",
  "logoText": "Demo Artist",
  "fontStyle": "script",
  "cornerMotif": "/uploads/site/branding/corner-motif.svg",
  "faviconPath": "/uploads/site/branding/favicon.ico",
  "theme": {
    "bg": "#f7ede2",
    "text": "#27211b",
    "accent": "#8c6844"
  },
  "fonts": {
    "googleFonts": [
      {
        "family": "Inter",
        "weights": "400;700"
      }
    ],
    "uploadedFonts": [
      {
        "family": "Artist Display",
        "source": "/uploads/site/fonts/artist-display.woff2"
      }
    ],
    "assignments": {
      "h1": {
        "family": "Artist Display",
        "weight": "700"
      }
    }
  }
}
```

`fontStyle` must be one of:

```txt
serif
sans
script
```

`backgroundTexture`, when provided, is applied to the full public EPK page shell. `theme` and `fonts` only affect the public EPK; the dashboard keeps its own independent light/dark mode.

### Navigation

Controls which public sections appear in the nav.

```json
["home", "music", "videos", "tour", "vip", "shop", "about", "newsletter", "contact"]
```

Allowed values:

```txt
home
music
videos
shop
tour
vip
about
newsletter
contact
```

### Home

Controls the home hero and optional announcement.

```json
{
  "featuredRelease": {
    "title": "Midnight Signal",
    "subtitle": "new single out now",
    "coverImage": "/uploads/site/assets/midnight-signal-cover.jpg",
    "smartLinkUrl": "https://example.com/listen",
    "directStreamUrl": "https://open.spotify.com"
  },
  "showTourDatesOnHome": true,
  "sectionsOnHome": ["music", "videos", "tour"],
  "featuredVideo": {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "title": "Demo Artist - Midnight Signal",
    "channelName": "DemoArtistVEVO",
    "publishedDate": "2026-05-02"
  },
  "featuredVideoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "announcement": {
    "text": "North American tour dates are on sale now.",
    "linkUrl": "https://example.com/tour",
    "linkLabel": "Get tickets"
  }
}
```

### Music

Controls release cards.

```json
{
  "releases": [
    {
      "id": "release-001",
      "title": "Midnight Signal",
      "type": "single",
      "releaseDate": "2026-05-01",
      "heroImage": "/uploads/site/assets/midnight-signal-hero.jpg",
      "smartLinkUrl": "https://example.com/listen/midnight-signal",
      "streamingLinks": {
        "spotify": "https://open.spotify.com",
        "appleMusic": "https://music.apple.com",
        "youtube": "https://youtube.com"
      },
      "isFeatured": true,
      "displayOrder": 1
    }
  ],
  "gridColumns": "2"
}
```

Release `type` must be one of:

```txt
album
single
ep
mix
compilation
deluxe
collab
```

`gridColumns` must be `"1"`, `"2"`, `"3"`, or `"4"`.

`releaseDate` is optional. Use `displayOrder` when the team wants manual sorting independent of dates.

### Videos

Controls embedded YouTube videos.

```json
[
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
```

Video `type` must be one of:

```txt
music_video
live
video
scheduled
other
```

The dashboard can import a YouTube URL or video ID and fill `title`, `youtubeVideoId`, `channelName`, `publishedDate`, and an inferred `type` through the server metadata endpoint. Manual JSON entries can still provide these fields directly.

### Tour

Controls public tour rows and optional widget configuration.

```json
{
  "tourName": "The Midnight Signal Tour",
  "dateDisplayFormat": "long_month_day_year",
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
  ],
  "notifyCta": {
    "text": "Get notified when new dates are announced near you.",
    "buttonLabel": "Follow Demo Artist",
    "buttonUrl": "https://example.com/follow"
  },
  "seatedWidgetUrl": "https://example.com/widgets/tour"
}
```

Tour `region` is optional for dates where city and country are enough. The public location formatter skips missing regions.

`dateDisplayFormat` controls public tour date display. Allowed values:

```txt
iso
short_month_day_year
short_month_day
long_month_day_year
long_month_day
numeric_month_day_year
day_short_month_year
```

The dashboard stores dates as ISO `YYYY-MM-DD` for sorting and validation, then renders the selected display format on the public page. Past tour dates are automatically treated as unannounced.

### VIP

Controls the VIP page or external VIP store link.

```json
{
  "externalStoreUrl": "https://example.com/vip",
  "headline": "VIP Upgrades",
  "description": "Meet and greet upgrades are available for select shows.",
  "redirectOnly": false
}
```

### Shop

Controls the shop page, external store link, and featured merch.

```json
{
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
```

### About

Controls bio, genres, press, awards, photos, and press-kit links.

```json
{
  "shortBio": "One or two sentence artist bio.",
  "longBio": "Long-form artist biography.",
  "genres": ["Alt-Soul", "R&B", "Indie Pop"],
  "similarArtists": ["Artist Reference One"],
  "accolades": ["Featured on national editorial playlists"],
  "awards": [
    {
      "name": "Independent Music Award",
      "category": "Best New Artist",
      "year": 2026,
      "won": false
    }
  ],
  "pressQuotes": [
    {
      "id": "quote-001",
      "quote": "A striking new voice.",
      "publication": "Example Magazine",
      "author": "Jordan Example",
      "url": "https://example.com/press",
      "date": "2026-04-10"
    }
  ],
  "pressPhotos": [
    {
      "id": "photo-001",
      "path": "/uploads/site/photos/press-landscape.jpg",
      "orientation": "landscape",
      "creditLine": "Photo by Example Photographer"
    }
  ],
  "downloadableAssetsUrl": "https://example.com/press-kit.zip",
  "techRiderUrl": "https://example.com/tech-rider.pdf",
  "bookUrl": "https://example.com/book"
}
```

Press photo `orientation` must be one of:

```txt
portrait
landscape
square
```

`similarArtists`, `accolades`, download links, tech rider URL, and book URL are optional. If `accolades` is missing or empty, the public About page skips that list.

### Newsletter

Controls newsletter copy and provider configuration.

```json
{
  "headline": "Stay in the loop",
  "subheadline": "Get new music, tour dates, and merch drops first.",
  "backgroundImage": "/uploads/site/assets/newsletter-bg.jpg",
  "embedCode": "<form><!-- provider embed goes here --></form>",
  "externalSignupUrl": "https://example.com/newsletter",
  "provider": "mailchimp"
}
```

Provider must be one of:

```txt
mailchimp
klaviyo
beehiiv
convertkit
other
```

### Footer

Controls social links, legal links, and footer attribution.

```json
{
  "socials": {
    "facebook": "https://facebook.com/demoartist",
    "instagram": "https://instagram.com/demoartist",
    "youtube": "https://youtube.com/@demoartist",
    "tiktok": "https://tiktok.com/@demoartist",
    "spotify": "https://open.spotify.com",
    "appleMusic": "https://music.apple.com",
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
```

Supported social keys:

```txt
facebook
instagram
youtube
tiktok
spotify
appleMusic
bandcamp
twitter
website
soundcloud
```

### Contact

Stores non-public or contact-link emails used by the EPK.

```json
{
  "bookingEmail": "booking@example.com",
  "pressEmail": "press@example.com",
  "managementEmail": "management@example.com",
  "syncEmail": "sync@example.com"
}
```

`bookingEmail` is required. Other email fields are optional.

## Media Path Examples

Local uploaded files are served from:

```txt
/uploads/site/assets/<file>
/uploads/site/photos/<file>
/uploads/site/branding/<file>
/uploads/site/fonts/<file>
```

Common examples:

```txt
/uploads/site/assets/social-share.jpg
/uploads/site/assets/release-cover.jpg
/uploads/site/photos/press-landscape.jpg
/uploads/site/branding/logo.png
/uploads/site/branding/favicon.ico
/uploads/site/fonts/artist-display.woff2
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

From the repo root:

```bash
bun run validate:epk examples/demo-epk.example.json
```

Programmatic usage:

```ts
import { validateEPK } from './packages/schema'

const result = validateEPK(data)

if (!result.success) {
  console.log(result.issues)
}
```

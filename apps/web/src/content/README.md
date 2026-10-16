# EPK Schema Reference

All public site content lives in one TypeScript file, typed and validated against a Zod schema:

```txt
src/content/epk.ts       the content — edit this
src/content/schema.ts    the schema (EPKSchema, validateEPK, and TypeScript types)
src/content/index.ts     validates epk.ts and exports the typed `epk` with defaults applied
```

The demo `epk.ts` is intentionally complete. It shows every major section that can be included in the single-artist EPK. Replace demo text, URLs, emails, and media paths with the real artist's content.

`epk.ts` is checked against the schema's input type (`satisfies EPKInput`), so your editor autocompletes field names and enum values and flags misspelled keys, wrong types, and missing required fields as you type. Fields with schema defaults (such as `isFeatured`) can be left out.

Types can't check formats, so URL and email fields are validated at runtime. Validate without starting the app (from the repo root):

```bash
bun run validate:content
```

The app also validates on startup, so an invalid file fails loudly instead of rendering a broken page.

The section examples below are written as JSON for readability. In `epk.ts` the same shapes are plain object literals.

## Root Shape

```json
{
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

## Section Reference

### Metadata

Stores browser and social sharing metadata fields.

```json
{
  "title": "Demo Artist | Official EPK",
  "description": "Short share description for search and social previews.",
  "socialImage": "/media/assets/social-share.jpg",
  "faviconPath": "/media/branding/favicon.ico",
  "themeColor": "#3B1A1A",
  "siteUrl": "https://example.com"
}
```

The routed public pages currently set document and Open Graph titles from `<artistName> | <page>`. `metadata.title` and `pageTitle` are retained in the EPK data for custom use.

### Branding

Controls global visual identity.

```json
{
  "accentColor": "#3B1A1A",
  "backgroundTexture": "/media/branding/linen-texture.jpg",
  "logoImage": "/media/branding/logo.png",
  "logoText": "Demo Artist",
  "fontStyle": "script",
  "cornerMotif": "/media/branding/corner-motif.svg",
  "faviconPath": "/media/branding/favicon.ico",
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
        "source": "/media/fonts/artist-display.woff2"
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

`backgroundTexture`, when provided, is applied to the full public EPK page shell. `theme` and `fonts` control the public EPK's colors and typography.

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
    "coverImage": "/media/assets/midnight-signal-cover.jpg",
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
      "heroImage": "/media/assets/midnight-signal-hero.jpg",
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

To look up `title`, `channelName`, and `publishedDate` for a video, call the example API integration: `GET /api/integrations/youtube?url=<youtube-url-or-id>`.

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
      "vipPackages": [
        {
          "packageId": "vip-001",
          "dateSpecificUrl": "https://exampleartistvip.store/meet-and-greet/the-echo-2026-08-15"
        },
        {
          "packageId": "vip-002",
          "dateSpecificUrl": "https://exampleartistvip.store/early-entry/the-echo-2026-08-15"
        }
      ],
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
  "listingMode": "manual",
  "seatedWidgetUrl": "https://example.com/widgets/tour",
  "seatedEmbedCode": "<script src=\"https://example.com/seated.js\"></script>"
}
```

Tour `region` is optional for dates where city and country are enough. The public location formatter skips missing regions.

`vipPackages` connects a tour date to reusable VIP packages defined in the `vip.items` array. When `vip.redirectOnly` is `true`, each selected package uses the main `vip.externalStoreUrl` as its Default External URL. When `vip.redirectOnly` is `false`, each selected package can also have a `dateSpecificUrl`, such as `https://exampleartistvip.store/packagename/venueordate`; without that override, the public Tour page uses the package `purchaseUrl`, then the main `vip.externalStoreUrl` if one is configured. Legacy `vipPackageIds` and `vipUrl` fields are still accepted for older payloads.

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

Store dates as ISO `YYYY-MM-DD` for sorting and validation, then renders the selected display format on the public page. Past tour dates are automatically treated as unannounced.

`listingMode` can be `manual` or `seated`. When omitted, the public Tour page uses `seated` if `seatedEmbedCode` or `seatedWidgetUrl` is present, otherwise it uses the manual date list. `seatedEmbedCode` takes priority over `seatedWidgetUrl` when both are provided.

### VIP

Controls the VIP page or external VIP store link.

```json
{
  "externalStoreUrl": "https://exampleartistvip.store",
  "headline": "VIP Upgrades",
  "description": "Meet and greet upgrades are available for select shows.",
  "items": [
    {
      "id": "vip-001",
      "name": "Meet and Greet Package",
      "price": "150.00",
      "currency": "USD",
      "description": "Upgrade your night with a premium VIP experience.",
      "purchaseUrl": "https://exampleartistvip.store/meet-and-greet",
      "features": ["Photo opportunity", "Early entry"],
      "isFeatured": true
    }
  ],
  "redirectOnly": false
}
```

`externalStoreUrl` is optional unless the VIP nav should redirect directly to a main VIP site or packages should fall back to a shared VIP store. VIP package `purchaseUrl` is optional; use it only when the package URL is different from the main VIP site URL. Tour date links can override each selected package with `dateSpecificUrl` only when VIP is not in External mode.

### Shop

Controls the shop page, external store link, and optional featured merch cards with per-item external store URLs.

```json
{
  "externalStoreUrl": "https://exampleartistshop.myshopify.com",
  "headline": "Featured Merch",
  "featuredItems": [
    {
      "id": "merch-001",
      "name": "Midnight Signal Tee",
      "price": "35.00",
      "currency": "USD",
      "description": "Soft black tour tee with Midnight Signal artwork on the front.",
      "image": "/media/assets/tee.jpg",
      "purchaseUrl": "https://exampleartistshop.myshopify.com/products/midnight-signal-tee",
      "category": "clothing",
      "sizes": ["S", "M", "L", "XL"],
      "isFeatured": true
    }
  ],
  "redirectOnly": false
}
```

When `redirectOnly` is `true`, public navigation sends visitors directly to `externalStoreUrl`. When `redirectOnly` is `false`, `/shop` shows featured item cards inside the EPK and each public Buy button opens the item's `purchaseUrl`, falling back to `externalStoreUrl` if the item URL is blank.

`externalStoreUrl` is the default store destination. Item `purchaseUrl` should be the product page, preorder page, or store URL for that item. `shopifyVariantId` is retained as an optional reference for teams that later connect a provider, but the current public shop flow does not process checkout on-site.

Shop item `category` must be `clothing`, `music`, or `other`. Clothing items can include `sizes` using `XS`, `S`, `M`, `L`, `XL`, `2XL`, and `3XL`.

Legacy values such as `apparel`, `vinyl`, `poster`, and `merch` are also accepted and normalized during validation, so content copied from older EPKs still works.

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
      "path": "/media/photos/press-landscape.jpg",
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
  "backgroundImage": "/media/assets/newsletter-bg.jpg",
  "signupMode": "native",
  "embedCode": "<form><!-- provider embed goes here --></form>",
  "externalSignupUrl": "https://example.com/newsletter",
  "formFields": ["email", "firstName", "postalCode", "country"],
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

`signupMode` must be one of:

```txt
native
embed
```

Use `native` to render the template's built-in form fields. Use `embed` to render provider embed code. Older payloads without `signupMode` infer `embed` when `embedCode` exists, otherwise `native`.

`formFields` controls the native form. Email is always included and required. Allowed field values:

```txt
email
firstName
postalCode
country
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

Put media files in `apps/web/public/media/` and reference them by path. Vite serves `public/` at the site root:

```txt
/media/assets/<file>
/media/photos/<file>
/media/branding/<file>
/media/fonts/<file>
```

Common examples:

```txt
/media/assets/social-share.jpg
/media/assets/release-cover.jpg
/media/photos/press-landscape.jpg
/media/branding/logo.png
/media/branding/favicon.ico
/media/fonts/artist-display.woff2
```

## Validation Notes

TypeScript checks field names, value types, and enum values in `epk.ts` as you edit. URL and email formats can only be checked at runtime: the schema requires valid URLs for URL fields and valid emails for email fields.

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
bun run validate:content
```

Programmatic usage:

```ts
import { validateEPK } from './schema'

const result = validateEPK(data)

if (!result.success) {
  console.log(result.issues)
}
```

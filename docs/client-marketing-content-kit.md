# Client And Marketing Content Kit

This kit explains the EPK template in plain language for artist teams, managers, labels, marketing teams, and clients who do not want to work directly inside the code.

Use it as a step-by-step intake guide, content checklist, and handoff reference. The technical team can still use the dashboard, import tools, and JSON schema behind the scenes, but clients only need to understand what content is needed, which items are optional, and how the data is stored and shown on the public site.

## What This EPK Is

This template is a single-artist electronic press kit and artist site. It is designed to hold one public EPK at a time.

The site can include:

- A home page with a featured release, announcement, video, and tour preview.
- Music release cards.
- YouTube video embeds.
- Tour dates with ticket and VIP links.
- VIP and merch links or landing pages.
- Artist biography, press quotes, awards, photos, and downloadable assets.
- Newsletter signup.
- Footer social links and legal links.
- Private team contact information used for handoff and booking workflows.

The public site reads from one approved content record. The dashboard lets an authorized admin update that content without touching the source code.

On first launch, before any content has been saved, the public site shows a setup state. The dashboard still opens with a starter draft so the team can begin filling in sections immediately. Saving that starter draft creates the first live EPK record. Teams that already have a complete EPK JSON file can import it instead.

## Roles

### Client Or Artist Team

Provides final content, approved copy, links, images, brand assets, and business contact information.

### Marketing Team

Shapes messaging, featured releases, calls to action, social preview copy, campaign links, and launch readiness.

### Designer Or Brand Lead

Provides logos, colors, textures, favicon, social share image, release art, press photos, and any visual direction.

### Developer Or Site Admin

Uploads content, validates the EPK, saves dashboard changes, manages hosting, protects the admin key, and confirms the site works before launch.

## Step-By-Step Workflow

### Step 1: Confirm The EPK Goal

Decide what this EPK is meant to support.

Examples:

- New single launch.
- Album rollout.
- Tour announcement.
- Press outreach.
- Booking outreach.
- VIP or merch campaign.
- General artist site.

Recommended client notes:

- Main campaign priority.
- Launch date.
- Most important call to action.
- Secondary call to action.
- Audience: fans, press, bookers, partners, or all of the above.

### Step 2: Gather Core Artist Details

These items identify the artist and site.

Required:

- Artist name.
- Internal site slug. For this template, this normally stays `site`.
- Public site title or browser title.

Optional:

- Custom social preview title.
- Custom social preview description.
- Canonical public site URL.

Plain-language guidance:

- The artist name appears throughout the EPK.
- The page title appears in browser tabs and search/social previews when no more specific title is supplied.
- The site URL helps social platforms understand the official page.

### Step 3: Gather Brand Assets

Brand assets control the visual identity of the EPK.

Optional fields:

- Accent color, usually a hex color such as `#3B1A1A`.
- Background texture image.
- Logo image or wordmark.
- Logo text fallback.
- Font style preference: serif, sans, or script.
- Decorative corner motif image.
- Favicon path.
- Public EPK color theme values.
- Google fonts or uploaded font files.
- Per-element font styling for body text, headings, links, buttons, and navigation.

Recommended assets:

- Logo or wordmark as PNG, SVG, or WebP.
- Favicon as ICO, PNG, or SVG.
- Background texture or brand pattern if the campaign uses one.
- Social share image at 1200 x 630 pixels.

How this appears:

- Accent color influences key visual treatments.
- Background texture fills the public EPK page when provided.
- Logo image is preferred when provided.
- Logo text appears when no logo image is available.
- Favicon appears in browser tabs.
- Public EPK theme and font settings do not change the dashboard's separate light/dark mode.

### Step 4: Choose Navigation Sections

Navigation controls which sections visitors can easily access.

Available sections:

- Home.
- Music.
- Videos.
- Tour.
- VIP.
- Shop.
- About.
- Newsletter.
- Contact.

Recommended default:

- Home.
- Music.
- Tour.
- VIP.
- Shop.
- About.
- Newsletter.

Optional decisions:

- Hide VIP if there is no VIP program.
- Hide shop if merch is not ready.
- Hide newsletter if there is no signup destination.
- Hide contact if contact information should not be linked publicly.

Important note:

Only include sections that have useful, approved content. A smaller, complete EPK is better than a larger EPK with empty or placeholder sections.

### Step 5: Build The Home Page

The home page is the first impression.

Required:

- Featured release title.
- Featured release subtitle.
- Featured release cover image.
- Whether tour dates should appear on the home page.

Optional:

- Smart link URL for the featured release.
- Direct streaming URL.
- Featured video URL.
- Announcement text.
- Announcement button label.
- Announcement button URL.

Recommended examples:

- Featured release title: `Midnight Signal`.
- Subtitle: `new single out now`.
- Announcement: `North American tour dates are on sale now.`
- Button label: `Get tickets`.

How this appears:

- The featured release is the main hero content.
- The release link sends visitors to a streaming or smart-link destination.
- The announcement is useful for urgent campaign messaging.
- If enabled, tour dates can be mirrored on the home page so visitors see shows immediately.

### Step 6: Add Music Releases

Music releases power the public music page.

Required for each release:

- Unique release ID.
- Release title.
- Release type.
- Hero image.

Optional for each release:

- Release date.
- Smart link URL.
- Spotify link.
- Apple Music link.
- Tidal link.
- Deezer link.
- Amazon Music link.
- YouTube link.
- SoundCloud link.
- Bandcamp link.
- Featured status.
- Display order.

Allowed release types:

- Album.
- Single.
- EP.
- Mix.
- Compilation.
- Deluxe.
- Collaboration.

Recommended client notes:

- Use official release art.
- Use dates in year-month-day format, such as `2026-05-01`.
- Use smart links when possible because they let visitors choose a preferred platform.
- Use display order when the team wants full control over the sequence.
- Release date can be left blank when display order is the preferred sorting method.

How this appears:

- Each release becomes a visual card.
- Featured releases can be pinned or prioritized.
- Platform links support richer music discovery when available.

### Step 7: Add Videos

Videos use YouTube video IDs and supporting display details.

Required for each video:

- Unique video ID.
- Video title.
- YouTube video ID.
- Video type.
- Published date.

Optional for each video:

- Channel name.
- Featured status.
- Display order.

Dashboard shortcut:

- Paste a YouTube URL or video ID into the Videos tab to create a new video automatically.
- The system attempts to fill the title, YouTube video ID, channel name, publish date, and video type.
- The team can still edit those fields after import.

Allowed video types:

- Music video.
- Live.
- Video.
- Scheduled.
- Other.

How to find a YouTube video ID:

- For `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.
- For `https://youtu.be/dQw4w9WgXcQ`, the ID is also `dQw4w9WgXcQ`.

How this appears:

- Videos appear as embedded YouTube cards.
- Featured videos can be prioritized.
- Channel names help distinguish official, Vevo, live, or partner uploads.

### Step 8: Add Tour Dates

Tour content can be shown as a native list or connected to an external widget link.

Required for each date:

- Unique show ID.
- Date.
- Venue.
- City.
- Country.

Optional for each date:

- Region or state.
- Ticket URL.
- Date-specific VIP URL.
- VIP packages available for that show.
- Sold-out status.
- Supporting acts.
- Announced status.

Optional tour-level fields:

- Tour name.
- Notify call-to-action text.
- Notify button label.
- Notify button URL.
- Seated widget URL or other external widget URL.
- Public date display format, such as `Jun 5, 2026`, `June 5`, or `06/05/2026`.

Recommended client notes:

- Use dates in year-month-day format, such as `2026-08-15`.
- Region can be left blank for international dates that only need city and country.
- Tour dates that pass are automatically treated as unannounced.
- Mark sold-out dates clearly.
- If VIP mode is External, selected tour date VIP packages use the main VIP store as the Default External URL.
- If VIP mode is Manual, create reusable VIP packages in the VIP section, then select the packages available for each tour date.
- Use date-specific VIP package URLs in Manual VIP mode when a package has a unique purchase page for a venue or date.
- Use a notify link for visitors who do not see their city listed.

How this appears:

- Tour rows show date, venue, location, and action buttons.
- Ticket and VIP buttons can appear separately.
- Sold-out dates communicate scarcity while avoiding broken purchase flows.

### Step 9: Configure VIP

VIP can either redirect directly to an external store or show a lightweight VIP page with reusable packages.

Optional when VIP is enabled:

- Main external VIP store URL.

Optional:

- VIP headline.
- VIP description.
- VIP mode: External or Manual.
- VIP packages.

VIP package fields:

- Package ID.
- Package name.
- Price.
- Currency.
- Description.
- Image.
- Package URL.
- Features.
- Featured status.

Recommended client decisions:

- Use External mode when the external VIP store already explains all package details.
- Use an on-site VIP page when the team wants a short intro before sending visitors to the store.
- Use reusable VIP packages when the same offers appear across multiple tour dates.
- Add a package URL only when that package has a page different from the main VIP site.
- Add date-specific package URLs in the Tour section only when VIP mode is Manual and purchase pages vary by venue or date.

How this appears:

- In External mode, visitors go straight to the VIP store.
- In Manual mode, visitors can see a VIP landing page with headline and description.
- In External mode, tour date VIP package links use the main VIP store URL. In Manual mode, tour date VIP links can show selected package names and send visitors to the date-specific package URL, package URL, or main VIP site URL.

### Step 10: Configure Shop

Shop can send visitors to a single external store or show selected product cards that each link to an external store URL.

Required when shop is enabled:

- Default store URL.

Optional:

- Shop headline.
- Shop mode: External or Item links.
- Featured shop items.

Optional product fields:

- Product ID.
- Product name.
- Price.
- Currency.
- Product description.
- Product image.
- Item store URL.
- Category: clothing, music, or other.
- Clothing sizes: XS, S, M, L, XL, 2XL, or 3XL.
- Featured status.

Recommended client notes:

- This template does not process payment on-site.
- Use External mode when the artist wants the Shop nav to open the main storefront directly.
- Use Item links mode when the EPK should highlight selected merch, vinyl, bundles, or campaign items before sending buyers to the external product page.
- Clothing products can list available sizes for reference, but size selection and checkout happen on the external store.
- Featured products are best used for campaign items, new merch, bundles, or vinyl.

How this appears:

- In External mode, visitors go straight to the external store.
- In Item links mode, visitors browse highlighted items and click each Buy button to purchase on the external store.

### Step 11: Write The About And Press Section

The about section supports press, booking, and credibility.

Required:

- Short bio.
- Long bio.
- Genres.
- Awards list.
- Press quotes list.
- Press photos list.

Optional:

- Similar artists.
- Accolades.
- Downloadable assets URL.
- Tech rider URL.
- Booking or book URL.

Award fields:

- Award name.
- Category.
- Year.
- Won status.

Press quote fields:

- Quote ID.
- Quote text.
- Publication.
- Author.
- URL.
- Date.

Press photo fields:

- Photo ID.
- Image path.
- Orientation: portrait, landscape, or square.
- Credit line.

Recommended client notes:

- Short bio should be one or two sentences.
- Long bio can be several paragraphs.
- Accolades should be concise and verifiable.
- Press quotes should include publication names and source links when possible.
- Press photos should include photographer credits.
- Downloadable assets can point to a press kit ZIP, Dropbox, Google Drive, or other public folder.

How this appears:

- Short bio supports previews and compact descriptions.
- Long bio appears on the about page.
- Press quotes, awards, photos, and downloads support media and industry users.

### Step 12: Configure Newsletter

Newsletter content connects visitors to an email provider.

Optional fields:

- Headline.
- Subheadline.
- Background image.
- Signup method: native form fields or embed code.
- Provider embed code.
- External signup URL.
- Native form fields.
- Provider name.

Supported provider labels:

- Mailchimp.
- Klaviyo.
- Beehiiv.
- ConvertKit.
- Other.

Recommended client decisions:

- Use embed code when the provider form should appear directly on the page.
- Use external signup URL when the provider handles the form on its own page.
- Use native form fields when the frontend should show a simple on-site form instead of a provider embed.
- Use the dashboard signup method toggle to choose which option appears publicly.
- Email address is always included and required.
- Optional native fields include first name, postal code, and country.
- Keep the copy short and benefit-led.

How this appears:

- The newsletter section can display campaign copy, imagery, and either an embedded form, native form, or signup link.

### Step 13: Add Footer And Social Links

Footer content appears across the public site.

Required:

- Social links object. This can be empty if no socials are ready.
- Copyright name.

Optional:

- Facebook.
- Instagram.
- YouTube.
- TikTok.
- Spotify.
- Apple Music.
- Bandcamp.
- Twitter/X.
- Website.
- SoundCloud.
- Legal links.
- Powered-by label.
- Powered-by URL.

Legal link fields:

- Label.
- URL.

Recommended client notes:

- Include only official links.
- Confirm all social links are public and correct.
- Legal links should go to approved privacy policy and terms pages if available.

How this appears:

- Socials appear as footer links.
- Legal links appear in the footer.
- Powered-by attribution can be used for vendors, labels, platforms, or JRoybalDev.

### Step 14: Add Contact Information

Contact information supports professional outreach and internal handoff.

Required:

- Booking email.

Optional:

- Press email.
- Management email.
- Sync email.

Recommended client notes:

- Use role-based emails when possible, such as `booking@example.com`.
- Confirm all inboxes are active.
- Avoid personal emails unless the artist team approves them.

Data visibility note:

Treat contact information as sensitive business information. Depending on how the front end is configured, some contact details may be used publicly or for team workflows. Do not add private personal addresses unless they are approved for the EPK.

## Media Upload Guide

The dashboard supports four media categories:

- Photos.
- Branding.
- Assets.
- Fonts.

Use photos for:

- Press photos.
- Portraits.
- Live photos.
- Editorial images.

Use branding for:

- Logo.
- Wordmark.
- Favicon.
- Background texture.
- Decorative motifs.

Use assets for:

- Release covers.
- Merch images.
- Newsletter backgrounds.
- Social share images.
- Downloadable campaign files.

Use fonts for:

- Uploaded `.woff`, `.woff2`, `.ttf`, or other web font files approved for the site.

Local upload paths look like:

- `/uploads/site/photos/press-landscape.jpg`
- `/uploads/site/branding/logo.png`
- `/uploads/site/branding/favicon.ico`
- `/uploads/site/assets/social-share.jpg`
- `/uploads/site/assets/release-cover.jpg`
- `/uploads/site/fonts/artist-display.woff2`

Production guidance:

- Local uploads are fine during development.
- Production media should live in durable storage such as S3, R2, Vercel Blob, Cloudinary, or another approved media host.
- The EPK stores the final public URL or path, not the image file itself inside the main content record.

## Required Versus Optional Summary

### Always Required

- Artist name.
- Branding section.
- Navigation list.
- Home section.
- Music section.
- Videos list.
- Tour section.
- About section.
- Footer section.
- Contact section with booking email.

### Optional Top-Level Sections

- Page title.
- Metadata.
- VIP.
- Shop.
- Newsletter.

### Optional But Strongly Recommended

- Social preview image.
- Site description.
- Favicon.
- At least one release.
- At least one press photo.
- Official social links.
- Downloadable press assets.
- Active ticket, store, newsletter, or streaming links.

## How Data Is Handled

### Where Content Lives

The finished EPK content is saved as one structured record in the database. That record contains the artist text, links, settings, and media paths.

In technical terms, the server stores the EPK content as validated JSON in the `epks` table. Clients do not need to edit that JSON directly.

### How Public Visitors See The EPK

When someone visits the public site:

1. The web app asks the server for the current EPK.
2. The server returns the approved EPK content.
3. The web app renders pages such as home, music, tour, about, and newsletter from that content.

Public visitors do not need an admin key to view the EPK.

### How Admin Updates Work

When an authorized admin saves changes:

1. The dashboard keeps edits as an unsaved draft.
2. The admin clicks save.
3. The dashboard sends the full EPK draft to the server.
4. The request must include the admin key.
5. The server validates the content.
6. If validation passes, the database record is updated.
7. The public site reads the updated content.

If validation fails, the server returns a list of fields that need attention.

### How Media Uploads Work

When an authorized admin uploads a file:

1. The file is sent to the upload endpoint.
2. The request must include the admin key.
3. The server saves the file under the selected category.
4. The server returns a path.
5. The returned path is pasted into the relevant image, asset, logo, or download field.

The EPK content stores the file path or URL. It does not duplicate the file inside every section.

### How Video Metadata Import Works

When an admin pastes a YouTube URL in the Videos tab:

1. The dashboard extracts the YouTube video ID.
2. The dashboard asks the server for public YouTube metadata.
3. The server returns the title, channel name, publish date when available, video ID, and an inferred video type.
4. The dashboard creates a new editable video row.

This metadata lookup is a convenience feature. The admin can edit the imported values before saving.

### How Access Is Protected

Public reading:

- Visitors can read the public EPK without an admin key.

Protected writing:

- Saving EPK changes requires the admin key.
- Uploading files requires the admin key.
- The dashboard stores the entered admin key in the browser's local storage for convenience.
- The server still checks every protected write request.

Production rule:

- Never launch with a placeholder admin key.
- Store the real admin key in a password manager.
- Share it only with people approved to edit the EPK.

### What Is Validated

The system checks that:

- Required fields are present.
- URL fields contain complete valid URLs, such as `https://example.com`.
- Email fields contain valid email addresses.
- Dropdown-style fields use approved values.
- Dates are provided as plain date strings, preferably year-month-day.

Examples of valid values:

- `https://example.com/listen`
- `booking@example.com`
- `2026-05-01`
- `single`
- `mailchimp`

Examples that need correction:

- `example.com/listen`
- `booking`
- `May 1st`
- `song`
- `Mail Chimp`

## Client Intake Checklist

Use this checklist before content entry begins.

- Artist name is final.
- Campaign goal is clear.
- Primary call to action is chosen.
- Navigation sections are selected.
- Brand color and logo are approved.
- Favicon is provided or approved to create.
- Social share title, description, and image are ready.
- Featured release details are ready.
- Music release list is complete.
- Video links or YouTube IDs are ready.
- Tour dates, ticket links, and VIP links are confirmed.
- Shop mode, default store URL, and any item store URLs are confirmed.
- VIP URL and redirect preference are confirmed.
- VIP packages are confirmed.
- Each tour date has the correct VIP packages. If VIP mode is External, package links use the Default External URL; if VIP mode is Manual, any date-specific package URLs are confirmed.
- Short bio and long bio are approved.
- Genres, similar artists, awards, accolades, and press quotes are approved.
- Press photos and credits are approved.
- Downloadable press assets are available.
- Newsletter provider and signup method are selected.
- Social links are verified.
- Legal links are approved if needed.
- Booking email is active.
- Press, management, and sync emails are active if provided.

## Review Checklist Before Launch

- Public home page loads with final artist name and featured release.
- Music cards show correct artwork, titles, dates, and links.
- Videos play or open correctly.
- Tour dates show correct venues, locations, ticket links, VIP links, and sold-out states.
- VIP page or redirect works as expected.
- Shop page or redirect works as expected.
- About page copy is approved.
- Press photos display correctly with credits.
- Newsletter form or signup link works.
- Footer social links are correct.
- Browser title, favicon, and social preview metadata are correct.
- Mobile layout has been reviewed.
- Desktop layout has been reviewed.
- Admin key is not a placeholder.
- A final JSON backup has been exported from the dashboard.

## Plain-English Field Glossary

### ID

A unique internal label for one item, such as a release, video, show, product, quote, or photo. It helps the system tell items apart.

### URL

A full web address. Use `https://` at the beginning.

### Path

The location of an uploaded file or hosted asset. It may look like `/uploads/site/assets/file.jpg` locally or like a full media URL in production.

### Featured

A yes/no setting that tells the site to prioritize an item.

### Display Order

A number that controls the order of items. Lower numbers usually appear first.

### External Mode

A mode for VIP or Shop that sends visitors directly to the main external URL instead of showing an on-site page first.

### Item Links Mode

A Shop mode that shows selected item cards on the EPK. Each item has its own external store URL for the public Buy button.

### Embed Code

A small provider-supplied snippet used to show a newsletter form or other third-party widget on the page. This should come directly from the approved provider.

### Metadata

Information used by browsers, search engines, and social platforms, such as page title, description, share image, theme color, and favicon.

## Recommended Content Packet Format

Clients can deliver content in any clean format, but this structure works well:

1. Artist overview.
2. Brand assets folder.
3. Social preview copy and image.
4. Home page feature and announcement.
5. Music release spreadsheet or list.
6. Video list with YouTube links.
7. Tour date spreadsheet or list.
8. VIP and shop links.
9. Bio, accolades, awards, and press quotes.
10. Press photos with credits.
11. Newsletter provider details.
12. Footer socials and legal links.
13. Contact emails.

The developer or site admin can then enter the packet into the dashboard, validate it, save it, review the public site, and export a final backup.

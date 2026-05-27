import { z } from 'zod'

const UrlString = z.url();
const EmailString = z.email();
const PublicSectionKey = z.enum(['home', 'music', 'videos', 'shop', 'tour', 'vip', 'about', 'newsletter', 'contact'])
const HomeEmbedSectionKey = z.enum(['music', 'videos', 'shop', 'tour', 'vip', 'about', 'newsletter', 'contact'])

// ─── Global Branding ──────────────────────────────────────
// Observed: linen texture bg, script font logo, dark burgundy
// nav, decorative corner motifs — all configurable per artist
export const BrandingSchema = z.object({
    accentColor: z.string().optional(), // hex, e.g. nav bg "#3B1A1A"
    backgroundTexture: z.string().optional(), // path to uploaded texture image
    logoImage: z.string().optional(), // path to script/wordmark logo
    logoText: z.string().optional(), // fallback text if no logo image
    fontStyle: z.enum(['serif', 'sans', 'script']).default('sans'), // decorative SVG/image for corners
    cornerMotif: z.string().optional(),
    faviconPath: z.string().optional(),
})

// ─── Metadata / Social Sharing ───────────────────────────
export const MetadataSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    socialImage: z.string().optional(),
    faviconPath: z.string().optional(),
    themeColor: z.string().optional(),
    siteUrl: z.string().optional(),
})

// ─── Home ─────────────────────────────────────────────────
// Observed: centered album art card, title + subtitle below,
// then full tour date list embedded directly on /home
export const HomeSchema = z.object({
    featuredRelease: z.object({
        title: z.string(), // e.g. "album or single title"
        subtitle: z.string(), // e.g. "release date or album out now or single out now"
        coverImage: z.string(), // uploaded image path
        smartLinkUrl: UrlString.optional(), // lnk.to or similar aggregator
        directStreamUrl: UrlString.optional(), // fallback direct stream link
    }),
    showTourDatesOnHome: z.boolean().default(true), // mirrors /tour section on home
    sectionsOnHome: z.array(HomeEmbedSectionKey).default([]), // full sections to also render on home
    // Optional secondary featured content (video, announcement, etc.)
    featuredVideo: z.object({
        url: UrlString,
        title: z.string().optional(),
        youtubeVideoId: z.string().optional(),
        channelName: z.string().optional(),
        publishedDate: z.string().optional(),
    }).optional(),
    featuredVideoUrl: UrlString.optional(),
    announcement: z.object({
        text: z.string(),
        linkUrl: UrlString.optional(),
        linkLabel: z.string().optional(),
    }).optional(),
})

// ─── Music ────────────────────────────────────────────────
// Observed: full-bleed image grid, each card = one release,
// clicking opens a smart link page (lnk.to) with platform chooser
// NOT direct embeds — the image IS the card with title overlay
export const ReleaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['album', 'single', 'ep', 'mix', 'compilation', 'deluxe', 'collab']),
    releaseDate: z.string(), // ISO date
    heroImage: z.string(), // full-bleed card image (required)
    smartLinkUrl: UrlString.optional(), // e.g. artistname.lnk.to/albumname
    // Per-platform links shown in the smart link chooser
    streamingLinks: z.object({
        spotify: UrlString.optional(),
        appleMusic: UrlString.optional(),
        tidal: UrlString.optional(),
        deezer: UrlString.optional(),
        amazonMusic: UrlString.optional(),
        youtube: UrlString.optional(),
        soundcloud: UrlString.optional(),
        bandcamp: UrlString.optional(),
    }).optional(),
    isFeatured: z.boolean().default(false),
    displayOrder: z.number().optional(),
})

export const MusicSchema = z.object({
    releases: z.array(ReleaseSchema),
    gridColumns: z.enum(['1', '2', '3', '4']).default('2'),
})

// ─── Videos ───────────────────────────────────────────────
// Observed: 2-column YouTube iframe grid, no filter tabs,
// channel attribution shown on each card, chronological order
// Mix of music videos (Vevo) and non-Vevo (BTS)
export const VideoSchema = z.object({
    id: z.string(),
    title: z.string(),
    youtubeVideoId: z.string(),
    channelName: z.string().optional(),
    type: z.enum(['music_video', 'live', 'video', 'scheduled', 'other']),
    publishedDate: z.string(), // ISO date
    isFeatured: z.boolean().default(false), // Pinned to top
    displayOrder: z.number().optional(),
})

// ─── Tour ─────────────────────────────────────────────────
// Observed: date / venue / "city, state" columns,
// TWO buttons per row: "vip" (links to VIP store) + "tickets"
// End of list has a "get notified" / "follow" CTA
// Powered by Seated widget (can embed or replicate)
export const TourDateSchema = z.object({
    id: z.string(),
    date: z.string(), // ISO date
    venue: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string(),
    ticketUrl: UrlString.optional(),
    vipUrl: UrlString.optional(), // per-show VIP link (to external store)
    isSoldOut: z.boolean().default(false),
    supportingActs: z.array(z.string()).optional(),
    isAnnounced: z.boolean().default(true), // false = "coming soon" placeholder
})

export const TourSchema = z.object({
    dates: z.array(TourDateSchema),
    tourName: z.string().optional(), // Tour name
    // "Get notified" CTA at bottom of tour list
    notifyCta: z.object({
        text: z.string(),
        buttonLabel: z.string(),
        buttonUrl: UrlString, // Seated/Bandsintown follow link
    }).optional(),
    // Integration: embed Seated widget vs render our own list
    seatedWidgetUrl: UrlString.optional(), // if set, iframe it instead
})

// ─── VIP ──────────────────────────────────────────────────
// Observed: redirects to artistvip.store (external Shopify)
// The /vip page itself is a per-show list, each with "vip upgrades" btn
// No package descriptions on the main site — that's on the external store
export const VIPSchema = z.object({
    externalStoreUrl: UrlString, // e.g. artistvip.store
    // Optional: override per-show VIP urls (otherwise falls back to externalStoreUrl)
    // These are already on TourDateSchema.vipUrl - VIPSchema is global config
    headline: z.string().optional(),
    description: z.string().optional(),
    // If true, /vip just redirects to externalStoreUrl immediately
    redirectOnly: z.boolean().default(true),
})

// ─── Shop ─────────────────────────────────────────────────
// Observed: redirects to store.artist.com (external Shopify)
// Featured items shown: name + price, product image, no cart on-site
// Shop has its own nav: "home / music / merch"
export const ShopItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.string(),
    currency: z.string().default('USD'),
    image: z.string().optional(),
    purchaseUrl: UrlString,
    category: z.string().optional(),
    isFeatured: z.boolean().default(false),
})

export const ShopSchema = z.object({
    externalStoreUrl: UrlString, // e.g. store.artist.com
    headline: z.string().optional(),
    // Featured Items to display on the /shop page before redirecting
    featuredItems: z.array(ShopItemSchema).optional(),
    // If true, /shop just redirects to externalStoreUrl immediately
    redirectOnly: z.boolean().default(false),
})

// ─── About ────────────────────────────────────────────────
// Observed from search results: long-form bio, accolades list,
// Grammy nominations, chart achievements, creative credits
export const AwardSchema = z.object({
    name: z.string(), // e.g. Grammy Nomination
    category: z.string().optional(),
    year: z.number(),
    won: z.boolean().default(false),
})

export const PressQuoteSchema = z.object({
    id: z.string(),
    quote: z.string(),
    publication: z.string(),
    author: z.string().optional(),
    url: UrlString.optional(),
    date: z.string().optional(),
})

export const AboutSchema = z.object({
    shortBio: z.string(), // 1-2 sentences for meta/previews
    longBio: z.string(), // full paragraphs for /about page
    genres: z.array(z.string()),
    similarArtists: z.array(z.string()).optional(),
    accolades: z.array(z.string()), // achievement bullet list
    awards: z.array(AwardSchema),
    pressQuotes: z.array(PressQuoteSchema),
    pressPhotos: z.array(z.object({
        id: z.string(),
        path: z.string(),
        orientation: z.enum(['portrait', 'landscape', 'square']),
        creditLine: z.string().optional(),
    })),
    downloadableAssetsUrl: UrlString.optional(),
    techRiderUrl: UrlString.optional(),
    bookUrl: UrlString.optional(), // e.g. memoirs/autobiography
})

// ─── Newsletter ───────────────────────────────────────────
export const NewsletterSchema = z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    backgroundImage: z.string().optional(),
    // Provider: Mailchimp, Klaviyo, etc
    embedCode: z.string().optional(),
    externalSignupUrl: UrlString.optional(),
    // Provider name for display
    provider: z.enum(['mailchimp', 'klaviyo', 'beehiiv', 'convertkit', 'other']).optional(),
})

// ─── Footer ───────────────────────────────────────────────
// Observed: TikTok, Facebook, Instagram, YouTube, Spotify, Apple Music
// Copyright line (label name + year), legal links row
export const FooterSchema = z.object({
    socials: z.object({
        facebook: UrlString.optional(),
        instagram: UrlString.optional(),
        youtube: UrlString.optional(),
        tiktok: UrlString.optional(),
        spotify: UrlString.optional(),
        appleMusic: UrlString.optional(),
        bandcamp: UrlString.optional(),
        twitter: UrlString.optional(),
        website: UrlString.optional(),
        soundcloud: UrlString.optional(),
    }),
    copyrightName: z.string(), // e.g. Sony Music Entertainment
    legalLinks: z.array(z.object({
        label: z.string(), // e.g. Privacy Policy
        url: UrlString,
    })).optional(),
    poweredByLabel: z.string().optional(), // e.g. Seated
    poweredByUrl: UrlString.optional(),
})

// ─── Contact (press/booking only — not public-facing page) ─
export const ContactSchema = z.object({
    bookingEmail: EmailString,
    pressEmail: EmailString.optional(),
    managementEmail: EmailString.optional(),
    syncEmail: EmailString.optional(),
})

// ─── Root EPK Schema ──────────────────────────────────────
export const EPKSchema = z.object({
    slug: z.string(),
    artistName: z.string(),
    pageTitle: z.string().optional(), // Browser <title> override
    metadata: MetadataSchema.optional(),

    branding: BrandingSchema,
    nav: z.array(PublicSectionKey),

    home: HomeSchema,
    music: MusicSchema,
    videos: z.array(VideoSchema),
    tour: TourSchema,
    vip: VIPSchema.optional(),
    shop: ShopSchema.optional(),
    about: AboutSchema,
    newsletter: NewsletterSchema.optional(),

    footer: FooterSchema,
    contact: ContactSchema,
})

export type ValidationIssue = {
    path: string
    message: string
}

export const formatValidationIssues = (error: z.ZodError): ValidationIssue[] =>
    error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
    }))

export const validateEPK = (data: unknown) => {
    const parsed = EPKSchema.safeParse(data)

    if (parsed.success) {
        return {
            success: true as const,
            data: parsed.data,
            issues: [],
        }
    }

    return {
        success: false as const,
        data: null,
        issues: formatValidationIssues(parsed.error),
    }
}

export type EPK = z.infer<typeof EPKSchema>
export type Release = z.infer<typeof ReleaseSchema>
export type TourDate = z.infer<typeof TourDateSchema>
export type Video = z.infer<typeof VideoSchema>
export type ShopItem = z.infer<typeof ShopItemSchema>

// export type Award = z.infer<typeof AwardSchema>
// export type PressQuote = z.infer<typeof PressQuoteSchema>
// export type Branding = z.infer<typeof BrandingSchema>
// export type Footer = z.infer<typeof FooterSchema>
// export type Contact = z.infer<typeof ContactSchema>
// export type Newsletter = z.infer<typeof NewsletterSchema>
// export type About = z.infer<typeof AboutSchema>
// export type VIP = z.infer<typeof VIPSchema>
// export type Shop = z.infer<typeof ShopSchema>
// export type Home = z.infer<typeof HomeSchema>
// export type Music = z.infer<typeof MusicSchema>

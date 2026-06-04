import { z } from 'zod'

const UrlString = z.url();
const EmailString = z.email();
const OptionalString = z.preprocess(
    (value) => value === null || value === '' ? undefined : value,
    z.string().optional(),
)
export const PublicSectionKey = z.enum(['home', 'music', 'videos', 'shop', 'tour', 'vip', 'about', 'newsletter', 'contact'])
export const HomeEmbedSectionKey = z.enum(['music', 'videos', 'shop', 'tour', 'vip', 'about', 'newsletter', 'contact'])
export const DateDisplayFormatKey = z.enum([
    'iso',
    'short_month_day_year',
    'short_month_day',
    'long_month_day_year',
    'long_month_day',
    'numeric_month_day_year',
    'day_short_month_year',
])
export const TourListingModeKey = z.enum(['manual', 'seated'])
export const ShopItemCategoryKey = z.enum(['clothing', 'music', 'other'])
export const ClothingSizeKey = z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
const normalizeShopItemCategory = (value: unknown) => {
    if (typeof value !== 'string') return value

    const category = value.trim().toLowerCase()

    if (['apparel', 'clothes', 'shirt', 'shirts', 'tee', 'tshirt', 't-shirt'].includes(category)) {
        return 'clothing'
    }

    if (['album', 'cd', 'record', 'vinyl'].includes(category)) {
        return 'music'
    }

    if (['merch', 'merchandise', 'accessory', 'accessories', 'poster', 'posters'].includes(category)) {
        return 'other'
    }

    return value
}
export const ShopItemCategorySchema = z.preprocess(
    normalizeShopItemCategory,
    ShopItemCategoryKey.optional(),
)
export const TourDateVipPackageSchema = z.object({
    packageId: z.string(),
    dateSpecificUrl: UrlString.optional(),
})
export const FontAssignmentSchema = z.object({
    family: z.string().optional(),
    weight: z.string().optional(),
    style: z.enum(['normal', 'italic', 'oblique']).optional(),
    size: z.string().optional(),
    lineHeight: z.string().optional(),
    letterSpacing: z.string().optional(),
    textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
})
export const BrandingThemeSchema = z.object({
    bg: z.string().optional(),
    bgAlt: z.string().optional(),
    surface: z.string().optional(),
    surfaceStrong: z.string().optional(),
    text: z.string().optional(),
    muted: z.string().optional(),
    accent: z.string().optional(),
    accentStrong: z.string().optional(),
    accentSoft: z.string().optional(),
    border: z.string().optional(),
    cardBorder: z.string().optional(),
    foam: z.string().optional(),
})
export const GoogleFontSchema = z.object({
    family: z.string(),
    weights: z.string().optional(),
    styles: z.string().optional(),
})
export const UploadedFontSchema = z.object({
    family: z.string(),
    source: z.string(),
    weight: z.string().optional(),
    style: z.enum(['normal', 'italic', 'oblique']).optional(),
})
export const BrandingFontsSchema = z.object({
    googleFonts: z.array(GoogleFontSchema).optional(),
    uploadedFonts: z.array(UploadedFontSchema).optional(),
    assignments: z.object({
        body: FontAssignmentSchema.optional(),
        h1: FontAssignmentSchema.optional(),
        h2: FontAssignmentSchema.optional(),
        h3: FontAssignmentSchema.optional(),
        p: FontAssignmentSchema.optional(),
        a: FontAssignmentSchema.optional(),
        button: FontAssignmentSchema.optional(),
        nav: FontAssignmentSchema.optional(),
    }).optional(),
})

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
    theme: BrandingThemeSchema.optional(),
    fonts: BrandingFontsSchema.optional(),
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
export const FeaturedReleaseSchema = z.object({
        title: z.string(), // e.g. "album or single title"
        subtitle: z.string(), // e.g. "release date or album out now or single out now"
        coverImage: z.string(), // uploaded image path
        smartLinkUrl: UrlString.optional(), // lnk.to or similar aggregator
        directStreamUrl: UrlString.optional(), // fallback direct stream link
})
export const FeaturedVideoSchema = z.object({
    url: UrlString,
    title: z.string().optional(),
    youtubeVideoId: z.string().optional(),
    channelName: z.string().optional(),
    publishedDate: z.string().optional(),
})
export const AnnouncementSchema = z.object({
    text: z.string(),
    linkUrl: UrlString.optional(),
    linkLabel: z.string().optional(),
})
export const HomeSchema = z.object({
    featuredRelease: FeaturedReleaseSchema,
    showTourDatesOnHome: z.boolean().default(true), // mirrors /tour section on home
    sectionsOnHome: z.array(HomeEmbedSectionKey).default([]), // full sections to also render on home
    // Optional secondary featured content (video, announcement, etc.)
    featuredVideo: FeaturedVideoSchema.optional(),
    featuredVideoUrl: UrlString.optional(),
    announcement: AnnouncementSchema.optional(),
})

// ─── Music ────────────────────────────────────────────────
// Observed: full-bleed image grid, each card = one release,
// clicking opens a smart link page (lnk.to) with platform chooser
// NOT direct embeds — the image IS the card with title overlay
export const ReleaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['album', 'single', 'ep', 'mix', 'compilation', 'deluxe', 'collab']),
    releaseDate: OptionalString, // ISO date
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
    region: OptionalString,
    country: z.string(),
    ticketUrl: UrlString.optional(),
    vipUrl: UrlString.optional(), // per-show VIP link override
    vipPackageIds: z.array(z.string()).optional(), // legacy selected reusable VIP packages
    vipPackages: z.array(TourDateVipPackageSchema).optional(), // selected packages with optional per-date URLs
    isSoldOut: z.boolean().default(false),
    supportingActs: z.array(z.string()).optional(),
    isAnnounced: z.boolean().default(true), // false = "coming soon" placeholder
})

export const TourSchema = z.object({
    dates: z.array(TourDateSchema),
    tourName: z.string().optional(), // Tour name
    dateDisplayFormat: DateDisplayFormatKey.default('long_month_day_year'),
    listingMode: TourListingModeKey.optional(),
    // "Get notified" CTA at bottom of tour list
    notifyCta: z.object({
        text: z.string(),
        buttonLabel: z.string(),
        buttonUrl: UrlString, // Seated/Bandsintown follow link
    }).optional(),
    // Integration: embed Seated widget vs render our own list
    seatedWidgetUrl: UrlString.optional(), // if set, iframe it instead
    seatedEmbedCode: z.string().optional(),
})

// ─── VIP ──────────────────────────────────────────────────
// Observed: redirects to artistvip.store (external store)
// The /vip page itself is a per-show list, each with "vip upgrades" btn
// No package descriptions on the main site — that's on the external store
export const VIPItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.string(),
    currency: z.string().default('USD'),
    description: z.string().optional(),
    image: z.string().optional(),
    purchaseUrl: UrlString.optional(),
    features: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(true),
})

export const VIPSchema = z.object({
    externalStoreUrl: UrlString.optional(), // e.g. artistvip.store
    // Optional: per-show VIP urls on TourDateSchema override package/store URLs
    headline: z.string().optional(),
    description: z.string().optional(),
    items: z.array(VIPItemSchema).optional(),
    // If true, /vip just redirects to externalStoreUrl immediately
    redirectOnly: z.boolean().default(true),
})

// ─── Shop ─────────────────────────────────────────────────
// Observed: redirects to store.artist.com (external store)
// Featured items shown: name + price, product image, external Buy URL
// Shop has its own nav: "home / music / merch"
export const ShopItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.string(),
    currency: z.string().default('USD'),
    description: z.string().optional(),
    image: z.string().optional(),
    purchaseUrl: UrlString.optional(),
    shopifyVariantId: z.string().optional(),
    category: ShopItemCategorySchema,
    sizes: z.array(ClothingSizeKey).optional(),
    isFeatured: z.boolean().default(false),
})

export const ShopSchema = z.object({
    externalStoreUrl: UrlString, // e.g. store.artist.com
    headline: z.string().optional(),
    // Featured items to display on the /shop page in Item links mode.
    featuredItems: z.array(ShopItemSchema).optional(),
    // If true, /shop just redirects to externalStoreUrl immediately.
    redirectOnly: z.boolean().default(true),
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
    accolades: z.array(z.string()).optional(), // achievement bullet list
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
export const NewsletterFieldKey = z.enum(['email', 'firstName', 'postalCode', 'country'])
export const NewsletterSignupModeKey = z.enum(['native', 'embed'])
export const NewsletterSchema = z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    backgroundImage: z.string().optional(),
    signupMode: NewsletterSignupModeKey.optional(),
    // Provider: Mailchimp, Klaviyo, etc
    embedCode: z.string().optional(),
    externalSignupUrl: UrlString.optional(),
    formFields: z.array(NewsletterFieldKey).default(['email']),
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
export type PublicSection = z.infer<typeof PublicSectionKey>
export type HomeEmbedSection = z.infer<typeof HomeEmbedSectionKey>
export type DateDisplayFormat = z.infer<typeof DateDisplayFormatKey>
export type TourListingMode = z.infer<typeof TourListingModeKey>
export type ShopItemCategory = z.infer<typeof ShopItemCategoryKey>
export type ClothingSize = z.infer<typeof ClothingSizeKey>
export type TourDateVipPackage = z.infer<typeof TourDateVipPackageSchema>
export type Branding = z.infer<typeof BrandingSchema>
export type BrandingTheme = z.infer<typeof BrandingThemeSchema>
export type BrandingFonts = z.infer<typeof BrandingFontsSchema>
export type GoogleFont = z.infer<typeof GoogleFontSchema>
export type UploadedFont = z.infer<typeof UploadedFontSchema>
export type FontAssignment = z.infer<typeof FontAssignmentSchema>
export type FeaturedRelease = z.infer<typeof FeaturedReleaseSchema>
export type FeaturedVideo = z.infer<typeof FeaturedVideoSchema>
export type Announcement = z.infer<typeof AnnouncementSchema>
export type Home = z.infer<typeof HomeSchema>
export type Release = z.infer<typeof ReleaseSchema>
export type Music = z.infer<typeof MusicSchema>
export type TourDate = z.infer<typeof TourDateSchema>
export type Video = z.infer<typeof VideoSchema>
export type ShopItem = z.infer<typeof ShopItemSchema>
export type VIPItem = z.infer<typeof VIPItemSchema>
export type Award = z.infer<typeof AwardSchema>
export type PressQuote = z.infer<typeof PressQuoteSchema>
export type Footer = z.infer<typeof FooterSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Newsletter = z.infer<typeof NewsletterSchema>
export type NewsletterField = z.infer<typeof NewsletterFieldKey>
export type NewsletterSignupMode = z.infer<typeof NewsletterSignupModeKey>
export type VIP = z.infer<typeof VIPSchema>
export type Shop = z.infer<typeof ShopSchema>

export type About = z.infer<typeof AboutSchema>

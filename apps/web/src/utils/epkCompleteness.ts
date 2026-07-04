import type { EPK } from '../../../../packages/schema'

export type SectionStatus = 'ready' | 'attention' | 'empty'

export type CompletenessSectionId =
  | 'home'
  | 'music'
  | 'videos'
  | 'tour'
  | 'vip'
  | 'shop'
  | 'about'
  | 'newsletter'
  | 'contact'
  | 'footer'
  | 'branding'
  | 'metadata'

type SectionCheck = {
  id: CompletenessSectionId
  label: string
  required: boolean
  status: (epk: EPK) => SectionStatus
}

const hasText = (value: string | undefined | null) => Boolean(value?.trim())

const sectionChecks: SectionCheck[] = [
  {
    id: 'home',
    label: 'Home',
    required: true,
    status: (epk) => {
      const release = epk.home.featuredRelease
      const fields = [release.title, release.subtitle, release.coverImage]
      const filled = fields.filter(hasText).length

      if (filled === fields.length) return 'ready'
      return filled > 0 ? 'attention' : 'empty'
    },
  },
  {
    id: 'music',
    label: 'Music',
    required: true,
    status: (epk) => (epk.music.releases.length > 0 ? 'ready' : 'empty'),
  },
  {
    id: 'videos',
    label: 'Videos',
    required: false,
    status: (epk) => (epk.videos.length > 0 ? 'ready' : 'empty'),
  },
  {
    id: 'tour',
    label: 'Tour',
    required: true,
    status: (epk) => {
      const isSeated = (epk.tour.listingMode ?? 'manual') === 'seated'
      const hasContent = isSeated
        ? hasText(epk.tour.seatedEmbedCode) || hasText(epk.tour.seatedWidgetUrl)
        : epk.tour.dates.length > 0

      return hasContent ? 'ready' : 'empty'
    },
  },
  {
    id: 'vip',
    label: 'VIP',
    required: false,
    status: (epk) => {
      if (!epk.vip) return 'empty'
      const hasContent = epk.vip.redirectOnly
        ? hasText(epk.vip.externalStoreUrl)
        : (epk.vip.items?.length ?? 0) > 0

      return hasContent ? 'ready' : 'attention'
    },
  },
  {
    id: 'shop',
    label: 'Shop',
    required: false,
    status: (epk) => {
      if (!epk.shop) return 'empty'
      const hasContent = epk.shop.redirectOnly
        ? hasText(epk.shop.externalStoreUrl)
        : (epk.shop.featuredItems?.length ?? 0) > 0

      return hasContent ? 'ready' : 'attention'
    },
  },
  {
    id: 'about',
    label: 'About',
    required: true,
    status: (epk) => {
      const fields = [epk.about.shortBio, epk.about.longBio]
      const filled = fields.filter(hasText).length + (epk.about.genres.length > 0 ? 1 : 0)

      if (filled === fields.length + 1) return 'ready'
      return filled > 0 ? 'attention' : 'empty'
    },
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    required: false,
    status: (epk) => {
      if (!epk.newsletter) return 'empty'
      const hasContent =
        (epk.newsletter.signupMode ?? 'native') === 'embed'
          ? hasText(epk.newsletter.embedCode)
          : hasText(epk.newsletter.headline)

      return hasContent ? 'ready' : 'attention'
    },
  },
  {
    id: 'contact',
    label: 'Contact',
    required: true,
    status: (epk) => (hasText(epk.contact.bookingEmail) ? 'ready' : 'empty'),
  },
  {
    id: 'footer',
    label: 'Footer',
    required: true,
    status: (epk) => (hasText(epk.footer.copyrightName) ? 'ready' : 'empty'),
  },
  {
    id: 'branding',
    label: 'Branding',
    required: true,
    status: (epk) => {
      const fields = [epk.artistName, epk.branding.accentColor]
      const filled = fields.filter(hasText).length

      if (filled === fields.length) return 'ready'
      return filled > 0 ? 'attention' : 'empty'
    },
  },
  {
    id: 'metadata',
    label: 'Metadata',
    required: false,
    status: (epk) => (hasText(epk.metadata?.description) ? 'ready' : 'attention'),
  },
]

export type ChecklistItem = {
  id: CompletenessSectionId
  label: string
  title: string
  where: string
}

export type EPKCompleteness = {
  statuses: Record<CompletenessSectionId, SectionStatus>
  requiredCount: number
  readyCount: number
  attentionCount: number
  percent: number
  checklist: ChecklistItem[]
}

export const getEPKCompleteness = (epk: EPK): EPKCompleteness => {
  const statuses = {} as Record<CompletenessSectionId, SectionStatus>
  const checklist: ChecklistItem[] = []
  let requiredCount = 0
  let readyCount = 0
  let attentionCount = 0

  for (const check of sectionChecks) {
    const status = check.status(epk)
    statuses[check.id] = status

    if (check.required) {
      requiredCount += 1
      if (status === 'ready') readyCount += 1
    }

    if (status !== 'ready') {
      attentionCount += 1
      checklist.push({
        id: check.id,
        label: check.label,
        title: `Finish ${check.label}`,
        where: check.required ? 'Required to publish' : 'Optional, recommended',
      })
    }
  }

  const percent = requiredCount > 0 ? Math.round((readyCount / requiredCount) * 100) : 100

  return { statuses, requiredCount, readyCount, attentionCount, percent, checklist }
}

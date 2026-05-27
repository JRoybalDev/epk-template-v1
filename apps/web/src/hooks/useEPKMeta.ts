import { useEffect } from 'react'
import type { EPK } from '../../../../packages/schema'

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

const upsertFavicon = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'icon'
    document.head.appendChild(element)
  }

  element.href = href
}

export const useEPKMeta = (epk?: EPK, pageLabel = 'Home') => {
  useEffect(() => {
    if (!epk) return

    const title = `${epk.artistName} | ${pageLabel}`
    const description =
      epk.metadata?.description ||
      epk.about.shortBio ||
      epk.home.announcement?.text ||
      `Official EPK for ${epk.artistName}.`
    const socialImage =
      epk.metadata?.socialImage || epk.home.featuredRelease.coverImage
    const themeColor =
      epk.metadata?.themeColor ||
      epk.branding.accentColor
    const faviconPath =
      epk.metadata?.faviconPath ||
      epk.branding.faviconPath

    document.title = title
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: socialImage ? 'summary_large_image' : 'summary',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })

    if (epk.metadata?.siteUrl) {
      const canonicalUrl = new URL(
        window.location.pathname,
        epk.metadata.siteUrl,
      ).toString()

      upsertMeta('meta[property="og:url"]', {
        property: 'og:url',
        content: canonicalUrl,
      })
    }

    if (socialImage) {
      upsertMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: socialImage,
      })
    }

    if (themeColor) {
      upsertMeta('meta[name="theme-color"]', {
        name: 'theme-color',
        content: themeColor,
      })
    }

    if (faviconPath) {
      upsertFavicon(faviconPath)
    }
  }, [epk, pageLabel])
}

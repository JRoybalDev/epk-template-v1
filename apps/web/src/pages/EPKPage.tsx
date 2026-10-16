import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '../components/epk/SiteFooter'
import { epk } from '../content'
import { useEPKMeta } from '../hooks/useEPKMeta'
import { getEPKBrandingStyle } from '../utils/brandingTheme'
import type { EPK } from '../content/schema'

const navLabels = {
  home: 'Home',
  music: 'Music',
  videos: 'Videos',
  shop: 'Shop',
  tour: 'Tour',
  vip: 'VIP',
  about: 'About',
  newsletter: 'Newsletter',
  contact: 'Contact',
} as const

const navPaths = {
  home: '/',
  music: '/music',
  videos: '/videos',
  shop: '/shop',
  tour: '/tour',
  vip: '/vip',
  about: '/about',
  newsletter: '/newsletter',
} as const

const pageLabelsByPath = {
  '/': 'Home',
  '/music': 'Music',
  '/videos': 'Videos',
  '/shop': 'Shop',
  '/tour': 'Tour',
  '/vip': 'VIP',
  '/about': 'About',
  '/newsletter': 'Newsletter',
} as const

const isConfiguredNavItem = (epk: EPK, item: EPK['nav'][number]) => {
  switch (item) {
    case 'vip':
      return Boolean(epk.vip)
    case 'shop':
      return Boolean(epk.shop)
    case 'contact':
      return Boolean(epk.contact.bookingEmail)
    default:
      return true
  }
}

const getExternalNavUrl = (epk: EPK, item: EPK['nav'][number]) => {
  switch (item) {
    case 'shop':
      return epk.shop?.redirectOnly ? epk.shop.externalStoreUrl : null
    case 'vip':
      return epk.vip?.redirectOnly && epk.vip.externalStoreUrl
        ? epk.vip.externalStoreUrl
        : null
    default:
      return null
  }
}

export function EPKPage() {
  const location = useLocation()
  const pageLabel =
    pageLabelsByPath[location.pathname as keyof typeof pageLabelsByPath] ??
    'Page'
  useEPKMeta(epk, pageLabel)

  const brandingStyle = getEPKBrandingStyle(epk.branding)

  return (
    <main data-template="epk-public-shell" style={brandingStyle.variables}>
      {brandingStyle.css && <style>{brandingStyle.css}</style>}
      <header data-section="site-header">
        <div data-field="branding">
          <NavLink to="/" aria-label={`${epk.artistName} home`}>
            {epk.branding.logoImage ? (
              <img src={epk.branding.logoImage} alt={epk.artistName} />
            ) : (
              <span>{epk.branding.logoText || epk.artistName}</span>
            )}
          </NavLink>
        </div>
        <nav aria-label="Public EPK sections" data-section="site-navigation">
          {epk.nav.filter((item) => isConfiguredNavItem(epk, item)).map((item) => {
            const externalNavUrl = getExternalNavUrl(epk, item)

            if (item === 'contact') {
              return (
                <a href={`mailto:${epk.contact.bookingEmail}`} key={item}>
                  {navLabels[item]}
                </a>
              )
            }

            if (externalNavUrl) {
              return (
                <a href={externalNavUrl} key={item} rel="noreferrer" target="_blank">
                  {navLabels[item]}
                </a>
              )
            }

            return (
              <NavLink end={item === 'home'} key={item} to={navPaths[item]}>
                {navLabels[item]}
              </NavLink>
            )
          })}
        </nav>
      </header>
      <Outlet context={{ epk }} />
      <SiteFooter epk={epk} />
    </main>
  )
}

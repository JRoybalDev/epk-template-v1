import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '../components/epk/SiteFooter'
import { useEPK } from '../hooks/useEPK'
import { useEPKMeta } from '../hooks/useEPKMeta'
import { getEPKBrandingStyle } from '../utils/brandingTheme'
import type { EPK } from '../../../../packages/schema'

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
    case 'newsletter':
      return Boolean(epk.newsletter)
    case 'contact':
      return Boolean(epk.contact.bookingEmail)
    default:
      return true
  }
}

export function EPKPage() {
  const location = useLocation()
  const pageLabel =
    pageLabelsByPath[location.pathname as keyof typeof pageLabelsByPath] ??
    'Page'
  const epkQuery = useEPK()
  useEPKMeta(epkQuery.data, pageLabel)

  if (epkQuery.isLoading) {
    return (
      <main data-template="epk-public-shell" data-state="loading">
        <p>Loading EPK...</p>
      </main>
    )
  }

  if (epkQuery.isError) {
    return (
      <main data-template="epk-public-shell" data-state="error">
        <h1>EPK unavailable</h1>
        <p>{epkQuery.error.message}</p>
      </main>
    )
  }

  const epk = epkQuery.data
  const brandingStyle = epk ? getEPKBrandingStyle(epk.branding) : null

  if (!epk) {
    return (
      <main data-template="epk-public-shell" data-state="empty">
        <section>
          <p>Setup needed</p>
          <h1>No EPK content yet</h1>
          <p>Import a validated EPK JSON file, then refresh this page to render the public site.</p>
          <code>bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm</code>
        </section>
      </main>
    )
  }

  return (
    <main data-template="epk-public-shell" style={brandingStyle?.variables}>
      {brandingStyle?.css && <style>{brandingStyle.css}</style>}
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
          {epk.nav.filter((item) => isConfiguredNavItem(epk, item)).map((item) =>
            item === 'contact' ? (
              <a href={`mailto:${epk.contact.bookingEmail}`} key={item}>
                {navLabels[item]}
              </a>
            ) : (
              <NavLink end={item === 'home'} key={item} to={navPaths[item]}>
                {navLabels[item]}
              </NavLink>
            ),
          )}
        </nav>
      </header>
      <Outlet context={{ epk }} />
      <SiteFooter epk={epk} />
    </main>
  )
}

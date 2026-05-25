import type { CSSProperties } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { SiteFooter } from '../components/epk/SiteFooter'
import { useEPK } from '../hooks/useEPK'
import { useEPKMeta } from '../hooks/useEPKMeta'
import './EPKPage.css'

const navLabels = {
  home: 'Home',
  music: 'Music',
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
  shop: '/shop',
  tour: '/tour',
  vip: '/vip',
  about: '/about',
  newsletter: '/newsletter',
} as const

export function EPKPage() {
  const epkQuery = useEPK()
  useEPKMeta(epkQuery.data)

  if (epkQuery.isLoading) {
    return (
      <main className="epk-status site-shell">
        <p>Loading EPK...</p>
      </main>
    )
  }

  if (epkQuery.isError) {
    return (
      <main className="epk-status site-shell">
        <h1>EPK unavailable</h1>
        <p>{epkQuery.error.message}</p>
      </main>
    )
  }

  const epk = epkQuery.data

  if (!epk) {
    return (
      <main className="epk-status epk-status--setup site-shell">
        <section>
          <p className="epk-status__eyebrow">Setup needed</p>
          <h1>No EPK content yet</h1>
          <p>Import a validated EPK JSON file, then refresh this page to render the public site.</p>
          <code>bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm</code>
        </section>
      </main>
    )
  }

  const shellStyle = {
    '--epk-accent': epk.branding.accentColor ?? 'var(--color-accent)',
  } as CSSProperties

  return (
    <main className="epk-shell site-shell" style={shellStyle}>
      <header className="epk-header">
        <div className="epk-header__inner site-container">
          <NavLink className="epk-brand" to="/" aria-label={`${epk.artistName} home`}>
            {epk.branding.logoImage ? (
              <img src={epk.branding.logoImage} alt={epk.artistName} />
            ) : (
              <span>{epk.branding.logoText || epk.artistName}</span>
            )}
          </NavLink>
          <nav className="epk-nav" aria-label="Public EPK sections">
            {epk.nav.map((item) =>
              item === 'contact' ? (
                <a className="epk-nav__link" href={`mailto:${epk.contact.bookingEmail}`} key={item}>
                  {navLabels[item]}
                </a>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'epk-nav__link epk-nav__link--active' : 'epk-nav__link'
                  }
                  end={item === 'home'}
                  key={item}
                  to={navPaths[item]}
                >
                  {navLabels[item]}
                </NavLink>
              ),
            )}
          </nav>
        </div>
      </header>
      <Outlet context={{ epk }} />
      <SiteFooter epk={epk} />
    </main>
  )
}

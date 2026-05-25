import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import './DashboardPage.css'

const adminKeyStorageKey = 'epk-admin-key'

const dashboardSections = [
  { id: 'branding', label: 'Branding' },
  { id: 'home', label: 'Home' },
  { id: 'music', label: 'Music' },
  { id: 'videos', label: 'Videos' },
  { id: 'tour', label: 'Tour' },
  { id: 'vip', label: 'VIP' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
  { id: 'assets', label: 'Assets' },
  { id: 'footer', label: 'Footer' },
]

export function DashboardPage() {
  const { section } = useParams()
  const [storedKey, setStoredKey] = useState(() =>
    window.localStorage.getItem(adminKeyStorageKey) ?? '',
  )
  const [adminKey, setAdminKey] = useState('')

  const activeSection = useMemo(
    () =>
      dashboardSections.find((item) => item.id === section) ??
      dashboardSections[0],
    [section],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedKey = adminKey.trim()

    if (!trimmedKey) return

    window.localStorage.setItem(adminKeyStorageKey, trimmedKey)
    setStoredKey(trimmedKey)
    setAdminKey('')
  }

  const clearKey = () => {
    window.localStorage.removeItem(adminKeyStorageKey)
    setStoredKey('')
    setAdminKey('')
  }

  if (!storedKey) {
    return (
      <main className="dashboard-gate site-shell">
        <section className="dashboard-gate__panel" aria-labelledby="dashboard-gate-title">
          <div className="dashboard-gate__mark" aria-hidden="true">
            JR
          </div>
          <p className="dashboard-gate__eyebrow">Artist EPK</p>
          <h1 id="dashboard-gate-title">Dashboard access</h1>
          <form className="dashboard-gate__form" onSubmit={handleSubmit}>
            <label htmlFor="admin-key">Admin key</label>
            <input
              id="admin-key"
              name="admin-key"
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              autoComplete="off"
            />
            <button type="submit">Unlock dashboard</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard-shell site-shell">
      <aside className="dashboard-sidebar" aria-label="Dashboard sections">
        <div>
          <p className="dashboard-sidebar__eyebrow">Artist EPK</p>
          <h1>Dashboard</h1>
        </div>
        <nav className="dashboard-nav">
          {dashboardSections.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive || (!section && item.id === activeSection.id)
                  ? 'dashboard-nav__link dashboard-nav__link--active'
                  : 'dashboard-nav__link'
              }
              key={item.id}
              to={`/dashboard/${item.id}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="dashboard-sidebar__clear" type="button" onClick={clearKey}>
          Clear key
        </button>
      </aside>
      <section className="dashboard-workspace" aria-labelledby="dashboard-section-title">
        <div className="dashboard-workspace__header">
          <p className="dashboard-workspace__eyebrow">Editing</p>
          <h2 id="dashboard-section-title">{activeSection.label}</h2>
        </div>
        <div className="dashboard-workspace__panel">
          <p>{activeSection.label} editor will render here.</p>
        </div>
      </section>
    </main>
  )
}

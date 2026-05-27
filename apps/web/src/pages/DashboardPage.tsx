import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { Link, NavLink, useParams } from 'react-router-dom'
import { FiChevronDown, FiMoon, FiSun } from 'react-icons/fi'
import { validateEPK } from '../../../../packages/schema'
import { AboutEditor } from '../components/dashboard/AboutEditor'
import { AssetUploader } from '../components/dashboard/AssetUploader'
import { BrandingEditor } from '../components/dashboard/BrandingEditor'
import { ContactEditor } from '../components/dashboard/ContactEditor'
import { FooterEditor } from '../components/dashboard/FooterEditor'
import { HomeEditor } from '../components/dashboard/HomeEditor'
import { JsonToolsEditor } from '../components/dashboard/JsonToolsEditor'
import { MetadataEditor } from '../components/dashboard/MetadataEditor'
import { MusicEditor } from '../components/dashboard/MusicEditor'
import { NavEditor } from '../components/dashboard/NavEditor'
import { NewsletterEditor } from '../components/dashboard/NewsletterEditor'
import { ShopEditor } from '../components/dashboard/ShopEditor'
import { TourEditor } from '../components/dashboard/TourEditor'
import { VIPEditor } from '../components/dashboard/VIPEditor'
import { VideoEditor } from '../components/dashboard/VideoEditor'
import { saveEPK } from '../api/client'
import { invalidateEPK, setCachedEPK, useEPK } from '../hooks/useEPK'
import { useEPKStore } from '../hooks/useEPKStore'
import { downloadEPKJson } from '../utils/exportEPK'
import './DashboardPage.css'

const adminKeyStorageKey = 'epk-admin-key'
const dashboardThemeStorageKey = 'epk-dashboard-theme'
type DashboardTheme = 'light' | 'dark'
type DashboardSectionId =
  | 'nav'
  | 'branding'
  | 'metadata'
  | 'home'
  | 'music'
  | 'videos'
  | 'tour'
  | 'vip'
  | 'shop'
  | 'about'
  | 'newsletter'
  | 'contact'
  | 'json'
  | 'assets'
  | 'footer'
type DashboardNavGroupId = 'setup' | 'content' | 'commerce' | 'profile' | 'tools'
type DashboardSection = {
  id: DashboardSectionId
  label: string
}
type DashboardNavGroup = {
  id: DashboardNavGroupId
  label: string
  sections: DashboardSection[]
}

const dashboardNavGroups: DashboardNavGroup[] = [
  {
    id: 'setup',
    label: 'Site setup',
    sections: [
      { id: 'nav', label: 'Navigation' },
      { id: 'branding', label: 'Branding' },
      { id: 'metadata', label: 'Metadata' },
    ],
  },
  {
    id: 'content',
    label: 'Core content',
    sections: [
      { id: 'home', label: 'Home' },
      { id: 'music', label: 'Music' },
      { id: 'videos', label: 'Videos' },
      { id: 'tour', label: 'Tour' },
    ],
  },
  {
    id: 'commerce',
    label: 'Offers',
    sections: [
      { id: 'vip', label: 'VIP' },
      { id: 'shop', label: 'Shop' },
      { id: 'newsletter', label: 'Newsletter' },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    sections: [
      { id: 'about', label: 'About' },
      { id: 'contact', label: 'Contact' },
      { id: 'footer', label: 'Footer' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    sections: [
      { id: 'json', label: 'JSON' },
      { id: 'assets', label: 'Assets' },
    ],
  },
]

const dashboardSections = dashboardNavGroups.flatMap((group) => group.sections)
const navEase = [0.22, 1, 0.36, 1] as const

export function DashboardPage() {
  const { section } = useParams()
  const queryClient = useQueryClient()
  const epkQuery = useEPK({ retry: false })
  const loadedDraftAtRef = useRef(0)
  const draft = useEPKStore((state) => state.draft)
  const isDirty = useEPKStore((state) => state.isDirty)
  const loadDraft = useEPKStore((state) => state.loadDraft)
  const replaceDraft = useEPKStore((state) => state.replaceDraft)
  const updateField = useEPKStore((state) => state.updateField)
  const resetDraft = useEPKStore((state) => state.resetDraft)
  const markSaved = useEPKStore((state) => state.markSaved)
  const [storedKey, setStoredKey] = useState(() =>
    window.localStorage.getItem(adminKeyStorageKey) ?? '',
  )
  const [adminKey, setAdminKey] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [validationIssues, setValidationIssues] = useState<string[]>([])
  const [dashboardTheme, setDashboardTheme] = useState<DashboardTheme>(() =>
    window.localStorage.getItem(dashboardThemeStorageKey) === 'dark'
      ? 'dark'
      : 'light',
  )
  const dashboardThemeClass = `dashboard-theme-${dashboardTheme}`
  const prefersReducedMotion = useReducedMotion()
  const dashboardArtistName =
    draft?.artistName || epkQuery.data?.artistName || 'Artist'

  const updateDashboardTheme = (theme: DashboardTheme) => {
    window.localStorage.setItem(dashboardThemeStorageKey, theme)
    setDashboardTheme(theme)
  }

  const themeToggle = (
    <label className="dashboard-theme-toggle">
      <FiSun aria-hidden="true" className="dashboard-theme-toggle__icon" />
      <input
        aria-label="Dashboard dark mode"
        checked={dashboardTheme === 'dark'}
        type="checkbox"
        onChange={(event) =>
          updateDashboardTheme(event.target.checked ? 'dark' : 'light')
        }
      />
      <span className="dashboard-theme-toggle__track" aria-hidden="true">
        <span className="dashboard-theme-toggle__thumb" />
      </span>
      <FiMoon aria-hidden="true" className="dashboard-theme-toggle__icon" />
    </label>
  )

  const activeSection = useMemo(
    () =>
      dashboardSections.find((item) => item.id === section) ??
      dashboardSections[0],
    [section],
  )
  const activeNavGroup = useMemo(
    () =>
      dashboardNavGroups.find((group) =>
        group.sections.some((item) => item.id === activeSection.id),
      ) ?? dashboardNavGroups[0],
    [activeSection.id],
  )
  const [openNavGroup, setOpenNavGroup] = useState<DashboardNavGroupId | null>(
    activeNavGroup.id,
  )
  const navLayoutTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.28,
        ease: navEase,
      }
  const navPanelTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        height: { duration: 0.32, ease: navEase },
        opacity: { duration: 0.18, ease: 'easeOut' },
        y: { duration: 0.24, ease: navEase },
      }
  const navItemsTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        delayChildren: 0.04,
        staggerChildren: 0.035,
      }
  const navItemTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.18,
        ease: navEase,
      }

  useEffect(() => {
    setOpenNavGroup(activeNavGroup.id)
  }, [activeNavGroup.id])

  useEffect(() => {
    document.title = `${dashboardArtistName} | Dashboard`
  }, [dashboardArtistName])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!draft) throw new Error('No draft EPK is loaded.')
      return saveEPK(draft, storedKey)
    },
    onSuccess: async () => {
      if (!draft) return
      markSaved(draft)
      setCachedEPK(queryClient, draft)
      await invalidateEPK(queryClient)
      setSaveMessage('Saved EPK changes.')
    },
  })

  useEffect(() => {
    if (
      epkQuery.data &&
      !isDirty &&
      loadedDraftAtRef.current !== epkQuery.dataUpdatedAt
    ) {
      loadDraft(epkQuery.data)
      loadedDraftAtRef.current = epkQuery.dataUpdatedAt
    }
  }, [epkQuery.data, epkQuery.dataUpdatedAt, isDirty, loadDraft])

  useEffect(() => {
    if (!isDirty) return

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeUnload)

    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [isDirty])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedKey = adminKey.trim()

    if (!trimmedKey) return

    window.localStorage.setItem(adminKeyStorageKey, trimmedKey)
    setStoredKey(trimmedKey)
    setAdminKey('')
  }

  const clearKey = () => {
    if (
      isDirty &&
      !window.confirm('You have unsaved dashboard changes. Sign out anyway?')
    ) {
      return
    }

    window.localStorage.removeItem(adminKeyStorageKey)
    setStoredKey('')
    setAdminKey('')
  }

  const guardUnsavedChanges = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      isDirty &&
      !window.confirm('You have unsaved dashboard changes. Leave this page anyway?')
    ) {
      event.preventDefault()
    }
  }

  const updateDraftField: typeof updateField = (...args) => {
    setValidationIssues([])
    updateField(...args)
  }

  const replaceDashboardDraft: typeof replaceDraft = (...args) => {
    setValidationIssues([])
    replaceDraft(...args)
  }

  const resetDashboardDraft: typeof resetDraft = (...args) => {
    setValidationIssues([])
    resetDraft(...args)
  }

  const saveDraft = () => {
    if (!draft) return

    const validation = validateEPK(draft)
    if (!validation.success) {
      setSaveMessage('')
      setValidationIssues(
        validation.issues.map(
          (issue) => `${issue.path || 'root'}: ${issue.message}`,
        ),
      )
      return
    }

    setValidationIssues([])
    setSaveMessage('')
    saveMutation.mutate()
  }

  const renderEditor = (sectionId: DashboardSectionId) => {
    if (!draft) return null

    const editorProps = { draft, updateField: updateDraftField }

    switch (sectionId) {
      case 'branding':
        return <BrandingEditor {...editorProps} />
      case 'metadata':
        return <MetadataEditor {...editorProps} />
      case 'nav':
        return <NavEditor {...editorProps} />
      case 'home':
        return <HomeEditor {...editorProps} />
      case 'music':
        return <MusicEditor {...editorProps} />
      case 'videos':
        return <VideoEditor {...editorProps} />
      case 'tour':
        return <TourEditor {...editorProps} />
      case 'vip':
        return <VIPEditor {...editorProps} />
      case 'shop':
        return <ShopEditor {...editorProps} />
      case 'about':
        return <AboutEditor {...editorProps} />
      case 'newsletter':
        return <NewsletterEditor {...editorProps} />
      case 'contact':
        return <ContactEditor {...editorProps} />
      case 'json':
        return (
          <JsonToolsEditor
            draft={draft}
            replaceDraft={replaceDashboardDraft}
            updateField={updateDraftField}
          />
        )
      case 'assets':
        return <AssetUploader adminKey={storedKey} />
      case 'footer':
        return <FooterEditor {...editorProps} />
      default:
        return null
    }
  }

  if (!storedKey) {
    return (
      <main className={`dashboard-gate ${dashboardThemeClass} site-shell`}>
        <div className="dashboard-gate__theme">{themeToggle}</div>
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
    <main className={`dashboard-shell ${dashboardThemeClass} site-shell`}>
      <aside className="dashboard-sidebar" aria-label="Dashboard sections">
        <div>
          <p className="dashboard-sidebar__eyebrow">{dashboardArtistName}</p>
          <h1>Dashboard</h1>
        </div>
        <nav className="dashboard-nav" aria-label="Dashboard sections">
          <LayoutGroup>
            {dashboardNavGroups.map((group) => {
              const isOpen = openNavGroup === group.id
              const isActiveGroup = group.id === activeNavGroup.id

              return (
                <motion.section
                  className={[
                    'dashboard-nav__group',
                    'collapse',
                    isOpen ? 'collapse-open' : 'collapse-close',
                    isActiveGroup ? 'dashboard-nav__group--active' : '',
                  ].filter(Boolean).join(' ')}
                  key={group.id}
                  layout="position"
                  transition={navLayoutTransition}
                >
                  <button
                    aria-controls={`dashboard-nav-${group.id}`}
                    aria-expanded={isOpen}
                    className="dashboard-nav__group-trigger collapse-title"
                    type="button"
                    onClick={() =>
                      setOpenNavGroup((current) =>
                        current === group.id ? null : group.id,
                      )
                    }
                  >
                    <span>{group.label}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      aria-hidden="true"
                      className="dashboard-nav__group-icon"
                      transition={navLayoutTransition}
                    >
                      <FiChevronDown />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false} mode="popLayout">
                    {isOpen && (
                      <motion.div
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        className="dashboard-nav__group-content collapse-content"
                        exit={{ height: 0, opacity: 0, y: -4 }}
                        id={`dashboard-nav-${group.id}`}
                        initial={{ height: 0, opacity: 0, y: -4 }}
                        transition={navPanelTransition}
                      >
                        <motion.div
                          animate="open"
                          className="dashboard-nav__group-content-inner"
                          initial="closed"
                          variants={{
                            closed: {},
                            open: {
                              transition: navItemsTransition,
                            },
                          }}
                        >
                          {group.sections.map((item) => (
                            <motion.div
                              key={item.id}
                              variants={{
                                closed: { opacity: 0, x: -4 },
                                open: {
                                  opacity: 1,
                                  transition: navItemTransition,
                                  x: 0,
                                },
                              }}
                            >
                              <NavLink
                                className={({ isActive }) =>
                                  isActive || (!section && item.id === activeSection.id)
                                    ? 'dashboard-nav__link dashboard-nav__link--active'
                                    : 'dashboard-nav__link'
                                }
                                onClick={guardUnsavedChanges}
                                to={`/dashboard/${item.id}`}
                              >
                                {item.label}
                              </NavLink>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              )
            })}
          </LayoutGroup>
        </nav>
        <button className="dashboard-sidebar__clear" type="button" onClick={clearKey}>
          Sign out
        </button>
      </aside>
      <section className="dashboard-workspace" aria-labelledby="dashboard-section-title">
        <div className="dashboard-workspace__header">
          <div>
            <p className="dashboard-workspace__eyebrow">Editing</p>
            <div className="dashboard-title-row">
              <h2 id="dashboard-section-title">{activeSection.label}</h2>
              {isDirty && <span className="dashboard-dirty-badge">Unsaved</span>}
            </div>
          </div>
          <div className="dashboard-workspace__action-stack">
            {themeToggle}
            <div className="dashboard-workspace__actions">
              <Link
                className="dashboard-action dashboard-action--link"
                onClick={guardUnsavedChanges}
                rel="noreferrer"
                target="_blank"
                to="/"
              >
                View public EPK
              </Link>
              <button
                className="dashboard-action"
                disabled={!draft}
                type="button"
                onClick={() => {
                  if (draft) downloadEPKJson(draft)
                }}
              >
                Export EPK
              </button>
              <button
                className="dashboard-action"
                disabled={!isDirty || saveMutation.isPending}
                type="button"
                onClick={resetDashboardDraft}
              >
                Reset
              </button>
              <button
                className="dashboard-action dashboard-action--primary"
                disabled={!draft || !isDirty || saveMutation.isPending}
                type="button"
                onClick={saveDraft}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save EPK'}
              </button>
            </div>
          </div>
        </div>
        <div className="dashboard-workspace__panel">
          {epkQuery.isLoading && <p>Loading EPK content...</p>}
          {epkQuery.isError && (
            <div className="dashboard-empty">
              <h3>No EPK content loaded</h3>
              <p>
                Validate and import an EPK JSON file from the terminal, then refresh
                this dashboard.
              </p>
              <code>bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm</code>
            </div>
          )}
          {draft && renderEditor(activeSection.id)}
          {validationIssues.length > 0 && (
            <div className="dashboard-message dashboard-message--error">
              <strong>Fix these validation issues before saving:</strong>
              <ul>
                {validationIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {saveMutation.isError && (
            <p className="dashboard-message dashboard-message--error">
              {saveMutation.error.message}
            </p>
          )}
          {saveMessage && (
            <p className="dashboard-message dashboard-message--success">{saveMessage}</p>
          )}
        </div>
      </section>
    </main>
  )
}

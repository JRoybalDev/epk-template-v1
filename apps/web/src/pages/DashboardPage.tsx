import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent as ReactMouseEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  FiDroplet,
  FiEdit2,
  FiEdit3,
  FiFlag,
  FiGrid,
  FiHelpCircle,
  FiHexagon,
  FiImage,
  FiLayout,
  FiMail,
  FiMenu,
  FiMinus,
  FiMoon,
  FiMusic,
  FiPlay,
  FiRepeat,
  FiShare2,
  FiStar,
  FiSun,
  FiType,
  FiX,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { validateEPK, type EPK } from '../../../../packages/schema'
import { AboutEditor } from '../components/dashboard/AboutEditor'
import { AssetUploader } from '../components/dashboard/AssetUploader'
import { BrandingEditor } from '../components/dashboard/BrandingEditor'
import { ContactEditor } from '../components/dashboard/ContactEditor'
import { FontsEditor } from '../components/dashboard/FontsEditor'
import { FooterEditor } from '../components/dashboard/FooterEditor'
import { HelpGuide } from '../components/dashboard/HelpGuide'
import { HomeEditor } from '../components/dashboard/HomeEditor'
import { JsonToolsEditor } from '../components/dashboard/JsonToolsEditor'
import { LayoutEditor } from '../components/dashboard/LayoutEditor'
import { MetadataEditor } from '../components/dashboard/MetadataEditor'
import { MusicEditor } from '../components/dashboard/MusicEditor'
import { NavEditor } from '../components/dashboard/NavEditor'
import { NewsletterEditor } from '../components/dashboard/NewsletterEditor'
import { LiveCanvas } from '../components/dashboard/LiveCanvas'
import { OverviewScreen } from '../components/dashboard/OverviewScreen'
import { RequiredLegend } from '../components/dashboard/RequiredLegend'
import { ShopEditor } from '../components/dashboard/ShopEditor'
import { TourEditor } from '../components/dashboard/TourEditor'
import { VIPEditor } from '../components/dashboard/VIPEditor'
import { VideoEditor } from '../components/dashboard/VideoEditor'
import { ApiClientError, saveEPK } from '../api/client'
import {
  broadcastEPKUpdate,
  epkQueryKey,
  invalidateEPK,
  setCachedEPK,
  useEPK,
} from '../hooks/useEPK'
import {
  applyDocumentMeta,
  cacheDocumentMeta,
  getEPKFaviconPath,
} from '../hooks/useEPKMeta'
import { useEPKStore } from '../hooks/useEPKStore'
import { downloadEPKJson } from '../utils/exportEPK'
import { getEPKCompleteness, type CompletenessSectionId } from '../utils/epkCompleteness'
import { createStarterEPK } from '../utils/starterEPK'
import './DashboardPage.css'

const adminKeyStorageKey = 'epk-admin-key'
const dashboardThemeStorageKey = 'epk-dashboard-theme'
type DashboardTheme = 'light' | 'dark'
type DashboardSectionId =
  | 'overview'
  | 'home'
  | 'music'
  | 'videos'
  | 'tour'
  | 'vip'
  | 'about'
  | 'contact'
  | 'shop'
  | 'newsletter'
  | 'branding'
  | 'fonts'
  | 'nav'
  | 'layout'
  | 'metadata'
  | 'footer'
  | 'json'
  | 'assets'
  | 'help'
type DashboardNavGroupId =
  | 'musicVideo'
  | 'shows'
  | 'yourStory'
  | 'storeFans'
  | 'lookFeel'
  | 'publishTools'
type DashboardSection = {
  id: DashboardSectionId
  label: string
  icon: IconType
}
type DashboardNavGroup = {
  id: DashboardNavGroupId
  label: string
  sections: DashboardSection[]
}

const overviewSection: DashboardSection = { id: 'overview', label: 'Overview', icon: FiHexagon }
const helpSection: DashboardSection = { id: 'help', label: 'Setup Guide', icon: FiHelpCircle }

// Exact section catalog + grouping from the shared design source (order/meta in
// EPK Dashboard Redesign.dc.html) — keep group membership and copy in sync with that file.
const dashboardNavGroups: DashboardNavGroup[] = [
  {
    id: 'musicVideo',
    label: 'Music & Video',
    sections: [
      { id: 'home', label: 'Spotlight', icon: FiSun },
      { id: 'music', label: 'Releases', icon: FiMusic },
      { id: 'videos', label: 'Videos', icon: FiPlay },
    ],
  },
  {
    id: 'shows',
    label: 'Shows',
    sections: [
      { id: 'tour', label: 'Tour dates', icon: FiFlag },
      { id: 'vip', label: 'VIP upgrades', icon: FiStar },
    ],
  },
  {
    id: 'yourStory',
    label: 'Your Story',
    sections: [
      { id: 'about', label: 'About & bio', icon: FiEdit2 },
      { id: 'contact', label: 'Contact', icon: FiMail },
    ],
  },
  {
    id: 'storeFans',
    label: 'Store & Fans',
    sections: [
      { id: 'shop', label: 'Shop', icon: FiGrid },
      { id: 'newsletter', label: 'Newsletter', icon: FiEdit3 },
    ],
  },
  {
    id: 'lookFeel',
    label: 'Look & Feel',
    sections: [
      { id: 'branding', label: 'Branding', icon: FiDroplet },
      { id: 'fonts', label: 'Fonts & text', icon: FiType },
      { id: 'layout', label: 'Page layout', icon: FiLayout },
      { id: 'nav', label: 'Menu', icon: FiMenu },
    ],
  },
  {
    id: 'publishTools',
    label: 'Publish & Tools',
    sections: [
      { id: 'metadata', label: 'Share preview', icon: FiShare2 },
      { id: 'assets', label: 'Media library', icon: FiImage },
      { id: 'footer', label: 'Footer', icon: FiMinus },
      { id: 'json', label: 'Import / Export', icon: FiRepeat },
    ],
  },
]

const dashboardSections = [
  overviewSection,
  ...dashboardNavGroups.flatMap((group) => group.sections),
  helpSection,
]
const navEase = [0.22, 1, 0.36, 1] as const
const isMissingEPKError = (error: unknown) =>
  error instanceof ApiClientError && error.status === 404
const sectionsWithoutRequiredLegend = new Set<DashboardSectionId>([
  'overview',
  'json',
  'assets',
  'help',
])
const showRequiredLegendFor = (sectionId: DashboardSectionId) =>
  !sectionsWithoutRequiredLegend.has(sectionId)

const sectionIdForTopLevelKey: Partial<Record<string, DashboardSectionId>> = {
  nav: 'nav',
  branding: 'branding',
  metadata: 'metadata',
  home: 'home',
  music: 'music',
  videos: 'videos',
  tour: 'tour',
  vip: 'vip',
  shop: 'shop',
  about: 'about',
  newsletter: 'newsletter',
  footer: 'footer',
  contact: 'contact',
}

type DashboardValidationIssue = {
  message: string
  path: string
  sectionId: DashboardSectionId | null
}

const getIssueSectionId = (path: string): DashboardSectionId | null => {
  const [topKey, secondKey] = path.split('.')

  if (topKey === 'branding' && secondKey === 'fonts') return 'fonts'

  return sectionIdForTopLevelKey[topKey] ?? null
}

const normalizeEPKForSave = (epk: EPK): EPK => ({
  ...epk,
  tour: {
    ...epk.tour,
    dates: epk.tour.dates.map((date) => ({
      ...date,
      region: date.region?.trim() ?? '',
    })),
  },
})

export function DashboardPage() {
  const { section, page: canvasPage } = useParams<{ section?: string; page?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const isCanvasMode = location.pathname.startsWith('/dashboard/canvas')
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
  const [validationIssues, setValidationIssues] = useState<DashboardValidationIssue[]>([])
  const sectionIdsWithIssues = useMemo(
    () =>
      new Set(
        validationIssues
          .map((issue) => issue.sectionId)
          .filter((sectionId): sectionId is DashboardSectionId => sectionId !== null),
      ),
    [validationIssues],
  )
  const completeness = useMemo(
    () => (draft ? getEPKCompleteness(draft) : null),
    [draft],
  )
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [dashboardTheme, setDashboardTheme] = useState<DashboardTheme>(() =>
    window.localStorage.getItem(dashboardThemeStorageKey) === 'dark'
      ? 'dark'
      : 'light',
  )
  const dashboardThemeClass = `dashboard-theme-${dashboardTheme}`
  const prefersReducedMotion = useReducedMotion()
  const dashboardArtistName =
    draft?.artistName || epkQuery.data?.artistName || 'Artist'
  const hasStarterDraft = epkQuery.isError && isMissingEPKError(epkQuery.error)

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

  useEffect(() => {
    const title = `${dashboardArtistName} | Dashboard`
    const faviconPath = epkQuery.data
      ? getEPKFaviconPath(epkQuery.data)
      : undefined

    applyDocumentMeta({ faviconPath, title })
    cacheDocumentMeta({ faviconPath, title })
  }, [dashboardArtistName, epkQuery.data])

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileNavOpen])

  const saveMutation = useMutation({
    mutationFn: async (epk: EPK) => {
      const response = await saveEPK(epk, storedKey)
      return { response, submittedEPK: epk }
    },
    onSuccess: async ({ response, submittedEPK }) => {
      if (!draft) return
      const savedEPK = response.epk
        ? {
            ...response.epk,
            tour: {
              ...response.epk.tour,
              dateDisplayFormat:
                response.epk.tour.dateDisplayFormat ??
                submittedEPK.tour.dateDisplayFormat,
            },
          }
        : submittedEPK

      markSaved(savedEPK)
      setCachedEPK(queryClient, savedEPK)
      await invalidateEPK(queryClient)
      await queryClient.refetchQueries({ queryKey: epkQueryKey, type: 'active' })
      broadcastEPKUpdate()
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
    if (!hasStarterDraft || draft || isDirty) return

    replaceDraft(createStarterEPK())
  }, [draft, hasStarterDraft, isDirty, replaceDraft])

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

  const guardUnsavedChanges = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (
      isDirty &&
      !window.confirm('You have unsaved dashboard changes. Leave this page anyway?')
    ) {
      event.preventDefault()
    }
  }

  const modeToggle = (
    <div className="dashboard-mode-toggle" role="tablist" aria-label="Dashboard mode">
      <Link
        aria-selected={!isCanvasMode}
        className={`dashboard-mode-toggle__tab${!isCanvasMode ? ' dashboard-mode-toggle__tab--active' : ''}`}
        onClick={guardUnsavedChanges}
        role="tab"
        to={section ? `/dashboard/${section}` : '/dashboard'}
      >
        Guided Studio
      </Link>
      <Link
        aria-selected={isCanvasMode}
        className={`dashboard-mode-toggle__tab${isCanvasMode ? ' dashboard-mode-toggle__tab--active' : ''}`}
        onClick={guardUnsavedChanges}
        role="tab"
        to="/dashboard/canvas"
      >
        Live Canvas
      </Link>
    </div>
  )

  const handleDashboardNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    shouldCloseMobileNav = false,
  ) => {
    guardUnsavedChanges(event)

    if (!event.defaultPrevented && shouldCloseMobileNav) {
      setIsMobileNavOpen(false)
    }
  }

  const closeMobileNavAfterDrag = (
    _: globalThis.MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 96 || info.velocity.y > 700) {
      setIsMobileNavOpen(false)
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

    const normalizedDraft = normalizeEPKForSave(draft)
    const validation = validateEPK(normalizedDraft)
    if (!validation.success) {
      setSaveMessage('')
      setValidationIssues(
        validation.issues.map((issue) => ({
          message: issue.message,
          path: issue.path || 'root',
          sectionId: issue.path ? getIssueSectionId(issue.path) : null,
        })),
      )
      return
    }

    setValidationIssues([])
    setSaveMessage('')
    saveMutation.mutate(normalizedDraft)
  }

  const alwaysReadySections = new Set<DashboardSectionId>(['nav', 'layout', 'json', 'assets'])

  const statusDotClass = (sectionId: DashboardSectionId) => {
    if (sectionIdsWithIssues.has(sectionId)) return 'dashboard-nav__status-dot--issue'

    const status = completeness?.statuses[sectionId as CompletenessSectionId]
    if (status === 'ready') return 'dashboard-nav__status-dot--ready'
    if (status === 'attention') return 'dashboard-nav__status-dot--attention'
    if (status === 'empty') return 'dashboard-nav__status-dot--empty'
    if (alwaysReadySections.has(sectionId)) return 'dashboard-nav__status-dot--ready'
    return null
  }

  const renderNavLink = (item: DashboardSection, shouldCloseMobileNav: boolean) => (
    <NavLink
      className={({ isActive }) =>
        [
          'dashboard-nav__link',
          isActive || (!section && item.id === activeSection.id)
            ? 'dashboard-nav__link--active'
            : '',
          sectionIdsWithIssues.has(item.id) ? 'dashboard-nav__link--issue' : '',
        ].filter(Boolean).join(' ')
      }
      key={item.id}
      onClick={(event) => handleDashboardNavClick(event, shouldCloseMobileNav)}
      to={`/dashboard/${item.id}`}
    >
      <span className="dashboard-nav__link-icon" aria-hidden="true">
        <item.icon />
      </span>
      <span className="dashboard-nav__link-label">{item.label}</span>
      {statusDotClass(item.id) && (
        <span
          className={`dashboard-nav__status-dot ${statusDotClass(item.id)}`}
          aria-hidden="true"
        />
      )}
    </NavLink>
  )

  const renderDashboardNav = (shouldCloseMobileNav = false) => (
    <nav className="dashboard-nav" aria-label="Dashboard sections">
      <NavLink
        className={({ isActive }) =>
          [
            'dashboard-nav__link',
            'dashboard-nav__link--overview',
            isActive || (!section && activeSection.id === 'overview')
              ? 'dashboard-nav__link--active'
              : '',
          ].filter(Boolean).join(' ')
        }
        onClick={(event) => handleDashboardNavClick(event, shouldCloseMobileNav)}
        to="/dashboard"
      >
        <span className="dashboard-nav__link-icon" aria-hidden="true">
          <overviewSection.icon />
        </span>
        <span>{overviewSection.label}</span>
      </NavLink>
      {dashboardNavGroups.map((group) => (
        <section className="dashboard-nav__group" key={group.id}>
          <p className="dashboard-nav__group-label">{group.label}</p>
          {group.sections.map((item) => renderNavLink(item, shouldCloseMobileNav))}
        </section>
      ))}
      <div className="dashboard-nav__utility">
        {renderNavLink(helpSection, shouldCloseMobileNav)}
      </div>
    </nav>
  )

  const renderEditor = (sectionId: DashboardSectionId) => {
    if (!draft || !completeness) return null

    const editorProps = { draft, updateField: updateDraftField }

    switch (sectionId) {
      case 'overview':
        return <OverviewScreen artistName={dashboardArtistName} completeness={completeness} />
      case 'branding':
        return <BrandingEditor {...editorProps} />
      case 'fonts':
        return <FontsEditor {...editorProps} />
      case 'metadata':
        return <MetadataEditor {...editorProps} />
      case 'nav':
        return <NavEditor {...editorProps} />
      case 'layout':
        return <LayoutEditor {...editorProps} />
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
      case 'help':
        return <HelpGuide {...editorProps} />
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
      <header className="dashboard-topbar">
        <div className="dashboard-topbar__brand">
          <div className="dashboard-topbar__mark" aria-hidden="true">DA</div>
          <div className="dashboard-topbar__title">
            <span className="dashboard-topbar__product">EPK Studio</span>
            <span className="dashboard-topbar__artist">{dashboardArtistName}</span>
          </div>
        </div>
        <div className="dashboard-topbar__center">{modeToggle}</div>
        <div className="dashboard-topbar__actions">
          {themeToggle}
          <Link
            className="dashboard-topbar__button"
            onClick={guardUnsavedChanges}
            rel="noreferrer"
            target="_blank"
            to="/"
          >
            View site
          </Link>
          <button
            className="dashboard-topbar__button dashboard-topbar__button--primary"
            disabled={!draft || !isDirty || saveMutation.isPending}
            type="button"
            onClick={saveDraft}
          >
            {saveMutation.isPending ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </header>
      {isCanvasMode ? (
        <div className="dashboard-canvas-body">
          {draft ? (
            <LiveCanvas
              draft={draft}
              page={canvasPage ?? 'home'}
              updateField={updateDraftField}
              onPageChange={(nextPage) =>
                navigate(nextPage === 'home' ? '/dashboard/canvas' : `/dashboard/canvas/${nextPage}`)
              }
            />
          ) : (
            <div className="dashboard-canvas-placeholder">
              <p className="dashboard-canvas-placeholder__eyebrow">Live Canvas</p>
              <h2>Loading&hellip;</h2>
            </div>
          )}
        </div>
      ) : (
      <div className="dashboard-body">
      <div className="dashboard-mobile-bar">
        <div>
          <p className="dashboard-sidebar__eyebrow">{dashboardArtistName}</p>
          <h1>Dashboard</h1>
        </div>
        <button
          className="dashboard-mobile-nav-button"
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
        >
          <FiMenu aria-hidden="true" />
          <span>Menu</span>
        </button>
      </div>
      <aside className="dashboard-sidebar dashboard-sidebar--desktop" aria-label="Dashboard sections">
        <div>
          <p className="dashboard-sidebar__eyebrow">{dashboardArtistName}</p>
          <h1>Dashboard</h1>
        </div>
        {renderDashboardNav(false)}
        <button className="dashboard-sidebar__clear" type="button" onClick={clearKey}>
          Sign out
        </button>
      </aside>
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="dashboard-mobile-nav"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
          >
            <button
              aria-label="Close dashboard menu"
              className="dashboard-mobile-nav__backdrop"
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.aside
              aria-label="Dashboard sections"
              aria-modal="true"
              className="dashboard-mobile-nav__sheet"
              animate={{ y: 0 }}
              drag={prefersReducedMotion ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.24 }}
              exit={{ y: '100%' }}
              initial={{ y: '100%' }}
              onDragEnd={closeMobileNavAfterDrag}
              role="dialog"
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.34, ease: navEase }
              }
            >
              <div className="dashboard-mobile-nav__handle" aria-hidden="true" />
              <div className="dashboard-mobile-nav__header">
                <div>
                  <p className="dashboard-sidebar__eyebrow">{dashboardArtistName}</p>
                  <h2>Dashboard</h2>
                </div>
                <button
                  aria-label="Close dashboard menu"
                  className="dashboard-mobile-nav__close"
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>
              {renderDashboardNav(true)}
              <button className="dashboard-sidebar__clear" type="button" onClick={clearKey}>
                Sign out
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
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
            <div className="dashboard-workspace__actions">
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
            </div>
          </div>
        </div>
        <div className="dashboard-workspace__panel">
          {epkQuery.isLoading && <p>Loading EPK content...</p>}
          {hasStarterDraft && draft && (
            <p className="dashboard-message">
              No EPK JSON is saved yet. This starter draft is ready to edit and
              will become the live EPK after you save it.
            </p>
          )}
          {epkQuery.isError && !hasStarterDraft && (
            <div className="dashboard-empty">
              <h3>EPK content could not load</h3>
              <p>
                Fix the API response or import a validated EPK JSON file, then
                refresh this dashboard.
              </p>
              <code>bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm</code>
            </div>
          )}
          {draft && showRequiredLegendFor(activeSection.id) && <RequiredLegend />}
          {draft && renderEditor(activeSection.id)}
          {validationIssues.length > 0 && (
            <div className="dashboard-message dashboard-message--error">
              <strong>Fix these validation issues before saving:</strong>
              <ul>
                {validationIssues.map((issue) => (
                  <li key={issue.path}>
                    {issue.sectionId ? (
                      <Link to={`/dashboard/${issue.sectionId}`}>
                        {issue.path}: {issue.message}
                      </Link>
                    ) : (
                      <span>
                        {issue.path}: {issue.message}
                      </span>
                    )}
                  </li>
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
      </div>
      )}
    </main>
  )
}

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, NavLink, useParams } from 'react-router-dom'
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
import './DashboardPage.css'

const adminKeyStorageKey = 'epk-admin-key'

const dashboardSections = [
  { id: 'nav', label: 'Navigation' },
  { id: 'branding', label: 'Branding' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'home', label: 'Home' },
  { id: 'music', label: 'Music' },
  { id: 'videos', label: 'Videos' },
  { id: 'tour', label: 'Tour' },
  { id: 'vip', label: 'VIP' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'contact', label: 'Contact' },
  { id: 'json', label: 'JSON' },
  { id: 'assets', label: 'Assets' },
  { id: 'footer', label: 'Footer' },
]

type DashboardSectionId = (typeof dashboardSections)[number]['id']

export function DashboardPage() {
  const { section } = useParams()
  const queryClient = useQueryClient()
  const epkQuery = useEPK({ retry: false })
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

  const activeSection = useMemo(
    () =>
      dashboardSections.find((item) => item.id === section) ??
      dashboardSections[0],
    [section],
  )

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
    if (epkQuery.data && !draft && !isDirty) {
      loadDraft(epkQuery.data)
    }
  }, [draft, epkQuery.data, isDirty, loadDraft])

  useEffect(() => {
    if (!isDirty) return

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeUnload)

    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    setValidationIssues((issues) => (issues.length > 0 ? [] : issues))
  }, [draft])

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

    const editorProps = { draft, updateField }

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
            replaceDraft={replaceDraft}
            updateField={updateField}
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
              onClick={guardUnsavedChanges}
              to={`/dashboard/${item.id}`}
            >
              {item.label}
            </NavLink>
          ))}
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
              disabled={!isDirty || saveMutation.isPending}
              type="button"
              onClick={resetDraft}
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

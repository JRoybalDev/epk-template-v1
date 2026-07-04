import { useEffect, useRef, useState } from 'react'
import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { AddSectionPicker } from './AddSectionPicker'
import { LiveCanvasInspector } from './LiveCanvasInspector'
import { LiveCanvasOutline, getOutlineBlocks } from './LiveCanvasOutline'
import './LiveCanvas.css'

const routeForPage: Record<string, string> = {
  home: '/',
  music: '/music',
  videos: '/videos',
  tour: '/tour',
  vip: '/vip',
  shop: '/shop',
  about: '/about',
  newsletter: '/newsletter',
}

const pageLabel: Record<string, string> = {
  home: 'Home',
  music: 'Music',
  videos: 'Videos',
  tour: 'Tour',
  vip: 'VIP',
  shop: 'Shop',
  about: 'About',
  newsletter: 'Newsletter',
}

const selectionOutlineColor = '#b07d4e'

type LiveCanvasProps = {
  draft: EPK
  updateField: DashboardEditorProps['updateField']
  page: string
  onPageChange: (page: string) => void
}

export function LiveCanvas({ draft, updateField, page, onPageChange }: LiveCanvasProps) {
  const pages = [
    'home',
    ...draft.nav.filter((id) => id !== 'home' && id !== 'contact' && routeForPage[id]),
  ]
  const activePage = pages.includes(page) ? page : 'home'

  const [selectedBlock, setSelectedBlock] = useState<string | null>(
    () => getOutlineBlocks(draft, activePage)[0]?.id ?? null,
  )
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop')
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const selectedBlockRef = useRef(selectedBlock)
  selectedBlockRef.current = selectedBlock

  useEffect(() => {
    setSelectedBlock(getOutlineBlocks(draft, activePage)[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage])

  // The iframe hosts a separate React app: when its own content re-renders (e.g. after
  // adding/reordering a section triggers the live-preview storage sync), it can replace
  // DOM nodes we've wired up. Re-wire on every mutation, not just once on iframe load.
  const wireUpIframeBlocks = () => {
    const iframeDoc = iframeRef.current?.contentDocument
    if (!iframeDoc) return

    iframeDoc.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => {
      el.style.cursor = 'pointer'
      el.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        const sectionId = el.getAttribute('data-section')
        if (sectionId) setSelectedBlock(sectionId)
      }

      const isSelected = el.getAttribute('data-section') === selectedBlockRef.current
      el.style.outline = isSelected ? `2px solid ${selectionOutlineColor}` : ''
      el.style.outlineOffset = isSelected ? '-2px' : ''
    })
  }

  useEffect(() => {
    wireUpIframeBlocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlock])

  const handleIframeLoad = () => {
    wireUpIframeBlocks()

    const iframeDoc = iframeRef.current?.contentDocument
    if (!iframeDoc?.body) return

    const observer = new MutationObserver(() => wireUpIframeBlocks())
    observer.observe(iframeDoc.body, { childList: true, subtree: true })
  }

  const homeSections = draft.home.sectionsOnHome ?? []

  return (
    <div className="live-canvas">
      <div className="live-canvas__toolbar">
        <div className="live-canvas__page-tabs">
          {pages.map((id) => (
            <button
              className={`live-canvas__page-tab${id === activePage ? ' live-canvas__page-tab--active' : ''}`}
              key={id}
              onClick={() => onPageChange(id)}
              type="button"
            >
              {pageLabel[id] ?? id}
            </button>
          ))}
        </div>
        <div className="live-canvas__spacer" />
        <div className="live-canvas__device-toggle">
          <button
            className={`live-canvas__device-tab${device === 'desktop' ? ' live-canvas__device-tab--active' : ''}`}
            onClick={() => setDevice('desktop')}
            type="button"
          >
            Desktop
          </button>
          <button
            className={`live-canvas__device-tab${device === 'phone' ? ' live-canvas__device-tab--active' : ''}`}
            onClick={() => setDevice('phone')}
            type="button"
          >
            Phone
          </button>
        </div>
      </div>
      <div className="live-canvas__body">
        <LiveCanvasOutline
          draft={draft}
          updateField={updateField}
          page={activePage}
          selectedBlock={selectedBlock}
          onSelectBlock={setSelectedBlock}
          onOpenAddPicker={() => setIsAddPickerOpen(true)}
        />
        <div className="live-canvas__frame-area">
          <p className="live-canvas__banner">
            This is a structure preview, not the final look. Your built frontend supplies
            the visual design &mdash; editing here changes the content each block renders.
          </p>
          <div className={`live-canvas__frame live-canvas__frame--${device}`}>
            <div className="live-canvas__frame-bar">
              <span />
              <span />
              <span />
              <span className="live-canvas__frame-bar-label">
                {draft.artistName} &mdash; {pageLabel[activePage] ?? activePage}
              </span>
            </div>
            <iframe
              key={activePage}
              ref={iframeRef}
              src={`${routeForPage[activePage] ?? '/'}?livePreview=1`}
              title="Live preview"
              onLoad={handleIframeLoad}
            />
          </div>
        </div>
        <LiveCanvasInspector
          draft={draft}
          updateField={updateField}
          page={activePage}
          selectedBlock={selectedBlock}
        />
      </div>
      {isAddPickerOpen && (
        <AddSectionPicker
          existingSections={homeSections}
          onClose={() => setIsAddPickerOpen(false)}
          onSelect={(section) => {
            updateField('home', {
              ...draft.home,
              sectionsOnHome: [...homeSections, section],
              showTourDatesOnHome:
                section === 'tour' ? true : draft.home.showTourDatesOnHome,
            })
            setIsAddPickerOpen(false)
            setSelectedBlock(section)
          }}
        />
      )}
    </div>
  )
}

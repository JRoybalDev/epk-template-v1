import { Link } from 'react-router-dom'
import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './LiveCanvas.css'

type LiveCanvasInspectorProps = {
  draft: EPK
  updateField: DashboardEditorProps['updateField']
  page: string
  selectedBlock: string | null
}

const guidedSectionForBlock = (page: string, blockId: string | null): string => {
  if (blockId === 'hero' || blockId === 'announce') return 'home'
  if (blockId === 'footer') return 'footer'
  if (!blockId || blockId === page) return page === 'home' ? 'home' : page

  return blockId
}

export function LiveCanvasInspector({
  draft,
  updateField,
  page,
  selectedBlock,
}: LiveCanvasInspectorProps) {
  if (selectedBlock === 'hero') {
    const release = draft.home.featuredRelease
    const updateRelease = (value: typeof release) =>
      updateField('home', { ...draft.home, featuredRelease: value })

    return (
      <aside className="live-canvas-inspector" aria-label="Editing block">
        <div className="live-canvas-inspector__header">
          <span className="live-canvas-inspector__dot" aria-hidden="true" />
          <span className="live-canvas-inspector__eyebrow">Editing block</span>
        </div>
        <h3>Hero / Spotlight</h3>
        <div className="live-canvas-inspector__form">
          <label className="live-canvas-inspector__field">
            <span>Title</span>
            <input
              value={release.title}
              onChange={(event) => updateRelease({ ...release, title: event.target.value })}
            />
          </label>
          <label className="live-canvas-inspector__field">
            <span>Subtitle</span>
            <input
              value={release.subtitle}
              onChange={(event) => updateRelease({ ...release, subtitle: event.target.value })}
            />
          </label>
          <label className="live-canvas-inspector__field">
            <span>Cover image path</span>
            <input
              value={release.coverImage}
              onChange={(event) => updateRelease({ ...release, coverImage: event.target.value })}
            />
          </label>
          <label className="live-canvas-inspector__field">
            <span>Smart link URL</span>
            <input
              value={release.smartLinkUrl ?? ''}
              placeholder="https://"
              onChange={(event) =>
                updateRelease({ ...release, smartLinkUrl: optionalString(event.target.value) })
              }
            />
          </label>
        </div>
        <p className="live-canvas-inspector__hint">
          Updates as you type. Colors and layout follow your built frontend.
        </p>
      </aside>
    )
  }

  if (selectedBlock === 'announce') {
    const announcement = draft.home.announcement ?? { text: '', linkUrl: undefined, linkLabel: undefined }
    const updateAnnouncement = (value: typeof announcement) => {
      const shouldKeep = value.text.trim().length > 0 || Boolean(value.linkUrl) || Boolean(value.linkLabel)
      updateField('home', { ...draft.home, announcement: shouldKeep ? value : undefined })
    }

    return (
      <aside className="live-canvas-inspector" aria-label="Editing block">
        <div className="live-canvas-inspector__header">
          <span className="live-canvas-inspector__dot" aria-hidden="true" />
          <span className="live-canvas-inspector__eyebrow">Editing block</span>
        </div>
        <h3>Announcement bar</h3>
        <div className="live-canvas-inspector__form">
          <label className="live-canvas-inspector__field">
            <span>Message</span>
            <input
              value={announcement.text}
              onChange={(event) => updateAnnouncement({ ...announcement, text: event.target.value })}
            />
          </label>
          <label className="live-canvas-inspector__field">
            <span>Button label</span>
            <input
              value={announcement.linkLabel ?? ''}
              onChange={(event) =>
                updateAnnouncement({ ...announcement, linkLabel: optionalString(event.target.value) })
              }
            />
          </label>
          <label className="live-canvas-inspector__field">
            <span>Button URL</span>
            <input
              value={announcement.linkUrl ?? ''}
              placeholder="https://"
              onChange={(event) =>
                updateAnnouncement({ ...announcement, linkUrl: optionalString(event.target.value) })
              }
            />
          </label>
        </div>
        <p className="live-canvas-inspector__hint">
          Leave the message blank to remove the announcement bar.
        </p>
      </aside>
    )
  }

  const guidedSection = guidedSectionForBlock(page, selectedBlock)

  return (
    <aside className="live-canvas-inspector" aria-label="Editing block">
      <div className="live-canvas-inspector__header">
        <span className="live-canvas-inspector__dot" aria-hidden="true" />
        <span className="live-canvas-inspector__eyebrow">Editing block</span>
      </div>
      <h3>{selectedBlock ?? 'Select a block'}</h3>
      <p className="live-canvas-inspector__hint">
        This block's fields aren&rsquo;t editable here yet &mdash; open it in Guided Studio
        for the full form.
      </p>
      <Link className="live-canvas-inspector__open-guided" to={`/dashboard/${guidedSection}`}>
        Open in Guided Studio
      </Link>
    </aside>
  )
}

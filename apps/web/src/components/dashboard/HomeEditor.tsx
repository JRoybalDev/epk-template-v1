import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

export function HomeEditor({ draft, updateField }: DashboardEditorProps) {
  const release = draft.home.featuredRelease

  return (
    <div className="editor-form">
      <p className="editor-note">
        Uploaded cover art paths usually look like <code>/uploads/site/assets/file.jpg</code>.
      </p>
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="release-title">Featured release title</label>
          <input
            id="release-title"
            value={release.title}
            onChange={(event) =>
              updateField('home', {
                ...draft.home,
                featuredRelease: { ...release, title: event.target.value },
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="release-subtitle">Featured release subtitle</label>
          <input
            id="release-subtitle"
            value={release.subtitle}
            onChange={(event) =>
              updateField('home', {
                ...draft.home,
                featuredRelease: { ...release, subtitle: event.target.value },
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="cover-image">Cover image path</label>
          <input
            id="cover-image"
            value={release.coverImage}
            onChange={(event) =>
              updateField('home', {
                ...draft.home,
                featuredRelease: { ...release, coverImage: event.target.value },
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="smart-link">Smart link URL</label>
          <input
            id="smart-link"
            value={release.smartLinkUrl ?? ''}
            onChange={(event) =>
              updateField('home', {
                ...draft.home,
                featuredRelease: { ...release, smartLinkUrl: event.target.value },
              })
            }
          />
        </div>
      </div>
      <label className="editor-check">
        <input
          checked={draft.home.showTourDatesOnHome}
          type="checkbox"
          onChange={(event) =>
            updateField('home', {
              ...draft.home,
              showTourDatesOnHome: event.target.checked,
            })
          }
        />
        <span>Show tour dates on home</span>
      </label>
    </div>
  )
}

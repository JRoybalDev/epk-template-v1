import type { DashboardEditorProps } from './types'
import { parseCommaList } from './types'
import './DashboardEditors.css'

export function AboutEditor({ draft, updateField }: DashboardEditorProps) {
  return (
    <div className="editor-form">
      <div className="editor-field">
        <label htmlFor="short-bio">Short bio</label>
        <textarea
          id="short-bio"
          value={draft.about.shortBio}
          onChange={(event) =>
            updateField('about', { ...draft.about, shortBio: event.target.value })
          }
        />
      </div>
      <div className="editor-field">
        <label htmlFor="long-bio">Long bio</label>
        <textarea
          id="long-bio"
          value={draft.about.longBio}
          onChange={(event) =>
            updateField('about', { ...draft.about, longBio: event.target.value })
          }
        />
      </div>
      <div className="editor-field">
        <label htmlFor="genres">Genres, comma separated</label>
        <input
          id="genres"
          value={draft.about.genres.join(', ')}
          onChange={(event) =>
            updateField('about', {
              ...draft.about,
              genres: parseCommaList(event.target.value),
            })
          }
        />
      </div>
    </div>
  )
}

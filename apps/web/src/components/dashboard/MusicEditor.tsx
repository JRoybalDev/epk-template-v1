import type { Release } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
import './DashboardEditors.css'

const releaseTypes: Release['type'][] = [
  'album',
  'single',
  'ep',
  'mix',
  'compilation',
  'deluxe',
  'collab',
]

const createRelease = (index: number): Release => ({
  id: createEditorId('release'),
  title: 'New release',
  type: 'single',
  releaseDate: new Date().toISOString().slice(0, 10),
  heroImage: '/uploads/site/assets/release-image.jpg',
  isFeatured: false,
  displayOrder: index + 1,
})

export function MusicEditor({ draft, updateField }: DashboardEditorProps) {
  const releases = draft.music.releases

  const updateRelease = (id: string, value: Release) => {
    updateField('music', {
      ...draft.music,
      releases: releases.map((release) => (release.id === id ? value : release)),
    })
  }

  const removeRelease = (id: string) => {
    updateField('music', {
      ...draft.music,
      releases: releases.filter((release) => release.id !== id),
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Add the releases shown on the public music page. Image paths usually look
        like <code>/uploads/site/assets/file.jpg</code>.
      </p>
      <div className="editor-field">
        <label htmlFor="music-columns">Grid columns</label>
        <select
          id="music-columns"
          value={draft.music.gridColumns}
          onChange={(event) =>
            updateField('music', {
              ...draft.music,
              gridColumns: event.target.value as '1' | '2' | '3' | '4',
            })
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div className="editor-list">
        {releases.map((release, index) => (
          <article className="editor-item" key={release.id}>
            <div className="editor-item__header">
              <h3>{release.title || `Release ${index + 1}`}</h3>
              <button className="editor-button" type="button" onClick={() => removeRelease(release.id)}>
                Remove
              </button>
            </div>
            <div className="editor-grid">
              <div className="editor-field">
                <label htmlFor={`${release.id}-title`}>Title</label>
                <input
                  id={`${release.id}-title`}
                  value={release.title}
                  onChange={(event) =>
                    updateRelease(release.id, { ...release, title: event.target.value })
                  }
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${release.id}-type`}>Type</label>
                <select
                  id={`${release.id}-type`}
                  value={release.type}
                  onChange={(event) =>
                    updateRelease(release.id, {
                      ...release,
                      type: event.target.value as Release['type'],
                    })
                  }
                >
                  {releaseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="editor-field">
                <label htmlFor={`${release.id}-date`}>Release date</label>
                <input
                  id={`${release.id}-date`}
                  type="date"
                  value={release.releaseDate}
                  onChange={(event) =>
                    updateRelease(release.id, {
                      ...release,
                      releaseDate: event.target.value,
                    })
                  }
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${release.id}-order`}>Display order</label>
                <input
                  id={`${release.id}-order`}
                  type="number"
                  value={release.displayOrder ?? index + 1}
                  onChange={(event) =>
                    updateRelease(release.id, {
                      ...release,
                      displayOrder: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div className="editor-field editor-field--wide">
                <label htmlFor={`${release.id}-image`}>Hero image path</label>
                <input
                  id={`${release.id}-image`}
                  value={release.heroImage}
                  onChange={(event) =>
                    updateRelease(release.id, {
                      ...release,
                      heroImage: event.target.value,
                    })
                  }
                />
              </div>
              <div className="editor-field editor-field--wide">
                <label htmlFor={`${release.id}-smart-link`}>Smart link URL</label>
                <input
                  id={`${release.id}-smart-link`}
                  value={release.smartLinkUrl ?? ''}
                  onChange={(event) =>
                    updateRelease(release.id, {
                      ...release,
                      smartLinkUrl: optionalString(event.target.value),
                    })
                  }
                />
              </div>
            </div>
            <label className="editor-check">
              <input
                checked={release.isFeatured}
                type="checkbox"
                onChange={(event) =>
                  updateRelease(release.id, {
                    ...release,
                    isFeatured: event.target.checked,
                  })
                }
              />
              <span>Featured release</span>
            </label>
          </article>
        ))}
      </div>
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          type="button"
          onClick={() =>
            updateField('music', {
              ...draft.music,
              releases: [...releases, createRelease(releases.length)],
            })
          }
        >
          Add release
        </button>
      </div>
    </div>
  )
}

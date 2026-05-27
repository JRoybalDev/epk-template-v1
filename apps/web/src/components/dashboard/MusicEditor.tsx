import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type { Release } from '../../../../../packages/schema'
import { DashboardDateInput } from './DashboardDateInput'
import { RequiredLabel } from './RequiredLabel'
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

const streamingPlatforms = [
  'spotify',
  'appleMusic',
  'tidal',
  'deezer',
  'amazonMusic',
  'youtube',
  'soundcloud',
  'bandcamp',
] as const

const createRelease = (index: number): Release => ({
  id: createEditorId('release'),
  title: 'New release',
  type: 'single',
  heroImage: '/uploads/site/assets/release-image.jpg',
  isFeatured: false,
  displayOrder: index + 1,
})

export function MusicEditor({ draft, updateField }: DashboardEditorProps) {
  const [openReleaseId, setOpenReleaseId] = useState<string | null>(null)
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
    setOpenReleaseId((current) => (current === id ? null : current))
  }

  const toggleRelease = (id: string) => {
    setOpenReleaseId((current) => (current === id ? null : id))
  }

  const addRelease = () => {
    const nextRelease = createRelease(releases.length)

    updateField('music', {
      ...draft.music,
      releases: [...releases, nextRelease],
    })
    setOpenReleaseId(nextRelease.id)
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
        {releases.map((release, index) => {
          const isOpen = openReleaseId === release.id
          const releaseTitle = release.title || `Release ${index + 1}`
          const releaseMeta = [release.type, release.releaseDate].filter(Boolean).join(' · ')

          return (
            <article
              className={[
                'editor-item',
                'editor-collapse',
                isOpen ? 'editor-collapse--open' : '',
              ].filter(Boolean).join(' ')}
              key={release.id}
            >
              <button
                aria-controls={`${release.id}-release-settings`}
                aria-expanded={isOpen}
                className="editor-collapse__trigger"
                type="button"
                onClick={() => toggleRelease(release.id)}
              >
                <span>
                  {releaseTitle}
                  <small>{releaseMeta}</small>
                </span>
                <FiChevronDown aria-hidden="true" />
              </button>
              {isOpen && (
                <div
                  className="editor-collapse__content"
                  id={`${release.id}-release-settings`}
                >
                  <div className="editor-item__header">
                    <h3>{releaseTitle}</h3>
                    <button
                      className="editor-button"
                      type="button"
                      onClick={() => removeRelease(release.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${release.id}-id`}>ID</RequiredLabel>
                      <input
                        id={`${release.id}-id`}
                        value={release.id}
                        onChange={(event) =>
                          updateRelease(release.id, { ...release, id: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${release.id}-title`}>Title</RequiredLabel>
                      <input
                        id={`${release.id}-title`}
                        value={release.title}
                        onChange={(event) =>
                          updateRelease(release.id, {
                            ...release,
                            title: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${release.id}-type`}>Type</RequiredLabel>
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
                      <DashboardDateInput
                        id={`${release.id}-date`}
                        value={release.releaseDate ?? ''}
                        onChange={(value) =>
                          updateRelease(release.id, {
                            ...release,
                            releaseDate: optionalString(value),
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
                      <RequiredLabel htmlFor={`${release.id}-image`}>Hero image path</RequiredLabel>
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
                    {streamingPlatforms.map((platform) => (
                      <div className="editor-field" key={platform}>
                        <label htmlFor={`${release.id}-${platform}`}>{platform} URL</label>
                        <input
                          id={`${release.id}-${platform}`}
                          value={release.streamingLinks?.[platform] ?? ''}
                          onChange={(event) => {
                            const nextLinks = {
                              ...(release.streamingLinks ?? {}),
                              [platform]: optionalString(event.target.value),
                            }

                            Object.keys(nextLinks).forEach((key) => {
                              if (!nextLinks[key as keyof typeof nextLinks]) {
                                delete nextLinks[key as keyof typeof nextLinks]
                              }
                            })

                            updateRelease(release.id, {
                              ...release,
                              streamingLinks:
                                Object.keys(nextLinks).length > 0 ? nextLinks : undefined,
                            })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="editor-check-list">
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
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          type="button"
          onClick={addRelease}
        >
          Add release
        </button>
      </div>
    </div>
  )
}

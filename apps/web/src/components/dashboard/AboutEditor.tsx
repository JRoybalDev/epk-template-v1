import { useEffect, useState } from 'react'
import type { EPK } from '../../../../../packages/schema'
import { DashboardDateInput } from './DashboardDateInput'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString, parseCommaList } from './types'
import './DashboardEditors.css'

type Award = EPK['about']['awards'][number]
type PressQuote = EPK['about']['pressQuotes'][number]
type PressPhoto = EPK['about']['pressPhotos'][number]

const createAward = (): Award => ({
  name: 'New award',
  year: new Date().getFullYear(),
  won: false,
})

const createPressQuote = (): PressQuote => ({
  id: createEditorId('quote'),
  quote: 'New press quote',
  publication: 'Publication',
})

const createPressPhoto = (): PressPhoto => ({
  id: createEditorId('photo'),
  path: '/uploads/site/photos/press-photo.jpg',
  orientation: 'landscape',
})

export function AboutEditor({ draft, updateField }: DashboardEditorProps) {
  const about = draft.about
  const [genresText, setGenresText] = useState(() => about.genres.join(', '))
  const [similarArtistsText, setSimilarArtistsText] = useState(() =>
    about.similarArtists?.join(', ') ?? '',
  )

  useEffect(() => {
    setGenresText(about.genres.join(', '))
  }, [about.genres])

  useEffect(() => {
    setSimilarArtistsText(about.similarArtists?.join(', ') ?? '')
  }, [about.similarArtists])

  const updateAward = (index: number, value: Award) => {
    updateField('about', {
      ...about,
      awards: about.awards.map((award, awardIndex) =>
        awardIndex === index ? value : award,
      ),
    })
  }

  const updatePressQuote = (id: string, value: PressQuote) => {
    updateField('about', {
      ...about,
      pressQuotes: about.pressQuotes.map((quote) =>
        quote.id === id ? value : quote,
      ),
    })
  }

  const updatePressPhoto = (id: string, value: PressPhoto) => {
    updateField('about', {
      ...about,
      pressPhotos: about.pressPhotos.map((photo) =>
        photo.id === id ? value : photo,
      ),
    })
  }

  return (
    <div className="editor-form">
      <div className="editor-field">
        <RequiredLabel htmlFor="short-bio">Short bio</RequiredLabel>
        <textarea
          id="short-bio"
          value={about.shortBio}
          onChange={(event) =>
            updateField('about', { ...about, shortBio: event.target.value })
          }
        />
      </div>
      <div className="editor-field">
        <RequiredLabel htmlFor="long-bio">Long bio</RequiredLabel>
        <textarea
          id="long-bio"
          value={about.longBio}
          onChange={(event) =>
            updateField('about', { ...about, longBio: event.target.value })
          }
        />
      </div>
      <div className="editor-grid">
        <div className="editor-field">
          <RequiredLabel htmlFor="genres">Genres, comma separated</RequiredLabel>
          <input
            id="genres"
            value={genresText}
            onBlur={() =>
              updateField('about', {
                ...about,
                genres: parseCommaList(genresText),
              })
            }
            onChange={(event) => setGenresText(event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="similar-artists">Similar artists, comma separated</label>
          <input
            id="similar-artists"
            value={similarArtistsText}
            onBlur={() => {
              const similarArtists = parseCommaList(similarArtistsText)
              updateField('about', {
                ...about,
                similarArtists:
                  similarArtists.length > 0 ? similarArtists : undefined,
              })
            }}
            onChange={(event) => setSimilarArtistsText(event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="downloadable-assets">Downloadable assets URL</label>
          <input
            id="downloadable-assets"
            value={about.downloadableAssetsUrl ?? ''}
            onChange={(event) =>
              updateField('about', {
                ...about,
                downloadableAssetsUrl: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="tech-rider">Tech rider URL</label>
          <input
            id="tech-rider"
            value={about.techRiderUrl ?? ''}
            onChange={(event) =>
              updateField('about', {
                ...about,
                techRiderUrl: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="book-url">Book URL</label>
          <input
            id="book-url"
            value={about.bookUrl ?? ''}
            onChange={(event) =>
              updateField('about', {
                ...about,
                bookUrl: optionalString(event.target.value),
              })
            }
          />
        </div>
      </div>
      <div className="editor-field">
        <label htmlFor="accolades">Accolades, one per line</label>
        <textarea
          id="accolades"
          value={about.accolades?.join('\n') ?? ''}
          onChange={(event) => {
            const accolades = event.target.value
              .split(/\r?\n/)
              .map((item) => item.trim())
              .filter(Boolean)

            updateField('about', {
              ...about,
              accolades: accolades.length > 0 ? accolades : undefined,
            })
          }}
        />
      </div>

      <section className="editor-item" aria-labelledby="awards-title">
        <div className="editor-item__header">
          <h3 id="awards-title">Awards</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateField('about', {
                ...about,
                awards: [...about.awards, createAward()],
              })
            }
          >
            Add award
          </button>
        </div>
        <div className="editor-list">
          {about.awards.map((award, index) => (
            <article className="editor-item" key={`${award.name}-${index}`}>
              <div className="editor-item__header">
                <h4>{award.name || `Award ${index + 1}`}</h4>
                <button
                  className="editor-button"
                  type="button"
                  onClick={() =>
                    updateField('about', {
                      ...about,
                      awards: about.awards.filter((_, awardIndex) => awardIndex !== index),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="editor-grid">
                <div className="editor-field">
                  <RequiredLabel htmlFor={`award-${index}-name`}>Name</RequiredLabel>
                  <input
                    id={`award-${index}-name`}
                    value={award.name}
                    onChange={(event) =>
                      updateAward(index, { ...award, name: event.target.value })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`award-${index}-category`}>Category</label>
                  <input
                    id={`award-${index}-category`}
                    value={award.category ?? ''}
                    onChange={(event) =>
                      updateAward(index, {
                        ...award,
                        category: optionalString(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <RequiredLabel htmlFor={`award-${index}-year`}>Year</RequiredLabel>
                  <input
                    id={`award-${index}-year`}
                    type="number"
                    value={award.year}
                    onChange={(event) =>
                      updateAward(index, { ...award, year: Number(event.target.value) })
                    }
                  />
                </div>
                <label className="editor-check">
                  <input
                    checked={award.won}
                    type="checkbox"
                    onChange={(event) =>
                      updateAward(index, { ...award, won: event.target.checked })
                    }
                  />
                  <span>Won</span>
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editor-item" aria-labelledby="press-quotes-title">
        <div className="editor-item__header">
          <h3 id="press-quotes-title">Press quotes</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateField('about', {
                ...about,
                pressQuotes: [...about.pressQuotes, createPressQuote()],
              })
            }
          >
            Add quote
          </button>
        </div>
        <div className="editor-list">
          {about.pressQuotes.map((quote, index) => (
            <article className="editor-item" key={quote.id}>
              <div className="editor-item__header">
                <h4>{quote.publication || `Quote ${index + 1}`}</h4>
                <button
                  className="editor-button"
                  type="button"
                  onClick={() =>
                    updateField('about', {
                      ...about,
                      pressQuotes: about.pressQuotes.filter((item) => item.id !== quote.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="editor-grid">
                <div className="editor-field editor-field--wide">
                  <RequiredLabel htmlFor={`${quote.id}-id`}>ID</RequiredLabel>
                  <input
                    id={`${quote.id}-id`}
                    value={quote.id}
                    onChange={(event) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        id: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="editor-field editor-field--wide">
                  <RequiredLabel htmlFor={`${quote.id}-quote`}>Quote</RequiredLabel>
                  <textarea
                    id={`${quote.id}-quote`}
                    value={quote.quote}
                    onChange={(event) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        quote: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <RequiredLabel htmlFor={`${quote.id}-publication`}>Publication</RequiredLabel>
                  <input
                    id={`${quote.id}-publication`}
                    value={quote.publication}
                    onChange={(event) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        publication: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`${quote.id}-author`}>Author</label>
                  <input
                    id={`${quote.id}-author`}
                    value={quote.author ?? ''}
                    onChange={(event) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        author: optionalString(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`${quote.id}-url`}>URL</label>
                  <input
                    id={`${quote.id}-url`}
                    value={quote.url ?? ''}
                    onChange={(event) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        url: optionalString(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`${quote.id}-date`}>Date</label>
                  <DashboardDateInput
                    id={`${quote.id}-date`}
                    value={quote.date ?? ''}
                    onChange={(value) =>
                      updatePressQuote(quote.id, {
                        ...quote,
                        date: optionalString(value),
                      })
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editor-item" aria-labelledby="press-photos-title">
        <div className="editor-item__header">
          <h3 id="press-photos-title">Press photos</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateField('about', {
                ...about,
                pressPhotos: [...about.pressPhotos, createPressPhoto()],
              })
            }
          >
            Add photo
          </button>
        </div>
        <div className="editor-list">
          {about.pressPhotos.map((photo, index) => (
            <article className="editor-item" key={photo.id}>
              <div className="editor-item__header">
                <h4>{photo.path || `Photo ${index + 1}`}</h4>
                <button
                  className="editor-button"
                  type="button"
                  onClick={() =>
                    updateField('about', {
                      ...about,
                      pressPhotos: about.pressPhotos.filter((item) => item.id !== photo.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="editor-grid">
                <div className="editor-field editor-field--wide">
                  <RequiredLabel htmlFor={`${photo.id}-id`}>ID</RequiredLabel>
                  <input
                    id={`${photo.id}-id`}
                    value={photo.id}
                    onChange={(event) =>
                      updatePressPhoto(photo.id, {
                        ...photo,
                        id: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="editor-field editor-field--wide">
                  <RequiredLabel htmlFor={`${photo.id}-path`}>Image path</RequiredLabel>
                  <input
                    id={`${photo.id}-path`}
                    value={photo.path}
                    onChange={(event) =>
                      updatePressPhoto(photo.id, {
                        ...photo,
                        path: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="editor-field">
                  <RequiredLabel htmlFor={`${photo.id}-orientation`}>Orientation</RequiredLabel>
                  <select
                    id={`${photo.id}-orientation`}
                    value={photo.orientation}
                    onChange={(event) =>
                      updatePressPhoto(photo.id, {
                        ...photo,
                        orientation: event.target.value as PressPhoto['orientation'],
                      })
                    }
                  >
                    <option value="portrait">portrait</option>
                    <option value="landscape">landscape</option>
                    <option value="square">square</option>
                  </select>
                </div>
                <div className="editor-field">
                  <label htmlFor={`${photo.id}-credit`}>Credit line</label>
                  <input
                    id={`${photo.id}-credit`}
                    value={photo.creditLine ?? ''}
                    onChange={(event) =>
                      updatePressPhoto(photo.id, {
                        ...photo,
                        creditLine: optionalString(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

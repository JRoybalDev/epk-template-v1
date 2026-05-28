import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type {
  DateDisplayFormat,
  TourDate,
  TourListingMode,
} from '../../../../../packages/schema'
import { DashboardDateInput, getTodayDateKey } from './DashboardDateInput'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString, parseCommaList } from './types'
import { formatTourDate } from '../../utils/tourDateFormat'
import './DashboardEditors.css'

const createTourDate = (): TourDate => ({
  id: createEditorId('show'),
  date: new Date().toISOString().slice(0, 10),
  venue: 'New venue',
  city: 'City',
  country: 'USA',
  isSoldOut: false,
  isAnnounced: true,
})

const isPastDate = (date: string) => date < getTodayDateKey()
const formatTourLocation = (date: TourDate) =>
  [date.city, date.region, date.country].filter(Boolean).join(', ')

const dateDisplayFormatOptions: Array<{
  label: string
  value: DateDisplayFormat
}> = [
  { label: 'ISO date: 2026-06-05', value: 'iso' },
  { label: 'Short month, day, year: Jun 5, 2026', value: 'short_month_day_year' },
  { label: 'Short month and day: Jun 5', value: 'short_month_day' },
  { label: 'Full month, day, year: June 5, 2026', value: 'long_month_day_year' },
  { label: 'Full month and day: June 5', value: 'long_month_day' },
  { label: 'Numeric: 06/05/2026', value: 'numeric_month_day_year' },
  { label: 'Day, short month, year: 5 Jun 2026', value: 'day_short_month_year' },
]

export function TourEditor({ draft, updateField }: DashboardEditorProps) {
  const [openDateId, setOpenDateId] = useState<string | null>(null)
  const tour = draft.tour
  const dates = tour.dates
  const listingMode: TourListingMode =
    tour.listingMode ?? (tour.seatedEmbedCode || tour.seatedWidgetUrl ? 'seated' : 'manual')
  const notifyCta = tour.notifyCta ?? {
    text: '',
    buttonLabel: '',
    buttonUrl: '',
  }

  useEffect(() => {
    if (!dates.some((date) => date.isAnnounced && isPastDate(date.date))) return

    updateField('tour', {
      ...tour,
      dates: dates.map((date) =>
        date.isAnnounced && isPastDate(date.date)
          ? { ...date, isAnnounced: false }
          : date,
      ),
    })
  }, [dates, tour, updateField])

  const updateDate = (id: string, value: TourDate) => {
    updateField('tour', {
      ...tour,
      dates: dates.map((date) => (date.id === id ? value : date)),
    })
  }

  const toggleDate = (id: string) => {
    setOpenDateId((current) => (current === id ? null : id))
  }

  const addTourDate = () => {
    const nextDate = createTourDate()

    updateField('tour', { ...tour, dates: [...dates, nextDate] })
    setOpenDateId(nextDate.id)
  }

  const updateDateRegion = (date: TourDate, value: string) => {
    const nextDate = { ...date }
    const region = optionalString(value)

    if (region) {
      nextDate.region = region
    } else {
      delete nextDate.region
    }

    updateDate(date.id, nextDate)
  }

  const updateNotifyCta = (value: typeof notifyCta) => {
    const shouldKeep =
      value.text.trim().length > 0 ||
      value.buttonLabel.trim().length > 0 ||
      value.buttonUrl.trim().length > 0

    updateField('tour', {
      ...tour,
      notifyCta: shouldKeep ? value : undefined,
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Choose whether tour listings come from Seated or from manually entered rows.
      </p>
      <div className="editor-grid">
        <div className="editor-field editor-field--wide">
          <label>Tour listing source</label>
          <div
            className={`editor-segmented editor-segmented--${listingMode}`}
            role="radiogroup"
            aria-label="Tour listing source"
          >
            <span className="editor-segmented__thumb" aria-hidden="true" />
            <label className="editor-segmented__option">
              <input
                checked={listingMode === 'seated'}
                name="tour-listing-mode"
                type="radio"
                value="seated"
                onChange={() =>
                  updateField('tour', {
                    ...tour,
                    listingMode: 'seated',
                  })
                }
              />
              <span>Seated</span>
            </label>
            <label className="editor-segmented__option">
              <input
                checked={listingMode === 'manual'}
                name="tour-listing-mode"
                type="radio"
                value="manual"
                onChange={() =>
                  updateField('tour', {
                    ...tour,
                    listingMode: 'manual',
                  })
                }
              />
              <span>Manual</span>
            </label>
          </div>
        </div>
        <div className="editor-field">
          <label htmlFor="tour-name">Tour name</label>
          <input
            id="tour-name"
            value={tour.tourName ?? ''}
            onChange={(event) =>
              updateField('tour', { ...tour, tourName: optionalString(event.target.value) })
            }
          />
        </div>
        {listingMode === 'seated' && (
          <>
            <div className="editor-field editor-field--wide">
              <label htmlFor="seated-embed">Seated embed code</label>
              <textarea
                id="seated-embed"
                value={tour.seatedEmbedCode ?? ''}
                onChange={(event) =>
                  updateField('tour', {
                    ...tour,
                    seatedEmbedCode: optionalString(event.target.value),
                  })
                }
              />
            </div>
            <div className="editor-field editor-field--wide">
              <label htmlFor="seated-widget">Seated widget URL fallback</label>
              <input
                id="seated-widget"
                value={tour.seatedWidgetUrl ?? ''}
                onChange={(event) =>
                  updateField('tour', {
                    ...tour,
                    seatedWidgetUrl: optionalString(event.target.value),
                  })
                }
              />
            </div>
          </>
        )}
        {listingMode === 'manual' && (
          <div className="editor-field editor-field--wide">
            <label htmlFor="tour-date-format">Date display format</label>
            <select
              id="tour-date-format"
              value={tour.dateDisplayFormat ?? 'long_month_day_year'}
              onChange={(event) =>
                updateField('tour', {
                  ...tour,
                  dateDisplayFormat: event.target.value as DateDisplayFormat,
                })
              }
            >
              {dateDisplayFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {listingMode === 'manual' && (
        <>
      <section className="editor-item" aria-labelledby="tour-notify-title">
        <div className="editor-item__header">
          <h3 id="tour-notify-title">Notify CTA</h3>
          {tour.notifyCta && (
            <button
              className="editor-button"
              type="button"
              onClick={() => updateField('tour', { ...tour, notifyCta: undefined })}
            >
              Clear CTA
            </button>
          )}
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <RequiredLabel htmlFor="notify-text">Text</RequiredLabel>
            <input
              id="notify-text"
              value={notifyCta.text}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, text: event.target.value })
              }
            />
          </div>
          <div className="editor-field">
            <RequiredLabel htmlFor="notify-label">Button label</RequiredLabel>
            <input
              id="notify-label"
              value={notifyCta.buttonLabel}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, buttonLabel: event.target.value })
              }
            />
          </div>
          <div className="editor-field">
            <RequiredLabel htmlFor="notify-url">Button URL</RequiredLabel>
            <input
              id="notify-url"
              value={notifyCta.buttonUrl}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, buttonUrl: event.target.value })
              }
            />
          </div>
        </div>
      </section>
      <div className="editor-list">
        {dates.map((date, index) => {
          const isOpen = openDateId === date.id
          const dateTitle = date.venue || `Show ${index + 1}`
          const dateLocation = formatTourLocation(date)
          const dateMeta = [
            formatTourDate(
              date.date,
              tour.dateDisplayFormat ?? 'long_month_day_year',
            ),
            dateLocation,
          ].filter(Boolean).join(' · ')

          return (
            <article
              className={[
                'editor-item',
                'editor-collapse',
                isOpen ? 'editor-collapse--open' : '',
              ].filter(Boolean).join(' ')}
              key={date.id}
            >
              <button
                aria-controls={`${date.id}-tour-date-settings`}
                aria-expanded={isOpen}
                className="editor-collapse__trigger"
                type="button"
                onClick={() => toggleDate(date.id)}
              >
                <span>
                  {dateTitle}
                  <small>{dateMeta}</small>
                </span>
                <FiChevronDown aria-hidden="true" />
              </button>
              {isOpen && (
                <div
                  className="editor-collapse__content"
                  id={`${date.id}-tour-date-settings`}
                >
                  {isPastDate(date.date) && (
                    <p className="editor-empty">
                      This date has passed, so it is automatically unannounced.
                    </p>
                  )}
                  <div className="editor-item__header">
                    <h3>{dateTitle}</h3>
                    <button
                      className="editor-button"
                      type="button"
                      onClick={() => {
                        updateField('tour', {
                          ...tour,
                          dates: dates.filter((item) => item.id !== date.id),
                        })
                        setOpenDateId((current) =>
                          current === date.id ? null : current,
                        )
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${date.id}-id`}>ID</RequiredLabel>
                      <input
                        id={`${date.id}-id`}
                        value={date.id}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, id: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-date`}>Date</RequiredLabel>
                      <DashboardDateInput
                        id={`${date.id}-date`}
                        value={date.date}
                        onChange={(value) =>
                          updateDate(date.id, {
                            ...date,
                            date: value,
                            isAnnounced: isPastDate(value) ? false : date.isAnnounced,
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-venue`}>Venue</RequiredLabel>
                      <input
                        id={`${date.id}-venue`}
                        value={date.venue}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, venue: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-city`}>City</RequiredLabel>
                      <input
                        id={`${date.id}-city`}
                        value={date.city}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, city: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${date.id}-region`}>Region</label>
                      <input
                        id={`${date.id}-region`}
                        value={date.region ?? ''}
                        onChange={(event) => updateDateRegion(date, event.target.value)}
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-country`}>Country</RequiredLabel>
                      <input
                        id={`${date.id}-country`}
                        value={date.country}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, country: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${date.id}-ticket`}>Ticket URL</label>
                      <input
                        id={`${date.id}-ticket`}
                        value={date.ticketUrl ?? ''}
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            ticketUrl: optionalString(event.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${date.id}-vip`}>VIP URL</label>
                      <input
                        id={`${date.id}-vip`}
                        value={date.vipUrl ?? ''}
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            vipUrl: optionalString(event.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${date.id}-supporting`}>
                        Supporting acts, comma separated
                      </label>
                      <input
                        id={`${date.id}-supporting`}
                        value={date.supportingActs?.join(', ') ?? ''}
                        onChange={(event) => {
                          const supportingActs = parseCommaList(event.target.value)
                          updateDate(date.id, {
                            ...date,
                            supportingActs:
                              supportingActs.length > 0 ? supportingActs : undefined,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="editor-check-list">
                    <label className="editor-check">
                      <input
                        checked={date.isSoldOut}
                        type="checkbox"
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            isSoldOut: event.target.checked,
                          })
                        }
                      />
                      <span>Sold out</span>
                    </label>
                    <label className="editor-check">
                      <input
                        checked={date.isAnnounced && !isPastDate(date.date)}
                        disabled={isPastDate(date.date)}
                        type="checkbox"
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            isAnnounced: event.target.checked,
                          })
                        }
                      />
                      <span>Announced</span>
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
          onClick={addTourDate}
        >
          Add tour date
        </button>
      </div>
        </>
      )}
    </div>
  )
}

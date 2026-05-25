import type { TourDate } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
import './DashboardEditors.css'

const createTourDate = (): TourDate => ({
  id: createEditorId('show'),
  date: new Date().toISOString().slice(0, 10),
  venue: 'New venue',
  city: 'City',
  region: 'State',
  country: 'USA',
  isSoldOut: false,
  isAnnounced: true,
})

export function TourEditor({ draft, updateField }: DashboardEditorProps) {
  const tour = draft.tour
  const dates = tour.dates

  const updateDate = (id: string, value: TourDate) => {
    updateField('tour', {
      ...tour,
      dates: dates.map((date) => (date.id === id ? value : date)),
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Add public tour rows. Ticket and VIP URLs can be left blank until links are available.
      </p>
      <div className="editor-grid">
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
        <div className="editor-field">
          <label htmlFor="seated-widget">Seated widget URL</label>
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
      </div>
      <div className="editor-list">
        {dates.map((date, index) => (
          <article className="editor-item" key={date.id}>
            <div className="editor-item__header">
              <h3>{date.venue || `Show ${index + 1}`}</h3>
              <button
                className="editor-button"
                type="button"
                onClick={() =>
                  updateField('tour', {
                    ...tour,
                    dates: dates.filter((item) => item.id !== date.id),
                  })
                }
              >
                Remove
              </button>
            </div>
            <div className="editor-grid">
              <div className="editor-field">
                <label htmlFor={`${date.id}-date`}>Date</label>
                <input
                  id={`${date.id}-date`}
                  type="date"
                  value={date.date}
                  onChange={(event) => updateDate(date.id, { ...date, date: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${date.id}-venue`}>Venue</label>
                <input
                  id={`${date.id}-venue`}
                  value={date.venue}
                  onChange={(event) => updateDate(date.id, { ...date, venue: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${date.id}-city`}>City</label>
                <input
                  id={`${date.id}-city`}
                  value={date.city}
                  onChange={(event) => updateDate(date.id, { ...date, city: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${date.id}-region`}>Region</label>
                <input
                  id={`${date.id}-region`}
                  value={date.region}
                  onChange={(event) => updateDate(date.id, { ...date, region: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${date.id}-country`}>Country</label>
                <input
                  id={`${date.id}-country`}
                  value={date.country}
                  onChange={(event) => updateDate(date.id, { ...date, country: event.target.value })}
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
            </div>
            <div className="editor-check-list">
              <label className="editor-check">
                <input
                  checked={date.isSoldOut}
                  type="checkbox"
                  onChange={(event) =>
                    updateDate(date.id, { ...date, isSoldOut: event.target.checked })
                  }
                />
                <span>Sold out</span>
              </label>
              <label className="editor-check">
                <input
                  checked={date.isAnnounced}
                  type="checkbox"
                  onChange={(event) =>
                    updateDate(date.id, { ...date, isAnnounced: event.target.checked })
                  }
                />
                <span>Announced</span>
              </label>
            </div>
          </article>
        ))}
      </div>
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          type="button"
          onClick={() => updateField('tour', { ...tour, dates: [...dates, createTourDate()] })}
        >
          Add tour date
        </button>
      </div>
    </div>
  )
}

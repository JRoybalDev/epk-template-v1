import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function TourList() {
  const { epk } = useEPKOutlet()

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">Tour</p>
          <h1>{epk.tour.tourName || 'Upcoming dates'}</h1>
        </div>
        <div className="tour-list">
          {epk.tour.dates.map((date) => (
            <article className="tour-row" key={date.id}>
              <p className="tour-row__date">{date.date}</p>
              <div>
                <h2>{date.venue}</h2>
                <p className="epk-muted">{date.city}, {date.region}, {date.country}</p>
              </div>
              <div className="epk-button-row">
                {date.vipUrl && <a className="epk-button epk-button--ghost" href={date.vipUrl}>VIP</a>}
                {date.ticketUrl && <a className="epk-button" href={date.ticketUrl}>{date.isSoldOut ? 'Sold out' : 'Tickets'}</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

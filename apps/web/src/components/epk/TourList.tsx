import { useEPKOutlet } from '../../hooks/useEPKOutlet'

export function TourList() {
  const { epk } = useEPKOutlet()
  const dates = [...epk.tour.dates].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section data-section="tour">
      <header>
        <p>Tour</p>
        <h1>{epk.tour.tourName || 'Upcoming dates'}</h1>
        {epk.tour.seatedWidgetUrl && <a href={epk.tour.seatedWidgetUrl}>Open tour widget</a>}
      </header>
      {dates.length === 0 && <p>No tour dates have been added yet.</p>}
      <div data-list="tourDates">
        {dates.map((date) => (
          <article data-item="tourDate" key={date.id}>
            <p>{date.date}</p>
            <div>
              <h2>{date.isAnnounced ? date.venue : 'Coming soon'}</h2>
              <p>{date.city}, {date.region}, {date.country}</p>
              {date.supportingActs && date.supportingActs.length > 0 && (
                <p>{date.supportingActs.join(', ')}</p>
              )}
            </div>
            <div>
              {date.vipUrl && <a href={date.vipUrl}>VIP</a>}
              {date.ticketUrl && !date.isSoldOut && <a href={date.ticketUrl}>Tickets</a>}
              {date.isSoldOut && <span>Sold out</span>}
            </div>
          </article>
        ))}
      </div>
      {epk.tour.notifyCta && (
        <section data-section="tour-notify">
          <p>{epk.tour.notifyCta.text}</p>
          <a href={epk.tour.notifyCta.buttonUrl}>{epk.tour.notifyCta.buttonLabel}</a>
        </section>
      )}
    </section>
  )
}

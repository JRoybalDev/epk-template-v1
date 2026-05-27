import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { formatTourDate } from '../../utils/tourDateFormat'

const formatTourLocation = (
  city: string,
  region: string | undefined,
  country: string,
) => [city, region, country].filter(Boolean).join(', ')

const getTodayDateKey = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const isTourDateAnnounced = (date: { date: string; isAnnounced: boolean }) =>
  date.isAnnounced && date.date >= getTodayDateKey()

export function TourList() {
  const { epk } = useEPKOutlet()
  const dates = [...epk.tour.dates].sort((a, b) => a.date.localeCompare(b.date))
  const dateDisplayFormat = epk.tour.dateDisplayFormat ?? 'long_month_day_year'

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
            <p>{formatTourDate(date.date, dateDisplayFormat)}</p>
            <div>
              <h2>{isTourDateAnnounced(date) ? date.venue : 'Coming soon'}</h2>
              <p>{formatTourLocation(date.city, date.region, date.country)}</p>
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

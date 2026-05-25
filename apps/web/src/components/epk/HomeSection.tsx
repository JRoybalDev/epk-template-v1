import { Link } from 'react-router-dom'
import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'
import './EPKSections.css'

export function HomeSection() {
  const { epk } = useEPKOutlet()
  const release = epk.home.featuredRelease
  const tourPreview = epk.tour.dates.slice(0, 3)

  return (
    <section className="epk-section">
      <div className="home-hero site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">{epk.artistName}</p>
          <h1>{release.title}</h1>
          <p className="epk-section__lede">{release.subtitle}</p>
          <div className="epk-button-row">
            {release.smartLinkUrl && <a className="epk-button" href={release.smartLinkUrl}>Listen now</a>}
            <Link className="epk-button epk-button--ghost" to="/music">Music</Link>
          </div>
        </div>
        <div className="home-hero__art">
          <FallbackImage
            alt={`${release.title} cover`}
            fallbackLabel="Release art"
            src={release.coverImage}
          />
        </div>
      </div>
      {epk.home.showTourDatesOnHome && tourPreview.length > 0 && (
        <div className="site-container epk-section">
          <div className="epk-section__header">
            <p className="epk-section__eyebrow">Upcoming</p>
            <h2>Tour dates</h2>
          </div>
          <div className="tour-list">
            {tourPreview.map((date) => (
              <div className="tour-row" key={date.id}>
                <p className="tour-row__date">{date.date}</p>
                <p>{date.venue} · {date.city}, {date.region}</p>
                <Link className="epk-button epk-button--ghost" to="/tour">Details</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

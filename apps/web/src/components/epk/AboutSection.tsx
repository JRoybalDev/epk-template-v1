import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function AboutSection() {
  const { epk } = useEPKOutlet()

  return (
    <section className="epk-section">
      <div className="site-container about-layout">
        <div>
          <div className="epk-section__header">
            <p className="epk-section__eyebrow">About</p>
            <h1>{epk.artistName}</h1>
            <p className="epk-section__lede">{epk.about.shortBio}</p>
          </div>
          <p>{epk.about.longBio}</p>
          <ul className="about-list">
            {epk.about.accolades.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <aside className="epk-card">
          <div className="epk-card__body">
            <h2>Genres</h2>
            <p className="epk-muted">{epk.about.genres.join(', ')}</p>
            {epk.about.pressQuotes[0] && (
              <>
                <h2>Press</h2>
                <p>“{epk.about.pressQuotes[0].quote}”</p>
                <p className="epk-muted">{epk.about.pressQuotes[0].publication}</p>
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

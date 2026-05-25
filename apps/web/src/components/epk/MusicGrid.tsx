import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'
import './EPKSections.css'

export function MusicGrid() {
  const { epk } = useEPKOutlet()
  const releases = [...epk.music.releases].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">Music</p>
          <h1>Releases</h1>
        </div>
        <div className="epk-grid music-grid">
          {releases.map((release) => (
            <article className="epk-card" key={release.id}>
              <FallbackImage
                alt=""
                fallbackLabel="Release image"
                src={release.heroImage}
              />
              <div className="epk-card__body">
                <p className="epk-muted">{release.type} · {release.releaseDate}</p>
                <h2>{release.title}</h2>
                {release.smartLinkUrl && <a className="epk-button" href={release.smartLinkUrl}>Listen</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

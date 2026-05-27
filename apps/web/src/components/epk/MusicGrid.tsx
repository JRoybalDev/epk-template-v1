import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'

export function MusicGrid() {
  const { epk } = useEPKOutlet()
  const releases = [...epk.music.releases].sort(
    (a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) ||
      (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )

  return (
    <section data-section="music">
      <header>
        <p>Music</p>
        <h1>Releases</h1>
      </header>
      {releases.length === 0 && <p>No releases have been added yet.</p>}
      <div data-list="releases">
        {releases.map((release) => (
          <article data-item="release" key={release.id}>
            <FallbackImage
              alt=""
              fallbackLabel="Release image"
              src={release.heroImage}
            />
            <div>
              <p>{release.type} - {release.releaseDate}</p>
              <h2>{release.title}</h2>
              {release.smartLinkUrl && <a href={release.smartLinkUrl}>Listen</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

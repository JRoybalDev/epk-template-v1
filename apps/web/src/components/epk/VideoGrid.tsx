import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function VideoGrid() {
  const { epk } = useEPKOutlet()
  const videos = [...epk.videos].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">Videos</p>
          <h1>Watch</h1>
        </div>
        <div className="epk-grid video-grid">
          {videos.map((video) => (
            <article className="epk-card" key={video.id}>
              <iframe
                className="video-embed"
                src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
                title={video.title}
                allowFullScreen
              />
              <div className="epk-card__body">
                <h2>{video.title}</h2>
                <p className="epk-muted">{video.channelName} · {video.publishedDate}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

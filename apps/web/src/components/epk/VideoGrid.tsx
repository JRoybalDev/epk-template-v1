import { useEPKOutlet } from '../../hooks/useEPKOutlet'

export function VideoGrid() {
  const { epk } = useEPKOutlet()
  const videos = [...epk.videos].sort(
    (a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) ||
      (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )

  return (
    <section data-section="videos">
      <header>
        <p>Videos</p>
        <h1>Watch</h1>
      </header>
      {videos.length === 0 && <p>No videos have been added yet.</p>}
      <div data-list="videos">
        {videos.map((video) => (
          <article data-item="video" key={video.id}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
              title={video.title}
              allowFullScreen
            />
            <div>
              <h2>{video.title}</h2>
              <p>{[video.channelName, video.publishedDate].filter(Boolean).join(' - ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

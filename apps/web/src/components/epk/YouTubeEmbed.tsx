type YouTubeEmbedProps = {
  className?: string
  title: string
  url?: string
  videoId?: string
}

export const getYouTubeVideoId = (value?: string) => {
  if (!value) return ''

  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return url.pathname.replace(/^\//, '')
    if (url.searchParams.get('v')) return url.searchParams.get('v') ?? ''
    const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/)
    return embedMatch?.[1] ?? ''
  } catch {
    return value
  }
}

export function YouTubeEmbed({
  className,
  title,
  url,
  videoId,
}: YouTubeEmbedProps) {
  const resolvedVideoId = videoId || getYouTubeVideoId(url)

  if (!resolvedVideoId) {
    return null
  }

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={className}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={`https://www.youtube.com/embed/${resolvedVideoId}`}
      title={title}
    />
  )
}

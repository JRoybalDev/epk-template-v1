// Shared component: portable between projects. See ./README.md for the rules.
// Requires: react, ./youtube.ts

import { getYouTubeVideoId } from './youtube'

type YouTubeEmbedProps = {
  /** Accessible iframe title. */
  title: string
  /** Any YouTube URL (watch, youtu.be, embed, shorts, live) or a bare video ID. */
  url?: string
  /** Takes priority over `url` when both are provided. */
  videoId?: string
  className?: string
}

/**
 * Lazy-loaded YouTube iframe. Renders nothing when no valid video ID is found.
 * Size it with `className` (e.g. `w-full aspect-video`).
 */
export function YouTubeEmbed({ className, title, url, videoId }: YouTubeEmbedProps) {
  const resolvedVideoId = videoId || getYouTubeVideoId(url)

  if (!resolvedVideoId) return null

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={className}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={`https://www.youtube.com/embed/${encodeURIComponent(resolvedVideoId)}`}
      title={title}
    />
  )
}

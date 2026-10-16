// Shared helper: portable between projects. See ./README.md for the rules.
// Requires: nothing

/**
 * Extracts a YouTube video ID from a watch, youtu.be, embed, shorts, or live URL.
 * A bare 11-character video ID is returned as-is. Returns '' when no ID is found.
 */
export const getYouTubeVideoId = (value?: string) => {
  const trimmedValue = value?.trim()
  if (!trimmedValue) return ''

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedValue)) return trimmedValue

  try {
    const url = new URL(trimmedValue)
    const host = url.hostname.replace(/^(www\.|m\.)/, '')

    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] ?? ''
    if (!host.endsWith('youtube.com') && !host.endsWith('youtube-nocookie.com')) return ''

    const watchId = url.searchParams.get('v')
    if (watchId) return watchId

    const [kind, id] = url.pathname.split('/').filter(Boolean)
    return kind && id && ['embed', 'shorts', 'live'].includes(kind) ? id : ''
  } catch {
    return ''
  }
}

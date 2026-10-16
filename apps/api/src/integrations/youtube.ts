import { Hono } from 'hono'

// Example integration: looks up public metadata for a YouTube URL or video ID using
// YouTube's oEmbed endpoint and watch page. Needs no API key.
//
// GET /api/integrations/youtube?url=<youtube-url-or-id>
export const youtube = new Hono()

const extractVideoId = (value: string) => {
  const trimmedValue = value.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedValue)) return trimmedValue

  try {
    const url = new URL(trimmedValue)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (!host.endsWith('youtube.com') && !host.endsWith('youtube-nocookie.com')) {
      return null
    }

    const watchId = url.searchParams.get('v')
    if (watchId) return watchId

    const pathParts = url.pathname.split('/').filter(Boolean)
    const videoPathKeys = new Set(['embed', 'shorts', 'live'])
    const videoPathKeyIndex = pathParts.findIndex((part) => videoPathKeys.has(part))

    return videoPathKeyIndex >= 0 ? pathParts[videoPathKeyIndex + 1] ?? null : null
  } catch {
    return null
  }
}

const extractPublishDate = (html: string) => {
  const patterns = [
    /"datePublished"\s*:\s*"([^"]+)"/,
    /"uploadDate"\s*:\s*"([^"]+)"/,
    /<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)["']/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1].slice(0, 10)
  }

  return undefined
}

const fetchMetadata = async (source: string) => {
  const youtubeVideoId = extractVideoId(source)
  if (!youtubeVideoId) return null

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
  const headers = {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  }

  const [oembedResponse, watchResponse] = await Promise.allSettled([
    fetch(oembedUrl, { headers }),
    fetch(watchUrl, { headers }),
  ])

  let title = `YouTube video ${youtubeVideoId}`
  let channelName: string | undefined

  if (oembedResponse.status === 'fulfilled' && oembedResponse.value.ok) {
    const payload = (await oembedResponse.value.json()) as {
      author_name?: string
      title?: string
    }

    title = payload.title?.trim() || title
    channelName = payload.author_name?.trim() || undefined
  }

  let publishedDate: string | undefined
  if (watchResponse.status === 'fulfilled' && watchResponse.value.ok) {
    publishedDate = extractPublishDate(await watchResponse.value.text())
  }

  return { youtubeVideoId, title, channelName, publishedDate }
}

youtube.get('/', async (c) => {
  const source = c.req.query('url') ?? c.req.query('id') ?? ''
  const metadata = await fetchMetadata(source)

  if (!metadata) {
    return c.json({ error: 'Valid YouTube URL or video ID is required' }, 400)
  }

  return c.json(metadata)
})

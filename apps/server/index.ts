import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { getEPK, saveEPK, saveAsset } from './db/epk'
import { validateEPK } from '../../packages/schema'
import { join } from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { Buffer } from 'buffer'

const app = new Hono()
app.use('*', cors())
app.use('/uploads/*', serveStatic({ root: './' }))

const singleEPKSlug = process.env.EPK_SLUG ?? 'site'
const adminApiKey = process.env.ADMIN_API_KEY
const isProduction = process.env.NODE_ENV === 'production'
const unsafeDefaultKeys = new Set([
  'change-me-to-a-long-random-secret',
  'dev-admin-key-change-me',
])
const assetTypes = ['photos', 'branding', 'assets', 'fonts'] as const
const isAssetType = (value: string): value is (typeof assetTypes)[number] =>
  assetTypes.includes(value as (typeof assetTypes)[number])

const extractYouTubeVideoId = (value: string) => {
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

const getTodayDateKey = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const inferYouTubeVideoType = (title: string, source: string) => {
  const text = `${title} ${source}`.toLowerCase()

  if (text.includes('premiere') || text.includes('scheduled')) return 'scheduled'
  if (text.includes('live') || text.includes('performance')) return 'live'
  if (
    text.includes('music video') ||
    text.includes('official video') ||
    text.includes('official mv') ||
    text.includes('visualizer')
  ) {
    return 'music_video'
  }
  if (text.includes('/shorts/')) return 'other'

  return 'video'
}

const extractPublishDate = (html: string) => {
  const patterns = [
    /"datePublished"\s*:\s*"([^"]+)"/,
    /"uploadDate"\s*:\s*"([^"]+)"/,
    /<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+itemprop=["']datePublished["']/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1].slice(0, 10)
  }

  return null
}

const fetchYouTubeMetadata = async (source: string) => {
  const youtubeVideoId = extractYouTubeVideoId(source)
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
    const payload = await oembedResponse.value.json() as {
      author_name?: string
      title?: string
    }

    title = payload.title?.trim() || title
    channelName = payload.author_name?.trim() || undefined
  }

  let publishedDate: string | undefined
  if (watchResponse.status === 'fulfilled' && watchResponse.value.ok) {
    const html = await watchResponse.value.text()
    publishedDate = extractPublishDate(html) ?? undefined
  }

  return {
    channelName,
    publishedDate: publishedDate ?? getTodayDateKey(),
    title,
    type: inferYouTubeVideoType(title, source),
    youtubeVideoId,
  }
}

const normalizeIncomingEPK = (value: unknown) => {
  if (!value || typeof value !== 'object') return value

  const epk = structuredClone(value) as Record<string, unknown>
  const tour = epk.tour

  if (!tour || typeof tour !== 'object') return epk

  const tourRecord = tour as Record<string, unknown>
  if (!Array.isArray(tourRecord.dates)) return epk

  tourRecord.dates = tourRecord.dates.map((date) => {
    if (!date || typeof date !== 'object') return date

    const dateRecord = date as Record<string, unknown>
    return {
      ...dateRecord,
      region: typeof dateRecord.region === 'string' ? dateRecord.region : '',
    }
  })

  return epk
}

if (isProduction && (!adminApiKey || unsafeDefaultKeys.has(adminApiKey))) {
  throw new Error('Set a strong ADMIN_API_KEY before running in production.')
}

const requireAdminKey = (c: Parameters<Parameters<typeof app.use>[1]>[0]) => {
  if (!adminApiKey) {
    return c.json({ error: 'ADMIN_API_KEY is not configured' }, 500)
  }

  const providedKey = c.req.header('x-admin-key')
  if (providedKey !== adminApiKey) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return null
}

app.get('/api/epk', async (c) => {
  const epk = await getEPK(singleEPKSlug)
  if (!epk) return c.json({ error: 'EPK not found' }, 404)
  return c.json(epk)
})

app.get('/api/youtube-metadata', async (c) => {
  const source = c.req.query('url') ?? c.req.query('id') ?? ''
  const metadata = await fetchYouTubeMetadata(source)

  if (!metadata) {
    return c.json({ error: 'Valid YouTube URL or video ID is required' }, 400)
  }

  return c.json(metadata)
})

app.post('/api/epk', async (c) => {
  const unauthorized = requireAdminKey(c)
  if (unauthorized) return unauthorized

  const body = normalizeIncomingEPK(await c.req.json())
  const parsed = validateEPK(body)
  if (!parsed.success) {
    return c.json(
      {
        error: 'EPK validation failed',
        issues: parsed.issues,
      },
      400,
    )
  }
  const savedEPK = { ...parsed.data, slug: singleEPKSlug }
  await saveEPK(singleEPKSlug, savedEPK)
  return c.json({ ok: true, epk: savedEPK })
})

app.post('/api/upload/:type', async (c) => {
  const unauthorized = requireAdminKey(c)
  if (unauthorized) return unauthorized

  const body = await c.req.parseBody()
  const file = body.file
  if (!(file instanceof File)) {
    return c.json({ error: 'File is required' }, 400)
  }

  const { type } = c.req.param()
  if (!isAssetType(type)) {
    return c.json({ error: 'Invalid upload type' }, 400)
  }

  const uploadDir = join('uploads', singleEPKSlug, type)
  mkdirSync(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  writeFileSync(join(uploadDir, file.name), Buffer.from(bytes))

  const path = `/uploads/${singleEPKSlug}/${type}/${file.name}`
  await saveAsset(singleEPKSlug, type, file.name, path)

  return c.json({ path })
})

export default { port: 3001, fetch: app.fetch }

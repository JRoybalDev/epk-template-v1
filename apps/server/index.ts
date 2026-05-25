import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { getEPK, saveEPK, saveAsset } from './db/epk'
import { EPKSchema } from '../../packages/schema'
import { join } from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { Buffer } from 'buffer'

const app = new Hono()
app.use('*', cors())
app.use('/uploads/*', serveStatic({ root: './' }))

const singleEPKSlug = process.env.EPK_SLUG ?? 'site'
const adminApiKey = process.env.ADMIN_API_KEY
const assetTypes = ['photos', 'branding', 'assets'] as const
const isAssetType = (value: string): value is (typeof assetTypes)[number] =>
  assetTypes.includes(value as (typeof assetTypes)[number])

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

app.post('/api/epk', async (c) => {
  const unauthorized = requireAdminKey(c)
  if (unauthorized) return unauthorized

  const body = await c.req.json()
  const parsed = EPKSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error }, 400)
  await saveEPK(singleEPKSlug, { ...parsed.data, slug: singleEPKSlug })
  return c.json({ ok: true })
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

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { integrations } from './integrations'

export const app = new Hono()

// Comma-separated list of frontend origins allowed by CORS. Unset allows any origin,
// which is fine locally and for same-origin Vercel deploys.
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use('*', async (c, next) => {
  await next()
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})

app.use('*', cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : '*' }))

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.route('/api/integrations', integrations)

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((error, c) => {
  console.error(error)
  return c.json({ error: 'Internal server error' }, 500)
})

export default { port: Number(process.env.PORT ?? 3001), fetch: app.fetch }

import { handle } from 'hono/vercel'
import { app } from '../apps/server/index'

// Vercel treats any file under api/ as a serverless function. This catch-all route
// forwards every /api/* request to the same Hono app used for local dev (apps/server),
// so the request-handling logic only lives in one place. A single default export using
// the Fetch API Request/Response signature is Vercel's general (non-Next.js) convention —
// handle() already returns exactly that shape.
export default handle(app)

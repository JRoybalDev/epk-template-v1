import { Hono } from 'hono'
import { youtube } from './youtube'

// Each third-party integration is its own Hono router, mounted under
// /api/integrations/<name>. To add one (Spotify, Bandsintown, Mailchimp, Shopify...):
//   1. Create src/integrations/<name>.ts exporting a Hono router.
//   2. Read any API keys from process.env and add them to .env.example.
//   3. Mount it below.
export const integrations = new Hono()

integrations.route('/youtube', youtube)

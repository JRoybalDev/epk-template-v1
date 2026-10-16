import { content } from '../apps/web/src/content/epk'
import { validateEPK } from '../apps/web/src/content/schema'

// Validates the site content without starting the app: bun run validate:content
const validation = validateEPK(content)

if (!validation.success) {
  console.error('apps/web/src/content/epk.ts failed validation:')
  for (const issue of validation.issues) {
    console.error(`  ${issue.path || 'root'}: ${issue.message}`)
  }
  process.exit(1)
}

console.log(`apps/web/src/content/epk.ts is valid (${validation.data.artistName}).`)

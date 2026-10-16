import { readFileSync } from 'fs'
import { resolve } from 'path'
import { validateEPK } from '../apps/web/src/content/schema'

// Validates the site content file without starting the app.
//   bun run validate:content [path-to-json]
const filePath = resolve(Bun.argv[2] ?? 'apps/web/src/content/epk.json')
const validation = validateEPK(JSON.parse(readFileSync(filePath, 'utf8')))

if (!validation.success) {
  console.error(`${filePath} failed validation:`)
  for (const issue of validation.issues) {
    console.error(`  ${issue.path || 'root'}: ${issue.message}`)
  }
  process.exit(1)
}

console.log(`${filePath} is valid (${validation.data.artistName}).`)

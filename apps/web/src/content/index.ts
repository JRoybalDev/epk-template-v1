import rawEPK from './epk.json'
import { validateEPK, type EPK } from './schema'

// All site content lives in epk.json. It is validated against the schema once at
// startup so a typo surfaces as a clear error instead of a half-rendered page.
const validation = validateEPK(rawEPK)

if (!validation.success) {
  const issues = validation.issues
    .map((issue) => `  ${issue.path || 'root'}: ${issue.message}`)
    .join('\n')

  throw new Error(`src/content/epk.json failed validation:\n${issues}`)
}

export const epk: EPK = validation.data

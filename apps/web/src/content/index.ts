import { content } from './epk'
import { validateEPK, type EPK } from './schema'

// Type-checking catches most mistakes in epk.ts while editing. This runtime check
// covers what types can't (URL and email formats) and applies schema defaults.
const validation = validateEPK(content)

if (!validation.success) {
  const issues = validation.issues
    .map((issue) => `  ${issue.path || 'root'}: ${issue.message}`)
    .join('\n')

  throw new Error(`src/content/epk.ts failed validation:\n${issues}`)
}

export const epk: EPK = validation.data

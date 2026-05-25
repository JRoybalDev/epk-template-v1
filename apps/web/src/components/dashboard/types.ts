import type { EPK } from '../../../../../packages/schema'

export type DashboardEditorProps = {
  draft: EPK
  updateField: <Key extends Exclude<keyof EPK, 'slug'>>(
    key: Key,
    value: EPK[Key],
  ) => void
}

export const parseCommaList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const optionalString = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const createEditorId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

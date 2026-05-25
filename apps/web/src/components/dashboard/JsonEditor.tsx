import { useEffect, useMemo, useState } from 'react'
import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

type JsonEditorProps<Key extends keyof DashboardEditorProps['draft']> =
  DashboardEditorProps & {
    field: Key
    label: string
    description?: string
    emptyState?: string
    example?: unknown
  }

export function JsonEditor<Key extends keyof DashboardEditorProps['draft']>({
  draft,
  description,
  emptyState,
  example,
  field,
  label,
  updateField,
}: JsonEditorProps<Key>) {
  const formattedValue = useMemo(
    () => JSON.stringify(draft[field], null, 2),
    [draft, field],
  )
  const [value, setValue] = useState(formattedValue)
  const [error, setError] = useState('')

  useEffect(() => {
    setValue(formattedValue)
  }, [formattedValue])

  const applyJson = () => {
    try {
      updateField(field as never, JSON.parse(value) as never)
      setError('')
    } catch {
      setError('JSON is not valid.')
    }
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        {description ?? `Edit the ${label} JSON directly for now.`}
      </p>
      {emptyState && <p className="editor-empty">{emptyState}</p>}
      <div className="editor-field">
        <label htmlFor={`${String(field)}-json`}>{label} JSON</label>
        <textarea
          id={`${String(field)}-json`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      {error && <p className="editor-error">{error}</p>}
      {example !== undefined && (
        <details className="editor-example">
          <summary>Example shape</summary>
          <pre>{JSON.stringify(example, null, 2)}</pre>
        </details>
      )}
      <div className="editor-actions">
        <button className="editor-button editor-button--primary" type="button" onClick={applyJson}>
          Apply JSON
        </button>
      </div>
    </div>
  )
}

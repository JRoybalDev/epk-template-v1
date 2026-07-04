import { useMemo, useRef, useState } from 'react'
import type { EPK } from '../../../../../packages/schema'
import { validateEPK } from '../../../../../packages/schema'
import { downloadEPKJson, getEPKExportFilename } from '../../utils/exportEPK'
import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

type JsonToolsEditorProps = DashboardEditorProps & {
  replaceDraft: (data: EPK) => void
}

const formatIssues = (issues: ReturnType<typeof validateEPK>['issues']) =>
  issues.map((issue) => `${issue.path || 'root'}: ${issue.message}`).join('\n')

export function JsonToolsEditor({
  draft,
  replaceDraft,
}: JsonToolsEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [jsonText, setJsonText] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const exportFilename = useMemo(() => getEPKExportFilename(draft), [draft])

  const importData = (raw: string) => {
    setError('')
    setMessage('')

    try {
      const parsedJson = JSON.parse(raw)
      const validation = validateEPK(parsedJson)

      if (!validation.success) {
        setError(`EPK validation failed:\n${formatIssues(validation.issues)}`)
        return
      }

      replaceDraft(validation.data)
      setJsonText(JSON.stringify(validation.data, null, 2))
      setMessage('Imported JSON into the dashboard draft. Review it, then save the EPK.')
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'JSON import failed.')
    }
  }

  const importFromFile = async (file: File) => {
    const raw = await file.text()
    setJsonText(raw)
    importData(raw)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Export the current dashboard draft for backup or paste/upload a validated EPK
        JSON file to replace the draft. Importing here does not save to the API until
        you click <strong>Publish</strong>.
      </p>

      <section className="editor-item" aria-labelledby="export-json-title">
        <div className="editor-item__header">
          <h3 id="export-json-title">Export current EPK</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() => downloadEPKJson(draft)}
          >
            Download JSON
          </button>
        </div>
        <p className="editor-note">
          Downloads the current dashboard draft as <code>{exportFilename}</code>.
        </p>
      </section>

      <section className="editor-item" aria-labelledby="import-json-title">
        <div className="editor-item__header">
          <h3 id="import-json-title">Import JSON into draft</h3>
          <label className="editor-button editor-button--file" htmlFor="epk-json-file">
            Choose file
          </label>
        </div>
        <input
          ref={fileInputRef}
          className="visually-hidden"
          id="epk-json-file"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void importFromFile(file)
          }}
        />
        <div className="editor-field">
          <label htmlFor="epk-json-text">Paste EPK JSON</label>
          <textarea
            id="epk-json-text"
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder="Paste a complete EPK JSON object here."
          />
        </div>
        <div className="editor-actions">
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() => importData(jsonText)}
          >
            Validate and import draft
          </button>
          <button
            className="editor-button"
            type="button"
            onClick={() => {
              setJsonText(JSON.stringify(draft, null, 2))
              setError('')
              setMessage('Loaded current draft into the text area.')
            }}
          >
            Load current draft
          </button>
        </div>
      </section>

      {error && <p className="editor-error">{error}</p>}
      {message && <p className="editor-success">{message}</p>}
    </div>
  )
}

import { useState } from 'react'
import type { AssetType } from '../../api/client'
import { uploadAsset } from '../../api/client'
import './DashboardEditors.css'

type AssetUploaderProps = {
  adminKey: string
}

const uploadTypes: AssetType[] = ['photos', 'branding', 'assets']

export function AssetUploader({ adminKey }: AssetUploaderProps) {
  const [type, setType] = useState<AssetType>('assets')
  const [file, setFile] = useState<File | null>(null)
  const [uploadedPath, setUploadedPath] = useState('')
  const [error, setError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      setError('Choose a file first.')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const result = await uploadAsset(type, file, adminKey)
      setUploadedPath(result.path)
      setCopyMessage('')
      setFile(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  const copyUploadedPath = async () => {
    if (!uploadedPath) return

    await navigator.clipboard.writeText(uploadedPath)
    setCopyMessage('Copied path.')
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Upload an asset, then paste the returned path into the relevant editor field.
      </p>
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="asset-type">Asset type</label>
          <select
            id="asset-type"
            value={type}
            onChange={(event) => setType(event.target.value as AssetType)}
          >
            {uploadTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="editor-field">
          <label htmlFor="asset-file">File</label>
          <input
            id="asset-file"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      {error && <p className="editor-error">{error}</p>}
      {uploadedPath && <p className="editor-success">Uploaded: {uploadedPath}</p>}
      {copyMessage && <p className="editor-success">{copyMessage}</p>}
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          disabled={isUploading}
          type="button"
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload asset'}
        </button>
        <button
          className="editor-button"
          disabled={!uploadedPath}
          type="button"
          onClick={copyUploadedPath}
        >
          Copy path
        </button>
      </div>
    </div>
  )
}

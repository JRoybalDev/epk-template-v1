import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

export function BrandingEditor({ draft, updateField }: DashboardEditorProps) {
  return (
    <div className="editor-form">
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="artist-name">Artist name</label>
          <input
            id="artist-name"
            value={draft.artistName}
            onChange={(event) => updateField('artistName', event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="accent-color">Accent color</label>
          <input
            id="accent-color"
            type="color"
            value={draft.branding.accentColor ?? '#6f1d2c'}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                accentColor: event.target.value,
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="font-style">Font style</label>
          <select
            id="font-style"
            value={draft.branding.fontStyle}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                fontStyle: event.target.value as 'serif' | 'sans' | 'script',
              })
            }
          >
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="script">Script</option>
          </select>
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="logo-text">Logo text</label>
          <input
            id="logo-text"
            value={draft.branding.logoText ?? ''}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                logoText: event.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

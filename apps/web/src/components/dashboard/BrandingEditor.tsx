import type { EPK } from '../../../../../packages/schema'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

type Branding = EPK['branding']
type BrandingTheme = NonNullable<Branding['theme']>

const themeFields: Array<{
  key: keyof BrandingTheme
  label: string
  fallback: string
}> = [
  { key: 'bg', label: 'Page background', fallback: '#f7ede2' },
  { key: 'bgAlt', label: 'Alternate background', fallback: '#e7d4bb' },
  { key: 'surface', label: 'Surface', fallback: '#fffcf7' },
  { key: 'surfaceStrong', label: 'Strong surface', fallback: '#fffcf7' },
  { key: 'text', label: 'Text', fallback: '#27211b' },
  { key: 'muted', label: 'Muted text', fallback: '#7f5a3b' },
  { key: 'accent', label: 'Accent', fallback: '#8c6844' },
  { key: 'accentStrong', label: 'Strong accent', fallback: '#c4976e' },
  { key: 'accentSoft', label: 'Soft accent', fallback: '#d8b48a' },
  { key: 'border', label: 'Border', fallback: '#d8c6b6' },
  { key: 'cardBorder', label: 'Card border', fallback: '#d8c6b6' },
  { key: 'foam', label: 'Contrast text', fallback: '#fffcf7' },
]

export function BrandingEditor({ draft, updateField }: DashboardEditorProps) {
  const branding = draft.branding
  const theme = branding.theme ?? {}

  const updateBranding = (value: Branding) => updateField('branding', value)

  const updateTheme = (key: keyof BrandingTheme, value: string) => {
    updateBranding({
      ...branding,
      theme: {
        ...theme,
        [key]: optionalString(value),
      },
    })
  }

  return (
    <div className="editor-form">
      <div className="editor-grid">
        <div className="editor-field">
          <RequiredLabel htmlFor="artist-name">Artist name</RequiredLabel>
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
          <RequiredLabel htmlFor="font-style">Default font style</RequiredLabel>
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
                logoText: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="logo-image">Logo image path</label>
          <input
            id="logo-image"
            value={draft.branding.logoImage ?? ''}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                logoImage: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="background-texture">Background texture path</label>
          <input
            id="background-texture"
            value={draft.branding.backgroundTexture ?? ''}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                backgroundTexture: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="corner-motif">Corner motif path</label>
          <input
            id="corner-motif"
            value={draft.branding.cornerMotif ?? ''}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                cornerMotif: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="branding-favicon">Favicon path</label>
          <input
            id="branding-favicon"
            value={draft.branding.faviconPath ?? ''}
            onChange={(event) =>
              updateField('branding', {
                ...draft.branding,
                faviconPath: optionalString(event.target.value),
              })
            }
          />
        </div>
      </div>
      <section className="editor-item" aria-labelledby="theme-title">
        <div className="editor-item__header">
          <h3 id="theme-title">Public EPK color theme</h3>
        </div>
        <p className="editor-note">
          These colors apply only to the public EPK. The dashboard keeps its own
          light/dark mode.
        </p>
        <div className="editor-grid">
          {themeFields.map((field) => (
            <div className="editor-field" key={field.key}>
              <label htmlFor={`theme-${field.key}`}>{field.label}</label>
              <input
                id={`theme-${field.key}`}
                type="color"
                value={theme[field.key] ?? field.fallback}
                onChange={(event) => updateTheme(field.key, event.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

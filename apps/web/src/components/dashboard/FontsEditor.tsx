import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type { EPK } from '../../../../../packages/schema'
import { ConfirmButton } from './ConfirmButton'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

type Branding = EPK['branding']
type BrandingFonts = NonNullable<Branding['fonts']>
type GoogleFont = NonNullable<BrandingFonts['googleFonts']>[number]
type UploadedFont = NonNullable<BrandingFonts['uploadedFonts']>[number]
type FontAssignments = NonNullable<BrandingFonts['assignments']>
type FontTarget = keyof FontAssignments
type FontAssignment = NonNullable<FontAssignments[FontTarget]>

const emptyFonts: BrandingFonts = {
  googleFonts: [],
  uploadedFonts: [],
  assignments: {},
}

const fontTargets: Array<{ key: FontTarget; label: string }> = [
  { key: 'body', label: 'Body / default' },
  { key: 'h1', label: 'H1' },
  { key: 'h2', label: 'H2' },
  { key: 'h3', label: 'H3' },
  { key: 'p', label: 'Paragraph' },
  { key: 'a', label: 'Links' },
  { key: 'button', label: 'Buttons' },
  { key: 'nav', label: 'Navigation' },
]

const systemFontOptions = [
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'system-ui',
]

const fontWeightOptions = ['100', '200', '300', '400', '500', '600', '700', '800', '900']

const fontStyleOptions: Array<NonNullable<FontAssignment['style']>> = [
  'normal',
  'italic',
  'oblique',
]

const fontSizeOptions = [
  '0.875rem',
  '1rem',
  '1.125rem',
  '1.25rem',
  '1.5rem',
  '2rem',
  '2.5rem',
  '3rem',
  'clamp(2rem, 5vw, 4rem)',
]

const lineHeightOptions = ['1', '1.1', '1.2', '1.35', '1.5', '1.65', '1.8']
const letterSpacingOptions = ['0', '0.01em', '0.02em', '0.04em', '0.08em', '0.12em']

const textTransformOptions: Array<NonNullable<FontAssignment['textTransform']>> = [
  'none',
  'uppercase',
  'lowercase',
  'capitalize',
]

const uniqueFontFamilies = (fonts: BrandingFonts) => {
  const families = [
    ...systemFontOptions,
    ...(fonts.googleFonts ?? []).map((font) => font.family),
    ...(fonts.uploadedFonts ?? []).map((font) => font.family),
  ]

  return Array.from(new Set(families.map((family) => family.trim()).filter(Boolean)))
}

const renderOptions = (options: string[]) =>
  options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ))

export function FontsEditor({ draft, updateField }: DashboardEditorProps) {
  const [openTarget, setOpenTarget] = useState<FontTarget | null>(null)
  const branding = draft.branding
  const fonts = branding.fonts ?? emptyFonts
  const googleFonts = fonts.googleFonts ?? []
  const uploadedFonts = fonts.uploadedFonts ?? []
  const assignments = fonts.assignments ?? {}
  const fontFamilyOptions = uniqueFontFamilies(fonts)

  const updateBranding = (value: Branding) => updateField('branding', value)

  const updateFonts = (value: BrandingFonts) => {
    updateBranding({
      ...branding,
      fonts: value,
    })
  }

  const updateGoogleFont = (index: number, value: GoogleFont) => {
    updateFonts({
      ...fonts,
      googleFonts: googleFonts.map((font, fontIndex) =>
        fontIndex === index ? value : font,
      ),
    })
  }

  const updateUploadedFont = (index: number, value: UploadedFont) => {
    updateFonts({
      ...fonts,
      uploadedFonts: uploadedFonts.map((font, fontIndex) =>
        fontIndex === index ? value : font,
      ),
    })
  }

  const updateAssignment = (
    target: FontTarget,
    key: keyof FontAssignment,
    value: string,
  ) => {
    updateFonts({
      ...fonts,
      assignments: {
        ...assignments,
        [target]: {
          ...(assignments[target] ?? {}),
          [key]: optionalString(value),
        },
      },
    })
  }

  const toggleTarget = (target: FontTarget) => {
    setOpenTarget((current) => (current === target ? null : target))
  }

  return (
    <div className="editor-form">
      <section className="editor-item" aria-labelledby="google-fonts-title">
        <div className="editor-item__header">
          <h3 id="google-fonts-title">Google fonts</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateFonts({
                ...fonts,
                googleFonts: [
                  ...googleFonts,
                  { family: 'Inter', weights: '400;700' },
                ],
              })
            }
          >
            Add Google font
          </button>
        </div>
        <div className="editor-list">
          {googleFonts.map((font, index) => (
            <article className="editor-item" key={`${font.family}-${index}`}>
              <div className="editor-item__header">
                <h4>{font.family || `Google font ${index + 1}`}</h4>
                <ConfirmButton
                  label="Remove"
                  onConfirm={() =>
                    updateFonts({
                      ...fonts,
                      googleFonts: googleFonts.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                />
              </div>
              <div className="editor-grid">
                <div className="editor-field">
                  <RequiredLabel htmlFor={`google-font-${index}-family`}>Family</RequiredLabel>
                  <input
                    id={`google-font-${index}-family`}
                    value={font.family}
                    onChange={(event) =>
                      updateGoogleFont(index, { ...font, family: event.target.value })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`google-font-${index}-weights`}>Weights</label>
                  <input
                    id={`google-font-${index}-weights`}
                    value={font.weights ?? ''}
                    placeholder="400;700"
                    onChange={(event) =>
                      updateGoogleFont(index, {
                        ...font,
                        weights: optionalString(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editor-item" aria-labelledby="uploaded-fonts-title">
        <div className="editor-item__header">
          <h3 id="uploaded-fonts-title">Uploaded fonts</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateFonts({
                ...fonts,
                uploadedFonts: [
                  ...uploadedFonts,
                  {
                    family: 'Custom Font',
                    source: '/uploads/site/assets/font.woff2',
                    weight: '400',
                    style: 'normal',
                  },
                ],
              })
            }
          >
            Add uploaded font
          </button>
        </div>
        <div className="editor-list">
          {uploadedFonts.map((font, index) => (
            <article className="editor-item" key={`${font.family}-${index}`}>
              <div className="editor-item__header">
                <h4>{font.family || `Uploaded font ${index + 1}`}</h4>
                <ConfirmButton
                  label="Remove"
                  onConfirm={() =>
                    updateFonts({
                      ...fonts,
                      uploadedFonts: uploadedFonts.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                />
              </div>
              <div className="editor-grid">
                <div className="editor-field">
                  <RequiredLabel htmlFor={`upload-font-${index}-family`}>Family</RequiredLabel>
                  <input
                    id={`upload-font-${index}-family`}
                    value={font.family}
                    onChange={(event) =>
                      updateUploadedFont(index, { ...font, family: event.target.value })
                    }
                  />
                </div>
                <div className="editor-field editor-field--wide">
                  <RequiredLabel htmlFor={`upload-font-${index}-source`}>Font file path</RequiredLabel>
                  <input
                    id={`upload-font-${index}-source`}
                    value={font.source}
                    onChange={(event) =>
                      updateUploadedFont(index, { ...font, source: event.target.value })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`upload-font-${index}-weight`}>Weight</label>
                  <select
                    id={`upload-font-${index}-weight`}
                    value={font.weight ?? ''}
                    onChange={(event) =>
                      updateUploadedFont(index, {
                        ...font,
                        weight: optionalString(event.target.value),
                      })
                    }
                  >
                    <option value="">Default</option>
                    {renderOptions(fontWeightOptions)}
                  </select>
                </div>
                <div className="editor-field">
                  <label htmlFor={`upload-font-${index}-style`}>Style</label>
                  <select
                    id={`upload-font-${index}-style`}
                    value={font.style ?? ''}
                    onChange={(event) =>
                      updateUploadedFont(index, {
                        ...font,
                        style: optionalString(event.target.value) as UploadedFont['style'],
                      })
                    }
                  >
                    <option value="">Default</option>
                    {renderOptions(fontStyleOptions)}
                  </select>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editor-item" aria-labelledby="font-assignments-title">
        <div className="editor-item__header">
          <h3 id="font-assignments-title">Element font settings</h3>
        </div>
        <div className="editor-list">
          {fontTargets.map((target) => {
            const assignment = assignments[target.key] ?? {}
            const isOpen = openTarget === target.key

            return (
              <article
                className={[
                  'editor-item',
                  'editor-collapse',
                  isOpen ? 'editor-collapse--open' : '',
                ].filter(Boolean).join(' ')}
                key={target.key}
              >
                <button
                  aria-controls={`${target.key}-font-settings`}
                  aria-expanded={isOpen}
                  className="editor-collapse__trigger"
                  type="button"
                  onClick={() => toggleTarget(target.key)}
                >
                  <span>{target.label}</span>
                  <FiChevronDown aria-hidden="true" />
                </button>
                {isOpen && (
                  <div
                    className="editor-grid editor-collapse__content"
                    id={`${target.key}-font-settings`}
                  >
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-font-family`}>Font family</label>
                      <select
                        id={`${target.key}-font-family`}
                        value={assignment.family ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'family', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(fontFamilyOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-font-weight`}>Weight</label>
                      <select
                        id={`${target.key}-font-weight`}
                        value={assignment.weight ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'weight', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(fontWeightOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-font-style`}>Style</label>
                      <select
                        id={`${target.key}-font-style`}
                        value={assignment.style ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'style', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(fontStyleOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-font-size`}>Size</label>
                      <select
                        id={`${target.key}-font-size`}
                        value={assignment.size ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'size', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(fontSizeOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-line-height`}>Line height</label>
                      <select
                        id={`${target.key}-line-height`}
                        value={assignment.lineHeight ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'lineHeight', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(lineHeightOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-letter-spacing`}>Letter spacing</label>
                      <select
                        id={`${target.key}-letter-spacing`}
                        value={assignment.letterSpacing ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'letterSpacing', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(letterSpacingOptions)}
                      </select>
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${target.key}-transform`}>Text transform</label>
                      <select
                        id={`${target.key}-transform`}
                        value={assignment.textTransform ?? ''}
                        onChange={(event) =>
                          updateAssignment(target.key, 'textTransform', event.target.value)
                        }
                      >
                        <option value="">Default</option>
                        {renderOptions(textTransformOptions)}
                      </select>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

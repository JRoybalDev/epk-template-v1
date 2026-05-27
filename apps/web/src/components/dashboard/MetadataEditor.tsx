import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

const fallbackUrl = 'https://artist-site.example'

export function MetadataEditor({ draft, updateField }: DashboardEditorProps) {
  const metadata = draft.metadata ?? {}
  const title = metadata.title ?? draft.pageTitle ?? `${draft.artistName} | EPK`
  const description =
    metadata.description ||
    draft.about.shortBio ||
    draft.home.announcement?.text ||
    `Official EPK for ${draft.artistName}.`
  const socialImage =
    metadata.socialImage ||
    draft.home.featuredRelease.coverImage
  const faviconPath =
    metadata.faviconPath ||
    draft.branding.faviconPath ||
    ''
  const themeColor =
    metadata.themeColor ||
    draft.branding.accentColor ||
    '#6f1d2c'
  const siteUrl =
    metadata.siteUrl ||
    (typeof window === 'undefined' ? fallbackUrl : window.location.origin)

  const updateMetadata = (value: typeof metadata) => {
    updateField('metadata', value)
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Control the browser title, search/social description, share image, favicon,
        and preview card used when the public EPK URL is shared. Uploaded image paths
        usually look like <code>/uploads/site/assets/file.jpg</code>.
      </p>
      <div className="metadata-editor">
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label htmlFor="metadata-title">Meta title</label>
            <input
              id="metadata-title"
              value={metadata.title ?? ''}
              placeholder={title}
              onChange={(event) =>
                updateMetadata({ ...metadata, title: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="metadata-description">Meta description</label>
            <textarea
              id="metadata-description"
              value={metadata.description ?? ''}
              placeholder={description}
              onChange={(event) =>
                updateMetadata({ ...metadata, description: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="metadata-social-image">Open Graph image</label>
            <input
              id="metadata-social-image"
              value={metadata.socialImage ?? ''}
              placeholder={socialImage}
              onChange={(event) =>
                updateMetadata({ ...metadata, socialImage: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="metadata-favicon">Favicon path</label>
            <input
              id="metadata-favicon"
              value={metadata.faviconPath ?? ''}
              placeholder={faviconPath || '/uploads/site/branding/favicon.ico'}
              onChange={(event) =>
                updateMetadata({ ...metadata, faviconPath: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="metadata-site-url">Canonical site URL</label>
            <input
              id="metadata-site-url"
              value={metadata.siteUrl ?? ''}
              placeholder={siteUrl}
              onChange={(event) =>
                updateMetadata({ ...metadata, siteUrl: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="metadata-theme-color">Theme color</label>
            <input
              id="metadata-theme-color"
              type="color"
              value={themeColor}
              onChange={(event) =>
                updateMetadata({ ...metadata, themeColor: event.target.value })
              }
            />
          </div>
        </div>

        <aside className="social-preview" aria-label="Open Graph preview">
          <p className="social-preview__eyebrow">Share preview</p>
          <div className="social-preview__card">
            <div className="social-preview__image">
              {socialImage ? (
                <img src={socialImage} alt="" />
              ) : (
                <span>No image</span>
              )}
            </div>
            <div className="social-preview__body">
              <p className="social-preview__domain">
                {siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </p>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

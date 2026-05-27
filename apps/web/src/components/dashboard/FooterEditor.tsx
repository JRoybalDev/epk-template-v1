import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

type LegalLink = NonNullable<EPK['footer']['legalLinks']>[number]

const socialKeys = [
  'facebook',
  'instagram',
  'youtube',
  'tiktok',
  'spotify',
  'appleMusic',
  'bandcamp',
  'twitter',
  'website',
  'soundcloud',
] as const

const createLegalLink = (): LegalLink => ({
  label: 'Legal link',
  url: 'https://example.com',
})

export function FooterEditor({ draft, updateField }: DashboardEditorProps) {
  const footer = draft.footer
  const legalLinks = footer.legalLinks ?? []

  const updateSocial = (
    key: keyof typeof footer.socials,
    value: string,
  ) =>
    updateField('footer', {
      ...footer,
      socials: {
        ...footer.socials,
        [key]: optionalString(value),
      },
    })

  const updateLegalLink = (index: number, value: LegalLink) => {
    updateField('footer', {
      ...footer,
      legalLinks: legalLinks.map((link, linkIndex) =>
        linkIndex === index ? value : link,
      ),
    })
  }

  return (
    <div className="editor-form">
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="copyright-name">Copyright name</label>
          <input
            id="copyright-name"
            value={footer.copyrightName}
            onChange={(event) =>
              updateField('footer', {
                ...footer,
                copyrightName: event.target.value,
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="powered-by-label">Powered-by label</label>
          <input
            id="powered-by-label"
            value={footer.poweredByLabel ?? ''}
            onChange={(event) =>
              updateField('footer', {
                ...footer,
                poweredByLabel: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="powered-by-url">Powered-by URL</label>
          <input
            id="powered-by-url"
            value={footer.poweredByUrl ?? ''}
            onChange={(event) =>
              updateField('footer', {
                ...footer,
                poweredByUrl: optionalString(event.target.value),
              })
            }
          />
        </div>
      </div>
      <section className="editor-item" aria-labelledby="footer-socials-title">
        <h3 id="footer-socials-title">Social links</h3>
        <div className="editor-grid">
          {socialKeys.map((key) => (
            <div className="editor-field" key={key}>
              <label htmlFor={`social-${key}`}>{key} URL</label>
              <input
                id={`social-${key}`}
                value={footer.socials[key] ?? ''}
                onChange={(event) => updateSocial(key, event.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="editor-item" aria-labelledby="legal-links-title">
        <div className="editor-item__header">
          <h3 id="legal-links-title">Legal links</h3>
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() =>
              updateField('footer', {
                ...footer,
                legalLinks: [...legalLinks, createLegalLink()],
              })
            }
          >
            Add legal link
          </button>
        </div>
        <div className="editor-list">
          {legalLinks.map((link, index) => (
            <article className="editor-item" key={`${link.label}-${index}`}>
              <div className="editor-item__header">
                <h4>{link.label || `Legal link ${index + 1}`}</h4>
                <button
                  className="editor-button"
                  type="button"
                  onClick={() =>
                    updateField('footer', {
                      ...footer,
                      legalLinks: legalLinks.filter((_, linkIndex) => linkIndex !== index),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="editor-grid">
                <div className="editor-field">
                  <label htmlFor={`legal-${index}-label`}>Label</label>
                  <input
                    id={`legal-${index}-label`}
                    value={link.label}
                    onChange={(event) =>
                      updateLegalLink(index, { ...link, label: event.target.value })
                    }
                  />
                </div>
                <div className="editor-field">
                  <label htmlFor={`legal-${index}-url`}>URL</label>
                  <input
                    id={`legal-${index}-url`}
                    value={link.url}
                    onChange={(event) =>
                      updateLegalLink(index, { ...link, url: event.target.value })
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

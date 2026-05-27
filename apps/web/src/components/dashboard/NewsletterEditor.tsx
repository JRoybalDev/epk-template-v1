import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

type Newsletter = NonNullable<EPK['newsletter']>

const providerOptions: NonNullable<Newsletter['provider']>[] = [
  'mailchimp',
  'klaviyo',
  'beehiiv',
  'convertkit',
  'other',
]

const defaultNewsletter: Newsletter = {
  headline: 'Stay in the loop',
  subheadline: '',
  backgroundImage: '',
  embedCode: '',
  provider: undefined,
}

export function NewsletterEditor({ draft, updateField }: DashboardEditorProps) {
  const newsletter = draft.newsletter ?? defaultNewsletter

  const updateNewsletter = (value: Newsletter) => {
    updateField('newsletter', value)
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Configure the newsletter signup section and provider details.
      </p>
      <div className="editor-actions">
        {draft.newsletter ? (
          <button
            className="editor-button"
            type="button"
            onClick={() => updateField('newsletter', undefined)}
          >
            Remove newsletter section
          </button>
        ) : (
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() => updateField('newsletter', defaultNewsletter)}
          >
            Add newsletter section
          </button>
        )}
      </div>
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="newsletter-headline">Headline</label>
          <input
            id="newsletter-headline"
            value={newsletter.headline ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                headline: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="newsletter-provider">Provider</label>
          <select
            id="newsletter-provider"
            value={newsletter.provider ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                provider:
                  optionalString(event.target.value) as Newsletter['provider'],
              })
            }
          >
            <option value="">None</option>
            {providerOptions.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="newsletter-subheadline">Subheadline</label>
          <input
            id="newsletter-subheadline"
            value={newsletter.subheadline ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                subheadline: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="newsletter-background">Background image path</label>
          <input
            id="newsletter-background"
            value={newsletter.backgroundImage ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                backgroundImage: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="newsletter-url">External signup URL</label>
          <input
            id="newsletter-url"
            value={newsletter.externalSignupUrl ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                externalSignupUrl: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field editor-field--wide">
          <label htmlFor="newsletter-embed">Embed code</label>
          <textarea
            id="newsletter-embed"
            value={newsletter.embedCode ?? ''}
            onChange={(event) =>
              updateNewsletter({
                ...newsletter,
                embedCode: optionalString(event.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

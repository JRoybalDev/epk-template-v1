import type { EPK, NewsletterField } from '../../../../../packages/schema'
import { ConfirmButton } from './ConfirmButton'
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

const newsletterFieldOptions: Array<{
  key: NewsletterField
  label: string
  required?: boolean
}> = [
  { key: 'email', label: 'Email address', required: true },
  { key: 'firstName', label: 'First name' },
  { key: 'postalCode', label: 'Postal code' },
  { key: 'country', label: 'Country' },
]

const defaultNewsletter: Newsletter = {
  headline: 'Stay in the loop',
  subheadline: '',
  backgroundImage: '',
  embedCode: '',
  formFields: ['email'],
  provider: undefined,
  signupMode: 'native',
}

export function NewsletterEditor({ draft, updateField }: DashboardEditorProps) {
  const newsletter = draft.newsletter ?? defaultNewsletter
  const signupMode =
    newsletter.signupMode ?? (newsletter.embedCode ? 'embed' : 'native')

  const updateNewsletter = (value: Newsletter) => {
    updateField('newsletter', value)
  }

  const selectedFields = new Set(newsletter.formFields ?? ['email'])

  const updateFormField = (field: NewsletterField, isSelected: boolean) => {
    const nextFields = new Set(newsletter.formFields ?? ['email'])

    nextFields.add('email')

    if (field !== 'email') {
      if (isSelected) {
        nextFields.add(field)
      } else {
        nextFields.delete(field)
      }
    }

    updateNewsletter({
      ...newsletter,
      formFields: newsletterFieldOptions
        .map((option) => option.key)
        .filter((key) => nextFields.has(key)),
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Configure the newsletter signup section and provider details.
      </p>
      <div className="editor-actions">
        {draft.newsletter ? (
          <ConfirmButton
            confirmLabel="Confirm remove section?"
            label="Remove newsletter section"
            onConfirm={() => updateField('newsletter', undefined)}
          />
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
        <div className="editor-field editor-field--wide">
          <label>Signup method</label>
          <div
            className={`editor-segmented editor-segmented--${signupMode}`}
            role="radiogroup"
            aria-label="Newsletter signup method"
          >
            <span className="editor-segmented__thumb" aria-hidden="true" />
            <label className="editor-segmented__option">
              <input
                checked={signupMode === 'native'}
                name="newsletter-signup-mode"
                type="radio"
                value="native"
                onChange={() =>
                  updateNewsletter({
                    ...newsletter,
                    signupMode: 'native',
                  })
                }
              />
              <span>Native form fields</span>
            </label>
            <label className="editor-segmented__option">
              <input
                checked={signupMode === 'embed'}
                name="newsletter-signup-mode"
                type="radio"
                value="embed"
                onChange={() =>
                  updateNewsletter({
                    ...newsletter,
                    signupMode: 'embed',
                  })
                }
              />
              <span>Embed code</span>
            </label>
          </div>
        </div>
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
        {signupMode === 'embed' && (
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
        )}
      </div>
      {signupMode === 'native' && (
        <section className="editor-item" aria-labelledby="newsletter-fields-title">
          <div className="editor-item__header">
            <h3 id="newsletter-fields-title">Native form fields</h3>
          </div>
          <p className="editor-note">
            Email address is always required.
          </p>
          <div className="editor-check-list">
            {newsletterFieldOptions.map((field) => (
              <label className="editor-check" key={field.key}>
                <input
                  checked={field.required || selectedFields.has(field.key)}
                  disabled={field.required}
                  type="checkbox"
                  onChange={(event) =>
                    updateFormField(field.key, event.target.checked)
                  }
                />
                <span>{field.label}{field.required ? ' (required)' : ''}</span>
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

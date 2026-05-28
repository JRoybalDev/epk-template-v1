import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import type { NewsletterField } from '../../../../../packages/schema'

const newsletterFieldLabels: Record<NewsletterField, string> = {
  email: 'Email address',
  firstName: 'First name',
  postalCode: 'Postal code',
  country: 'Country',
}

const newsletterFieldTypes: Record<NewsletterField, string> = {
  email: 'email',
  firstName: 'text',
  postalCode: 'text',
  country: 'text',
}

const newsletterFieldNames: Record<NewsletterField, string> = {
  email: 'email',
  firstName: 'first_name',
  postalCode: 'postal_code',
  country: 'country',
}

const getNewsletterFields = (fields?: NewsletterField[]) => [
  'email' as NewsletterField,
  ...((fields ?? []).filter((field) => field !== 'email')),
]

export function NewsletterSection() {
  const { epk } = useEPKOutlet()
  const newsletter = epk.newsletter
  const formFields = getNewsletterFields(newsletter?.formFields)
  const signupMode =
    newsletter?.signupMode ?? (newsletter?.embedCode ? 'embed' : 'native')

  return (
    <section data-section="newsletter">
      <div data-field="newsletter">
        <p>Newsletter</p>
        <h1>{newsletter?.headline || 'Stay connected'}</h1>
        {newsletter?.subheadline && <p>{newsletter.subheadline}</p>}
        {signupMode === 'embed' && newsletter?.embedCode && (
          <div data-field="newsletterEmbed" dangerouslySetInnerHTML={{ __html: newsletter.embedCode }} />
        )}
        {newsletter && signupMode === 'native' && (
          <form
            action={newsletter.externalSignupUrl}
            data-form="newsletter"
            method="post"
            onSubmit={(event) => {
              if (!newsletter.externalSignupUrl) {
                event.preventDefault()
              }
            }}
          >
            {formFields.map((field) => (
              <label key={field}>
                <span>{newsletterFieldLabels[field]}</span>
                <input
                  autoComplete={field === 'email' ? 'email' : undefined}
                  name={newsletterFieldNames[field]}
                  required={field === 'email'}
                  type={newsletterFieldTypes[field]}
                />
              </label>
            ))}
            <button type="submit">Sign up</button>
          </form>
        )}
        {signupMode === 'embed' && newsletter?.externalSignupUrl && (
          <a href={newsletter.externalSignupUrl}>Sign up</a>
        )}
        {newsletter && signupMode === 'embed' && !newsletter.embedCode && !newsletter.externalSignupUrl && (
          <p>Newsletter embed code has not been configured yet.</p>
        )}
        {!newsletter && (
          <p>Newsletter signup has not been configured yet.</p>
        )}
      </div>
    </section>
  )
}

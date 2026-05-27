import { useEPKOutlet } from '../../hooks/useEPKOutlet'

export function NewsletterSection() {
  const { epk } = useEPKOutlet()
  const newsletter = epk.newsletter

  return (
    <section data-section="newsletter">
      <div data-field="newsletter">
        <p>Newsletter</p>
        <h1>{newsletter?.headline || 'Stay connected'}</h1>
        {newsletter?.subheadline && <p>{newsletter.subheadline}</p>}
        {newsletter?.embedCode && (
          <div data-field="newsletterEmbed" dangerouslySetInnerHTML={{ __html: newsletter.embedCode }} />
        )}
        {newsletter?.externalSignupUrl && <a href={newsletter.externalSignupUrl}>Sign up</a>}
        {!newsletter?.embedCode && !newsletter?.externalSignupUrl && (
          <p>Newsletter signup has not been configured yet.</p>
        )}
      </div>
    </section>
  )
}

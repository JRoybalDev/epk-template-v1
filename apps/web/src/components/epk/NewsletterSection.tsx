import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function NewsletterSection() {
  const { epk } = useEPKOutlet()
  const newsletter = epk.newsletter

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="newsletter-panel">
          <p className="epk-section__eyebrow">Newsletter</p>
          <h1>{newsletter?.headline || 'Stay connected'}</h1>
          {newsletter?.subheadline && <p className="epk-section__lede">{newsletter.subheadline}</p>}
          {newsletter?.externalSignupUrl ? (
            <a className="epk-button" href={newsletter.externalSignupUrl}>Sign up</a>
          ) : (
            <p className="epk-muted">Newsletter signup has not been configured yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

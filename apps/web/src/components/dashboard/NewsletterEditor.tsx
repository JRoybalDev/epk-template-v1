import { JsonEditor } from './JsonEditor'
import type { DashboardEditorProps } from './types'

export function NewsletterEditor(props: DashboardEditorProps) {
  return (
    <JsonEditor
      {...props}
      description="Configure the newsletter signup section and provider details."
      emptyState="Use an external signup URL for the simplest setup, or paste a provider embed when the artist needs an inline form."
      example={{
        headline: 'Stay in the loop',
        subheadline: 'Get new music and tour dates first.',
        backgroundImage: '/uploads/site/assets/newsletter-bg.jpg',
        externalSignupUrl: 'https://example.com/newsletter',
        provider: 'mailchimp',
      }}
      field="newsletter"
      label="Newsletter"
    />
  )
}

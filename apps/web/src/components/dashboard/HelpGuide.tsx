import { Link } from 'react-router-dom'
import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

const helpSteps = [
  {
    caption: 'Site setup',
    title: 'Start with identity and navigation',
    body: 'Set the public sections, home page order, brand colors, fonts, favicon, and social preview metadata first. This gives every later content section the right frame.',
    links: [
      ['Navigation', '/dashboard/nav'],
      ['Layout', '/dashboard/layout'],
      ['Branding', '/dashboard/branding'],
      ['Fonts', '/dashboard/fonts'],
      ['Metadata', '/dashboard/metadata'],
    ],
  },
  {
    caption: 'Core content',
    title: 'Add the artist story and campaign content',
    body: 'Build the home page, releases, videos, tour dates, bio, contact details, and footer links. These are the primary sections most visitors will use.',
    links: [
      ['Home', '/dashboard/home'],
      ['Music', '/dashboard/music'],
      ['Videos', '/dashboard/videos'],
      ['Tour', '/dashboard/tour'],
      ['About', '/dashboard/about'],
      ['Contact', '/dashboard/contact'],
      ['Footer', '/dashboard/footer'],
    ],
  },
  {
    caption: 'Offers',
    title: 'Connect VIP, shop, and newsletter flows',
    body: 'Create reusable VIP packages before assigning them to tour dates. Add merch links and newsletter settings only when those destinations are ready.',
    links: [
      ['VIP', '/dashboard/vip'],
      ['Tour', '/dashboard/tour'],
      ['Shop', '/dashboard/shop'],
      ['Newsletter', '/dashboard/newsletter'],
    ],
  },
  {
    caption: 'Assets and backup',
    title: 'Upload media and keep a JSON copy',
    body: 'Use Assets for local uploads, then paste returned paths into image, logo, favicon, font, and download fields. Export the final EPK JSON before handoff.',
    links: [
      ['Assets', '/dashboard/assets'],
      ['JSON', '/dashboard/json'],
    ],
  },
  {
    caption: 'Review',
    title: 'Preview, save, and verify',
    body: 'Use View EPK to check the public site, then save once validation passes. Review mobile, desktop, links, metadata, uploaded media, and any date-specific VIP package URLs.',
    links: [
      ['View EPK', '/'],
      ['Metadata', '/dashboard/metadata'],
      ['Tour', '/dashboard/tour'],
    ],
  },
]

export function HelpGuide({ draft }: DashboardEditorProps) {
  const hasVipPackages = (draft.vip?.items ?? []).length > 0
  const tourDatesWithVip = draft.tour.dates.filter(
    (date) => (date.vipPackages?.length ?? date.vipPackageIds?.length ?? 0) > 0,
  ).length
  const uploadedMediaHints = [
    draft.metadata?.socialImage,
    draft.branding.logoImage,
    draft.branding.faviconPath,
    draft.home.featuredRelease.coverImage,
  ].filter(Boolean).length

  return (
    <div className="editor-form">
      <section className="editor-section" aria-labelledby="help-guide-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Help</span>
            <h3 id="help-guide-title">EPK setup guide</h3>
            <p>
              Follow this flow when building a new artist EPK. Each step links to
              the dashboard section where that work happens.
            </p>
          </div>
        </div>
        <div className="editor-help-grid">
          <article className="editor-subsection">
            <div className="editor-subsection__header">
              <h4>Current draft</h4>
              <p>{draft.artistName || 'Artist name has not been set yet.'}</p>
            </div>
            <dl className="editor-help-stats">
              <div>
                <dt>Navigation sections</dt>
                <dd>{draft.nav.length}</dd>
              </div>
              <div>
                <dt>Releases</dt>
                <dd>{draft.music.releases.length}</dd>
              </div>
              <div>
                <dt>Tour dates</dt>
                <dd>{draft.tour.dates.length}</dd>
              </div>
              <div>
                <dt>VIP packages</dt>
                <dd>{draft.vip?.items?.length ?? 0}</dd>
              </div>
              <div>
                <dt>Dates with VIP</dt>
                <dd>{tourDatesWithVip}</dd>
              </div>
              <div>
                <dt>Key media fields</dt>
                <dd>{uploadedMediaHints}/4</dd>
              </div>
            </dl>
            {!hasVipPackages && (
              <p className="editor-note">
                Create VIP packages before assigning VIP offers to individual tour
                dates.
              </p>
            )}
          </article>
          <div className="editor-help-steps">
            {helpSteps.map((step, index) => (
              <article className="editor-subsection" key={step.title}>
                <div className="editor-subsection__header">
                  <span className="editor-section__eyebrow">
                    {index + 1}. {step.caption}
                  </span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
                <div className="editor-actions">
                  {step.links.map(([label, to]) => (
                    <Link
                      className="editor-button"
                      key={`${step.title}-${label}`}
                      target={to === '/' ? '_blank' : undefined}
                      to={to}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

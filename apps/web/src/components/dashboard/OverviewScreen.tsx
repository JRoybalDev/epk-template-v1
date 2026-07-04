import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  FiCalendar,
  FiFileText,
  FiFlag,
  FiHome,
  FiLayers,
  FiMail,
  FiMusic,
  FiSend,
  FiShoppingBag,
  FiStar,
  FiUser,
  FiVideo,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import type { CompletenessSectionId, EPKCompleteness } from '../../utils/epkCompleteness'
import './OverviewScreen.css'

type OverviewScreenProps = {
  artistName: string
  completeness: EPKCompleteness
}

const sectionCards: Array<{
  id: CompletenessSectionId
  icon: IconType
  desc: string
}> = [
  { id: 'home', icon: FiHome, desc: 'The featured release, video, and announcement bar.' },
  { id: 'music', icon: FiMusic, desc: 'Releases with streaming links and cover art.' },
  { id: 'videos', icon: FiVideo, desc: 'YouTube music videos and live sessions.' },
  { id: 'tour', icon: FiCalendar, desc: 'Shows, ticket links, and VIP upgrades.' },
  { id: 'vip', icon: FiStar, desc: 'On-site VIP packages or an external store link.' },
  { id: 'shop', icon: FiShoppingBag, desc: 'Merch cards or a linked storefront.' },
  { id: 'about', icon: FiUser, desc: 'Bio, genres, awards, and press quotes.' },
  { id: 'newsletter', icon: FiSend, desc: 'A signup form or an embedded provider form.' },
  { id: 'contact', icon: FiMail, desc: 'Booking, press, and management emails.' },
  { id: 'footer', icon: FiFlag, desc: 'Socials, legal links, and copyright.' },
  { id: 'branding', icon: FiLayers, desc: 'Artist name, accent color, and font style.' },
  { id: 'metadata', icon: FiFileText, desc: 'Browser title, share description, and preview.' },
]

const sectionLabels: Record<CompletenessSectionId, string> = {
  home: 'Home',
  music: 'Music',
  videos: 'Videos',
  tour: 'Tour',
  vip: 'VIP',
  shop: 'Shop',
  about: 'About',
  newsletter: 'Newsletter',
  contact: 'Contact',
  footer: 'Footer',
  branding: 'Branding',
  metadata: 'Metadata',
}

const statusLabels: Record<'ready' | 'attention' | 'empty', string> = {
  ready: 'Ready',
  attention: 'Needs info',
  empty: 'Not started',
}

export function OverviewScreen({ artistName, completeness }: OverviewScreenProps) {
  const { percent, readyCount, requiredCount, attentionCount, checklist } = completeness
  const ringDeg = `${percent * 3.6}deg`

  return (
    <div className="overview-screen">
      <div className="overview-screen__header">
        <div>
          <p className="overview-screen__greeting">Welcome back</p>
          <h1>Your press kit at a glance</h1>
        </div>
        <span className="overview-screen__draft-pill">
          <span className="overview-screen__draft-dot" aria-hidden="true" />
          Draft &middot; not published
        </span>
      </div>

      <div className="overview-screen__top-row">
        <section className="overview-card overview-card--completeness">
          <div className="overview-completeness-ring" style={{ '--ring-deg': ringDeg } as CSSProperties}>
            <div className="overview-completeness-ring__inner">
              <span className="overview-completeness-ring__percent">{percent}%</span>
              <span className="overview-completeness-ring__label">ready</span>
            </div>
          </div>
          <div className="overview-card--completeness__copy">
            <h3>{percent === 100 ? "You're all set" : 'Almost there'}</h3>
            <p>
              {readyCount} of {requiredCount} required sections are ready.
              {attentionCount > 0
                ? ` Finish the ${attentionCount} item${attentionCount === 1 ? '' : 's'} below to publish your site.`
                : ' Everything optional is up to you.'}
            </p>
            {checklist[0] && (
              <Link className="overview-card__button" to={`/dashboard/${checklist[0].id}`}>
                Finish setup
              </Link>
            )}
          </div>
        </section>

        <section className="overview-card overview-card--structure">
          <div className="overview-card__header">
            <span className="overview-card__eyebrow">Site structure</span>
            <span className="overview-card__muted">Home</span>
          </div>
          <div className="overview-structure-frame">
            <div className="overview-structure-frame__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="overview-structure-frame__list">
              <div className="overview-structure-row">
                <span>Hero / Spotlight</span>
                <code>hero</code>
              </div>
              <div className="overview-structure-row">
                <span>Announcement bar</span>
                <code>announce</code>
              </div>
              <div className="overview-structure-row">
                <span>Music grid</span>
                <code>music</code>
              </div>
              <div className="overview-structure-row">
                <span>Tour dates</span>
                <code>tour</code>
              </div>
            </div>
          </div>
          <div className="overview-card__footer">
            <p>Structure only &mdash; final design comes from your built frontend.</p>
            <Link className="overview-card__button overview-card__button--ghost" to="/dashboard/canvas">
              Open Live Canvas
            </Link>
          </div>
        </section>
      </div>

      {checklist.length > 0 && (
        <section className="overview-card overview-checklist">
          <h3>Finish setting up</h3>
          <p>Items still missing across your kit. Click one to jump straight there.</p>
          <div className="overview-checklist__items">
            {checklist.map((task) => (
              <Link className="overview-checklist__item" key={task.id} to={`/dashboard/${task.id}`}>
                <span className="overview-checklist__flag" aria-hidden="true">!</span>
                <span className="overview-checklist__text">
                  <span className="overview-checklist__title">{task.title}</span>
                  <span className="overview-checklist__where">{task.where}</span>
                </span>
                <span className="overview-checklist__chevron" aria-hidden="true">&rsaquo;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="overview-screen__section-label">All sections</p>
      <div className="overview-grid">
        {sectionCards.map((card) => {
          const status = completeness.statuses[card.id]

          return (
            <Link className="overview-section-card" key={card.id} to={`/dashboard/${card.id}`}>
              <div className="overview-section-card__top">
                <span className="overview-section-card__icon">
                  <card.icon />
                </span>
                <span className={`overview-section-card__status overview-section-card__status--${status}`}>
                  <span className="overview-section-card__status-dot" aria-hidden="true" />
                  {statusLabels[status]}
                </span>
              </div>
              <div>
                <div className="overview-section-card__label">{sectionLabels[card.id]}</div>
                <div className="overview-section-card__desc">{card.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="overview-screen__footnote">Editing for {artistName}</p>
    </div>
  )
}

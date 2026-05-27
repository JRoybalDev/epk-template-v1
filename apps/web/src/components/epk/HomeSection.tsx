import { Link } from 'react-router-dom'
import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { AboutSection } from './AboutSection'
import { FallbackImage } from './FallbackImage'
import { MusicGrid } from './MusicGrid'
import { NewsletterSection } from './NewsletterSection'
import { ShopGrid } from './ShopGrid'
import { TourList } from './TourList'
import { VIPPage } from './VIPPage'
import { VideoGrid } from './VideoGrid'

type HomeSectionKey =
  | 'music'
  | 'videos'
  | 'shop'
  | 'tour'
  | 'vip'
  | 'about'
  | 'newsletter'
  | 'contact'

const getYouTubeVideoId = (value?: string) => {
  if (!value) return ''

  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return url.pathname.replace(/^\//, '')
    if (url.searchParams.get('v')) return url.searchParams.get('v') ?? ''
    const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/)
    return embedMatch?.[1] ?? ''
  } catch {
    return value
  }
}

const renderHomeSection = (section: HomeSectionKey) => {
  switch (section) {
    case 'music':
      return <MusicGrid />
    case 'videos':
      return <VideoGrid />
    case 'shop':
      return <ShopGrid />
    case 'tour':
      return <TourList />
    case 'vip':
      return <VIPPage />
    case 'about':
      return <AboutSection />
    case 'newsletter':
      return <NewsletterSection />
    case 'contact':
      return <HomeContactSection />
    default:
      return null
  }
}

function HomeContactSection() {
  const { epk } = useEPKOutlet()

  return (
    <section data-section="contact">
      <header>
        <p>Contact</p>
        <h1>Contact</h1>
      </header>
      <div data-list="contacts">
        <a href={`mailto:${epk.contact.bookingEmail}`}>Booking</a>
        {epk.contact.pressEmail && <a href={`mailto:${epk.contact.pressEmail}`}>Press</a>}
        {epk.contact.managementEmail && (
          <a href={`mailto:${epk.contact.managementEmail}`}>Management</a>
        )}
        {epk.contact.syncEmail && <a href={`mailto:${epk.contact.syncEmail}`}>Sync</a>}
      </div>
    </section>
  )
}

export function HomeSection() {
  const { epk } = useEPKOutlet()
  const release = epk.home.featuredRelease
  const hasMusicContent = epk.music.releases.length > 0
  const canLinkToMusic = epk.nav.includes('music') && hasMusicContent
  const sectionsOnHome = [
    ...new Set<HomeSectionKey>([
      ...(epk.home.sectionsOnHome ?? []),
      ...(epk.home.showTourDatesOnHome ? ['tour' as HomeSectionKey] : []),
    ]),
  ]
  const featuredVideoUrl = epk.home.featuredVideo?.url ?? epk.home.featuredVideoUrl
  const featuredVideoId =
    epk.home.featuredVideo?.youtubeVideoId ?? getYouTubeVideoId(featuredVideoUrl)
  const matchingFeaturedVideo = epk.videos.find(
    (video) => video.youtubeVideoId === featuredVideoId,
  )
  const featuredVideo = {
    url: featuredVideoUrl,
    title: epk.home.featuredVideo?.title || matchingFeaturedVideo?.title,
    channelName:
      epk.home.featuredVideo?.channelName || matchingFeaturedVideo?.channelName,
    publishedDate:
      epk.home.featuredVideo?.publishedDate || matchingFeaturedVideo?.publishedDate,
  }

  return (
    <section data-section="home">
      <div data-field="featuredRelease">
        <header>
          <h1>{release.title}</h1>
          <p>{release.subtitle}</p>
          {release.smartLinkUrl && <a href={release.smartLinkUrl}>Listen now</a>}
          {canLinkToMusic && <Link to="/music">Music</Link>}
        </header>
        {release.coverImage && (
          <FallbackImage
            alt={`${release.title} cover`}
            fallbackLabel="Release art"
            src={release.coverImage}
          />
        )}
      </div>
      {epk.home.announcement && (
        <section data-section="home-announcement">
          <p>{epk.home.announcement.text}</p>
          {epk.home.announcement.linkUrl && (
            <a href={epk.home.announcement.linkUrl}>
              {epk.home.announcement.linkLabel || 'Learn more'}
            </a>
          )}
        </section>
      )}
      {featuredVideo.url && (
        <section data-section="home-featured-video">
          <a href={featuredVideo.url}>{featuredVideo.title || 'Featured video'}</a>
          {(featuredVideo.channelName || featuredVideo.publishedDate) && (
            <p>
              {[featuredVideo.channelName, featuredVideo.publishedDate]
                .filter(Boolean)
                .join(' / ')}
            </p>
          )}
        </section>
      )}
      {sectionsOnHome.map((section) => (
        <div data-home-section={section} key={section}>
          {renderHomeSection(section)}
        </div>
      ))}
    </section>
  )
}

import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

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

export function HomeEditor({ draft, updateField }: DashboardEditorProps) {
  const release = draft.home.featuredRelease
  const featuredVideo = draft.home.featuredVideo ?? {
    url: draft.home.featuredVideoUrl ?? '',
    title: undefined,
    youtubeVideoId: undefined,
    channelName: undefined,
    publishedDate: undefined,
  }
  const derivedVideoId =
    featuredVideo.youtubeVideoId || getYouTubeVideoId(featuredVideo.url)
  const matchingVideo = draft.videos.find(
    (video) => video.youtubeVideoId === derivedVideoId,
  )
  const displayedFeaturedVideo = {
    ...featuredVideo,
    youtubeVideoId: featuredVideo.youtubeVideoId || matchingVideo?.youtubeVideoId,
    title: featuredVideo.title || matchingVideo?.title,
    channelName: featuredVideo.channelName || matchingVideo?.channelName,
    publishedDate: featuredVideo.publishedDate || matchingVideo?.publishedDate,
  }
  const announcement = draft.home.announcement ?? {
    text: '',
    linkUrl: undefined,
    linkLabel: undefined,
  }

  const updateAnnouncement = (
    value: typeof announcement,
  ) => {
    const shouldKeep =
      value.text.trim().length > 0 ||
      Boolean(value.linkUrl) ||
      Boolean(value.linkLabel)

    updateField('home', {
      ...draft.home,
      announcement: shouldKeep ? value : undefined,
    })
  }

  const updateFeaturedVideo = (value: typeof featuredVideo) => {
    const shouldKeep =
      value.url.trim().length > 0 ||
      Boolean(value.title) ||
      Boolean(value.youtubeVideoId) ||
      Boolean(value.channelName) ||
      Boolean(value.publishedDate)

    updateField('home', {
      ...draft.home,
      featuredVideo: shouldKeep ? value : undefined,
      featuredVideoUrl: shouldKeep ? value.url : undefined,
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Uploaded cover art paths usually look like <code>/uploads/site/assets/file.jpg</code>.
      </p>
      <section className="editor-item" aria-labelledby="featured-release-title">
        <div className="editor-item__header">
          <h3 id="featured-release-title">Featured release</h3>
        </div>
        <div className="editor-grid">
          <div className="editor-field">
            <label htmlFor="release-title">Title</label>
            <input
              id="release-title"
              value={release.title}
              onChange={(event) =>
                updateField('home', {
                  ...draft.home,
                  featuredRelease: { ...release, title: event.target.value },
                })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="release-subtitle">Subtitle</label>
            <input
              id="release-subtitle"
              value={release.subtitle}
              onChange={(event) =>
                updateField('home', {
                  ...draft.home,
                  featuredRelease: { ...release, subtitle: event.target.value },
                })
              }
            />
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="cover-image">Cover image path</label>
            <input
              id="cover-image"
              value={release.coverImage}
              onChange={(event) =>
                updateField('home', {
                  ...draft.home,
                  featuredRelease: { ...release, coverImage: event.target.value },
                })
              }
            />
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="smart-link">Smart link URL</label>
            <input
              id="smart-link"
              value={release.smartLinkUrl ?? ''}
              onChange={(event) =>
                updateField('home', {
                  ...draft.home,
                  featuredRelease: {
                    ...release,
                    smartLinkUrl: optionalString(event.target.value),
                  },
                })
              }
            />
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="direct-stream-link">Direct stream URL</label>
            <input
              id="direct-stream-link"
              value={release.directStreamUrl ?? ''}
              onChange={(event) =>
                updateField('home', {
                  ...draft.home,
                  featuredRelease: {
                    ...release,
                    directStreamUrl: optionalString(event.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </section>
      <section className="editor-item" aria-labelledby="featured-video-title">
        <div className="editor-item__header">
          <h3 id="featured-video-title">Featured video</h3>
          {draft.home.featuredVideo && (
            <button
              className="editor-button"
              type="button"
              onClick={() =>
                updateField('home', {
                  ...draft.home,
                  featuredVideo: undefined,
                  featuredVideoUrl: undefined,
                })
              }
            >
              Clear video
            </button>
          )}
        </div>
        <p className="editor-note">
          Optional metadata falls back to a matching video in the Videos section when the YouTube ID matches.
        </p>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label htmlFor="featured-video-url">Video URL</label>
            <input
              id="featured-video-url"
              value={featuredVideo.url}
              onChange={(event) => {
                const url = event.target.value
                updateFeaturedVideo({
                  ...featuredVideo,
                  url,
                  youtubeVideoId:
                    featuredVideo.youtubeVideoId || optionalString(getYouTubeVideoId(url)),
                })
              }}
            />
          </div>
          <div className="editor-field">
            <label htmlFor="featured-video-id">YouTube video ID</label>
            <input
              id="featured-video-id"
              placeholder={matchingVideo?.youtubeVideoId}
              value={featuredVideo.youtubeVideoId ?? ''}
              onChange={(event) =>
                updateFeaturedVideo({
                  ...featuredVideo,
                  youtubeVideoId: optionalString(event.target.value),
                })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="featured-video-title-field">Title</label>
            <input
              id="featured-video-title-field"
              placeholder={matchingVideo?.title}
              value={featuredVideo.title ?? ''}
              onChange={(event) =>
                updateFeaturedVideo({
                  ...featuredVideo,
                  title: optionalString(event.target.value),
                })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="featured-video-channel">Channel name</label>
            <input
              id="featured-video-channel"
              placeholder={matchingVideo?.channelName}
              value={featuredVideo.channelName ?? ''}
              onChange={(event) =>
                updateFeaturedVideo({
                  ...featuredVideo,
                  channelName: optionalString(event.target.value),
                })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="featured-video-date">Published date</label>
            <input
              id="featured-video-date"
              placeholder={matchingVideo?.publishedDate}
              type="date"
              value={featuredVideo.publishedDate ?? ''}
              onChange={(event) =>
                updateFeaturedVideo({
                  ...featuredVideo,
                  publishedDate: optionalString(event.target.value),
                })
              }
            />
          </div>
        </div>
        {(displayedFeaturedVideo.title || displayedFeaturedVideo.youtubeVideoId) && (
          <p className="editor-note">
            Preview metadata: {displayedFeaturedVideo.title || 'Untitled video'}
            {displayedFeaturedVideo.youtubeVideoId
              ? ` (${displayedFeaturedVideo.youtubeVideoId})`
              : ''}
          </p>
        )}
      </section>
      <section className="editor-item" aria-labelledby="home-announcement-title">
        <div className="editor-item__header">
          <h3 id="home-announcement-title">Announcement</h3>
          {draft.home.announcement && (
            <button
              className="editor-button"
              type="button"
              onClick={() => updateField('home', { ...draft.home, announcement: undefined })}
            >
              Clear announcement
            </button>
          )}
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label htmlFor="announcement-text">Announcement text</label>
            <input
              id="announcement-text"
              value={announcement.text}
              onChange={(event) =>
                updateAnnouncement({ ...announcement, text: event.target.value })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="announcement-link-label">Button label</label>
            <input
              id="announcement-link-label"
              value={announcement.linkLabel ?? ''}
              onChange={(event) =>
                updateAnnouncement({
                  ...announcement,
                  linkLabel: optionalString(event.target.value),
                })
              }
            />
          </div>
          <div className="editor-field">
            <label htmlFor="announcement-link-url">Button URL</label>
            <input
              id="announcement-link-url"
              value={announcement.linkUrl ?? ''}
              onChange={(event) =>
                updateAnnouncement({
                  ...announcement,
                  linkUrl: optionalString(event.target.value),
                })
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

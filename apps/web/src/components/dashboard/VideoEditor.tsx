import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type { Video } from '../../../../../packages/schema'
import { DashboardDateInput } from './DashboardDateInput'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
import { ApiClientError, getYouTubeMetadata } from '../../api/client'
import './DashboardEditors.css'

const videoTypes: Video['type'][] = ['music_video', 'live', 'video', 'scheduled', 'other']

const createVideo = (index: number): Video => ({
  id: createEditorId('video'),
  title: 'New video',
  youtubeVideoId: '',
  type: 'video',
  publishedDate: new Date().toISOString().slice(0, 10),
  isFeatured: false,
  displayOrder: index + 1,
})

const extractYouTubeVideoId = (value: string) => {
  const trimmedValue = value.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedValue)) return trimmedValue

  try {
    const url = new URL(trimmedValue)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (!host.endsWith('youtube.com') && !host.endsWith('youtube-nocookie.com')) {
      return null
    }

    const watchId = url.searchParams.get('v')
    if (watchId) return watchId

    const pathParts = url.pathname.split('/').filter(Boolean)
    const videoPathKeys = new Set(['embed', 'shorts', 'live'])
    const videoPathKeyIndex = pathParts.findIndex((part) => videoPathKeys.has(part))

    return videoPathKeyIndex >= 0 ? pathParts[videoPathKeyIndex + 1] ?? null : null
  } catch {
    return null
  }
}

export function VideoEditor({ draft, updateField }: DashboardEditorProps) {
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoUrlError, setVideoUrlError] = useState('')
  const [isImportingVideo, setIsImportingVideo] = useState(false)
  const videos = draft.videos

  const updateVideo = (id: string, value: Video) => {
    updateField('videos', videos.map((video) => (video.id === id ? value : video)))
  }

  const removeVideo = (id: string) => {
    updateField('videos', videos.filter((item) => item.id !== id))
    setOpenVideoId((current) => (current === id ? null : current))
  }

  const toggleVideo = (id: string) => {
    setOpenVideoId((current) => (current === id ? null : id))
  }

  const addVideo = () => {
    const nextVideo = createVideo(videos.length)

    updateField('videos', [...videos, nextVideo])
    setOpenVideoId(nextVideo.id)
  }

  const addVideoFromUrl = async (value: string) => {
    const youtubeVideoId = extractYouTubeVideoId(value)

    if (!youtubeVideoId) {
      setVideoUrlError('Paste a valid YouTube URL or 11-character video ID.')
      return
    }

    const existingVideo = videos.find((video) => video.youtubeVideoId === youtubeVideoId)
    if (existingVideo) {
      setOpenVideoId(existingVideo.id)
      setVideoUrl('')
      setVideoUrlError('That video is already in the list.')
      return
    }

    setIsImportingVideo(true)
    setVideoUrlError('')

    try {
      const metadata = await getYouTubeMetadata(value)
      const nextVideo: Video = {
        ...createVideo(videos.length),
        ...metadata,
        id: createEditorId(`video-${metadata.youtubeVideoId}`),
        isFeatured: false,
        displayOrder: videos.length + 1,
      }

      updateField('videos', [...videos, nextVideo])
      setOpenVideoId(nextVideo.id)
      setVideoUrl('')
      setVideoUrlError('')
    } catch (error) {
      const nextVideo: Video = {
        ...createVideo(videos.length),
        id: createEditorId(`video-${youtubeVideoId}`),
        title: `YouTube video ${youtubeVideoId}`,
        youtubeVideoId,
      }

      updateField('videos', [...videos, nextVideo])
      setOpenVideoId(nextVideo.id)
      setVideoUrl('')
      const errorMessage =
        error instanceof ApiClientError && error.status === 404
          ? 'Video added, but metadata could not be loaded because the API server needs to be restarted.'
          : error instanceof Error
            ? `Video added, but metadata could not be loaded: ${error.message}`
            : 'Video added, but metadata could not be loaded.'

      setVideoUrlError(errorMessage)
    } finally {
      setIsImportingVideo(false)
    }
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Paste a YouTube URL to create a video automatically, or add one manually.
      </p>
      <div className="editor-item">
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label htmlFor="video-url-import">YouTube video URL or ID</label>
            <input
              id="video-url-import"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={videoUrl}
              onChange={(event) => {
                setVideoUrl(event.target.value)
                setVideoUrlError('')
              }}
              onPaste={(event) => {
                const pastedValue = event.clipboardData.getData('text')

                if (extractYouTubeVideoId(pastedValue)) {
                  event.preventDefault()
                  void addVideoFromUrl(pastedValue)
                }
              }}
            />
          </div>
        </div>
        <div className="editor-actions">
          <button
            className="editor-button editor-button--primary"
            disabled={isImportingVideo}
            type="button"
            onClick={() => void addVideoFromUrl(videoUrl)}
          >
            {isImportingVideo ? 'Importing...' : 'Import video'}
          </button>
        </div>
        {videoUrlError && <p className="editor-error">{videoUrlError}</p>}
      </div>
      <div className="editor-list">
        {videos.map((video, index) => {
          const isOpen = openVideoId === video.id
          const videoTitle = video.title || `Video ${index + 1}`
          const videoMeta = [
            video.type,
            video.publishedDate,
            video.channelName,
          ].filter(Boolean).join(' · ')

          return (
            <article
              className={[
                'editor-item',
                'editor-collapse',
                isOpen ? 'editor-collapse--open' : '',
              ].filter(Boolean).join(' ')}
              key={video.id}
            >
              <button
                aria-controls={`${video.id}-video-settings`}
                aria-expanded={isOpen}
                className="editor-collapse__trigger"
                type="button"
                onClick={() => toggleVideo(video.id)}
              >
                <span>
                  {videoTitle}
                  <small>{videoMeta}</small>
                </span>
                <FiChevronDown aria-hidden="true" />
              </button>
              {isOpen && (
                <div
                  className="editor-collapse__content"
                  id={`${video.id}-video-settings`}
                >
                  <div className="editor-item__header">
                    <h3>{videoTitle}</h3>
                    <button
                      className="editor-button"
                      type="button"
                      onClick={() => removeVideo(video.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${video.id}-id`}>ID</RequiredLabel>
                      <input
                        id={`${video.id}-id`}
                        value={video.id}
                        onChange={(event) =>
                          updateVideo(video.id, { ...video, id: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${video.id}-title`}>Title</RequiredLabel>
                      <input
                        id={`${video.id}-title`}
                        value={video.title}
                        onChange={(event) =>
                          updateVideo(video.id, { ...video, title: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${video.id}-youtube`}>YouTube video ID</RequiredLabel>
                      <input
                        id={`${video.id}-youtube`}
                        value={video.youtubeVideoId}
                        onChange={(event) =>
                          updateVideo(video.id, {
                            ...video,
                            youtubeVideoId: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${video.id}-channel`}>Channel name</label>
                      <input
                        id={`${video.id}-channel`}
                        value={video.channelName ?? ''}
                        onChange={(event) =>
                          updateVideo(video.id, {
                            ...video,
                            channelName: optionalString(event.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${video.id}-type`}>Type</RequiredLabel>
                      <select
                        id={`${video.id}-type`}
                        value={video.type}
                        onChange={(event) =>
                          updateVideo(video.id, {
                            ...video,
                            type: event.target.value as Video['type'],
                          })
                        }
                      >
                        {videoTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${video.id}-date`}>Published date</RequiredLabel>
                      <DashboardDateInput
                        id={`${video.id}-date`}
                        value={video.publishedDate}
                        onChange={(value) =>
                          updateVideo(video.id, {
                            ...video,
                            publishedDate: value,
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${video.id}-order`}>Display order</label>
                      <input
                        id={`${video.id}-order`}
                        type="number"
                        value={video.displayOrder ?? index + 1}
                        onChange={(event) =>
                          updateVideo(video.id, {
                            ...video,
                            displayOrder: Number(event.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="editor-check-list">
                    <label className="editor-check">
                      <input
                        checked={video.isFeatured}
                        type="checkbox"
                        onChange={(event) =>
                          updateVideo(video.id, {
                            ...video,
                            isFeatured: event.target.checked,
                          })
                        }
                      />
                      <span>Featured video</span>
                    </label>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          type="button"
          onClick={addVideo}
        >
          Add video
        </button>
      </div>
    </div>
  )
}

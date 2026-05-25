import type { Video } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
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

export function VideoEditor({ draft, updateField }: DashboardEditorProps) {
  const videos = draft.videos

  const updateVideo = (id: string, value: Video) => {
    updateField('videos', videos.map((video) => (video.id === id ? value : video)))
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Add YouTube videos by ID. For <code>youtube.com/watch?v=dQw4w9WgXcQ</code>,
        use <code>dQw4w9WgXcQ</code>.
      </p>
      <div className="editor-list">
        {videos.map((video, index) => (
          <article className="editor-item" key={video.id}>
            <div className="editor-item__header">
              <h3>{video.title || `Video ${index + 1}`}</h3>
              <button
                className="editor-button"
                type="button"
                onClick={() =>
                  updateField('videos', videos.filter((item) => item.id !== video.id))
                }
              >
                Remove
              </button>
            </div>
            <div className="editor-grid">
              <div className="editor-field">
                <label htmlFor={`${video.id}-title`}>Title</label>
                <input
                  id={`${video.id}-title`}
                  value={video.title}
                  onChange={(event) =>
                    updateVideo(video.id, { ...video, title: event.target.value })
                  }
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${video.id}-youtube`}>YouTube video ID</label>
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
                <label htmlFor={`${video.id}-type`}>Type</label>
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
                <label htmlFor={`${video.id}-date`}>Published date</label>
                <input
                  id={`${video.id}-date`}
                  type="date"
                  value={video.publishedDate}
                  onChange={(event) =>
                    updateVideo(video.id, {
                      ...video,
                      publishedDate: event.target.value,
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
            <label className="editor-check">
              <input
                checked={video.isFeatured}
                type="checkbox"
                onChange={(event) =>
                  updateVideo(video.id, { ...video, isFeatured: event.target.checked })
                }
              />
              <span>Featured video</span>
            </label>
          </article>
        ))}
      </div>
      <div className="editor-actions">
        <button
          className="editor-button editor-button--primary"
          type="button"
          onClick={() => updateField('videos', [...videos, createVideo(videos.length)])}
        >
          Add video
        </button>
      </div>
    </div>
  )
}

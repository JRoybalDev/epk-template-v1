import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

export function FooterEditor({ draft, updateField }: DashboardEditorProps) {
  const updateSocial = (
    key: keyof typeof draft.footer.socials,
    value: string,
  ) =>
    updateField('footer', {
      ...draft.footer,
      socials: {
        ...draft.footer.socials,
        [key]: value,
      },
    })

  return (
    <div className="editor-form">
      <div className="editor-field">
        <label htmlFor="copyright-name">Copyright name</label>
        <input
          id="copyright-name"
          value={draft.footer.copyrightName}
          onChange={(event) =>
            updateField('footer', {
              ...draft.footer,
              copyrightName: event.target.value,
            })
          }
        />
      </div>
      <div className="editor-grid">
        <div className="editor-field">
          <label htmlFor="instagram">Instagram URL</label>
          <input
            id="instagram"
            value={draft.footer.socials.instagram ?? ''}
            onChange={(event) => updateSocial('instagram', event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="youtube">YouTube URL</label>
          <input
            id="youtube"
            value={draft.footer.socials.youtube ?? ''}
            onChange={(event) => updateSocial('youtube', event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="spotify">Spotify URL</label>
          <input
            id="spotify"
            value={draft.footer.socials.spotify ?? ''}
            onChange={(event) => updateSocial('spotify', event.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="website">Website URL</label>
          <input
            id="website"
            value={draft.footer.socials.website ?? ''}
            onChange={(event) => updateSocial('website', event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

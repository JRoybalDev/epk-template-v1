import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

type VIP = NonNullable<EPK['vip']>

const defaultVip: VIP = {
  externalStoreUrl: 'https://example.com/vip',
  headline: 'VIP Upgrades',
  description: '',
  redirectOnly: false,
}

export function VIPEditor({ draft, updateField }: DashboardEditorProps) {
  const vip = draft.vip ?? defaultVip

  const updateVip = (value: VIP) => {
    updateField('vip', value)
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Configure the global VIP store and optional public VIP page copy.
      </p>
      <div className="editor-actions">
        {draft.vip ? (
          <button
            className="editor-button"
            type="button"
            onClick={() => updateField('vip', undefined)}
          >
            Remove VIP section
          </button>
        ) : (
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={() => updateField('vip', defaultVip)}
          >
            Add VIP section
          </button>
        )}
      </div>
      <div className="editor-grid">
        <div className="editor-field editor-field--wide">
          <label htmlFor="vip-url">External store URL</label>
          <input
            id="vip-url"
            value={vip.externalStoreUrl}
            onChange={(event) =>
              updateVip({ ...vip, externalStoreUrl: event.target.value })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="vip-headline">Headline</label>
          <input
            id="vip-headline"
            value={vip.headline ?? ''}
            onChange={(event) =>
              updateVip({ ...vip, headline: optionalString(event.target.value) })
            }
          />
        </div>
        <label className="editor-check">
          <input
            checked={vip.redirectOnly}
            type="checkbox"
            onChange={(event) =>
              updateVip({ ...vip, redirectOnly: event.target.checked })
            }
          />
          <span>Redirect directly to external VIP store</span>
        </label>
        <div className="editor-field editor-field--wide">
          <label htmlFor="vip-description">Description</label>
          <textarea
            id="vip-description"
            value={vip.description ?? ''}
            onChange={(event) =>
              updateVip({ ...vip, description: optionalString(event.target.value) })
            }
          />
        </div>
      </div>
    </div>
  )
}

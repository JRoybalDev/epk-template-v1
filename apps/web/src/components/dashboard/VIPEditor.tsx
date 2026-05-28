import type { EPK, VIPItem } from '../../../../../packages/schema'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString, parseCommaList } from './types'
import './DashboardEditors.css'

type VIP = NonNullable<EPK['vip']>

const defaultVip: VIP = {
  externalStoreUrl: 'https://example.com/vip',
  headline: 'VIP Upgrades',
  description: '',
  items: [],
  redirectOnly: false,
}

const createVipItem = (): VIPItem => ({
  id: createEditorId('vip'),
  name: 'New VIP package',
  price: '100.00',
  currency: 'USD',
  description: '',
  purchaseUrl: 'https://example.com/vip/package',
  features: [],
  isFeatured: true,
})

export function VIPEditor({ draft, updateField }: DashboardEditorProps) {
  const vip = draft.vip ?? defaultVip
  const items = vip.items ?? []
  const listingMode = vip.redirectOnly ? 'external' : 'manual'

  const updateVip = (value: VIP) => {
    updateField('vip', value)
  }

  const updateItem = (id: string, value: VIPItem) => {
    updateVip({
      ...vip,
      items: items.map((item) => (item.id === id ? value : item)),
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Choose whether VIP opens an external store or renders manual packages.
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
          <label>VIP mode</label>
          <div
            className={`editor-segmented editor-segmented--${listingMode}`}
            role="radiogroup"
            aria-label="VIP mode"
          >
            <span className="editor-segmented__thumb" aria-hidden="true" />
            <label className="editor-segmented__option">
              <input
                checked={listingMode === 'external'}
                name="vip-listing-mode"
                type="radio"
                value="external"
                onChange={() => updateVip({ ...vip, redirectOnly: true })}
              />
              <span>External</span>
            </label>
            <label className="editor-segmented__option">
              <input
                checked={listingMode === 'manual'}
                name="vip-listing-mode"
                type="radio"
                value="manual"
                onChange={() => updateVip({ ...vip, redirectOnly: false })}
              />
              <span>Manual</span>
            </label>
          </div>
        </div>
        {listingMode === 'external' && (
          <div className="editor-field editor-field--wide">
            <RequiredLabel htmlFor="vip-url">External VIP URL</RequiredLabel>
            <input
              id="vip-url"
              value={vip.externalStoreUrl}
              onChange={(event) =>
                updateVip({ ...vip, externalStoreUrl: event.target.value })
              }
            />
          </div>
        )}
        {listingMode === 'manual' && (
          <>
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
          </>
        )}
      </div>
      {listingMode === 'manual' && (
        <>
          <div className="editor-list">
            {items.map((item, index) => (
              <article className="editor-item" key={item.id}>
                <div className="editor-item__header">
                  <h3>{item.name || `VIP package ${index + 1}`}</h3>
                  <button
                    className="editor-button"
                    type="button"
                    onClick={() =>
                      updateVip({
                        ...vip,
                        items: items.filter((entry) => entry.id !== item.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="editor-grid">
                  <div className="editor-field editor-field--wide">
                    <RequiredLabel htmlFor={`${item.id}-id`}>ID</RequiredLabel>
                    <input
                      id={`${item.id}-id`}
                      value={item.id}
                      onChange={(event) =>
                        updateItem(item.id, { ...item, id: event.target.value })
                      }
                    />
                  </div>
                  <div className="editor-field">
                    <RequiredLabel htmlFor={`${item.id}-name`}>Name</RequiredLabel>
                    <input
                      id={`${item.id}-name`}
                      value={item.name}
                      onChange={(event) =>
                        updateItem(item.id, { ...item, name: event.target.value })
                      }
                    />
                  </div>
                  <div className="editor-field">
                    <RequiredLabel htmlFor={`${item.id}-price`}>Price</RequiredLabel>
                    <input
                      id={`${item.id}-price`}
                      value={item.price}
                      onChange={(event) =>
                        updateItem(item.id, { ...item, price: event.target.value })
                      }
                    />
                  </div>
                  <div className="editor-field">
                    <RequiredLabel htmlFor={`${item.id}-currency`}>Currency</RequiredLabel>
                    <input
                      id={`${item.id}-currency`}
                      value={item.currency}
                      onChange={(event) =>
                        updateItem(item.id, { ...item, currency: event.target.value })
                      }
                    />
                  </div>
                  <div className="editor-field editor-field--wide">
                    <label htmlFor={`${item.id}-image`}>Image path</label>
                    <input
                      id={`${item.id}-image`}
                      value={item.image ?? ''}
                      onChange={(event) =>
                        updateItem(item.id, {
                          ...item,
                          image: optionalString(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="editor-field editor-field--wide">
                    <RequiredLabel htmlFor={`${item.id}-url`}>Purchase URL</RequiredLabel>
                    <input
                      id={`${item.id}-url`}
                      value={item.purchaseUrl}
                      onChange={(event) =>
                        updateItem(item.id, { ...item, purchaseUrl: event.target.value })
                      }
                    />
                  </div>
                  <div className="editor-field editor-field--wide">
                    <label htmlFor={`${item.id}-description`}>Description</label>
                    <textarea
                      id={`${item.id}-description`}
                      value={item.description ?? ''}
                      onChange={(event) =>
                        updateItem(item.id, {
                          ...item,
                          description: optionalString(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="editor-field editor-field--wide">
                    <label htmlFor={`${item.id}-features`}>
                      Features, comma separated
                    </label>
                    <input
                      id={`${item.id}-features`}
                      value={item.features?.join(', ') ?? ''}
                      onChange={(event) => {
                        const features = parseCommaList(event.target.value)
                        updateItem(item.id, {
                          ...item,
                          features: features.length > 0 ? features : undefined,
                        })
                      }}
                    />
                  </div>
                </div>
                <label className="editor-check">
                  <input
                    checked={item.isFeatured}
                    type="checkbox"
                    onChange={(event) =>
                      updateItem(item.id, { ...item, isFeatured: event.target.checked })
                    }
                  />
                  <span>Featured package</span>
                </label>
              </article>
            ))}
          </div>
          <div className="editor-actions">
            <button
              className="editor-button editor-button--primary"
              type="button"
              onClick={() =>
                updateVip({
                  ...vip,
                  items: [...items, createVipItem()],
                })
              }
            >
              Add VIP package
            </button>
          </div>
        </>
      )}
    </div>
  )
}

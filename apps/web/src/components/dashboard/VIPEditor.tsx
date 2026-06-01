import type { EPK, VIPItem } from '../../../../../packages/schema'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString, parseCommaList } from './types'
import './DashboardEditors.css'

type VIP = NonNullable<EPK['vip']>

const defaultVip: VIP = {
  externalStoreUrl: 'https://exampleartistvip.store',
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
      <section className="editor-section" aria-labelledby="vip-settings-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Step 1</span>
            <h3 id="vip-settings-title">VIP settings</h3>
            <p>
              Set the main VIP destination and choose whether the public VIP nav
              opens that store directly or shows packages on-site.
            </p>
          </div>
        </div>
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
            <p className="editor-help">
              External sends visitors to the main VIP site. Manual keeps a VIP
              page in this EPK and lists packages below.
            </p>
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
          <div className="editor-field editor-field--wide">
            <label htmlFor="vip-url">Main VIP site URL</label>
            <p className="editor-help">
              Use the artist's general VIP store, for example
              `https://exampleartistvip.store`.
            </p>
            <input
              id="vip-url"
              placeholder="https://exampleartistvip.store"
              value={vip.externalStoreUrl ?? ''}
              onChange={(event) =>
                updateVip({
                  ...vip,
                  externalStoreUrl: optionalString(event.target.value),
                })
              }
            />
          </div>
        </div>
      </section>
      {listingMode === 'manual' && (
        <section className="editor-section" aria-labelledby="vip-page-copy-title">
          <div className="editor-section__header">
            <div className="editor-section__title">
              <span className="editor-section__eyebrow">Step 2</span>
              <h3 id="vip-page-copy-title">VIP page copy</h3>
              <p>These fields introduce the package list when VIP is shown on-site.</p>
            </div>
          </div>
          <div className="editor-grid">
              <div className="editor-field">
                <label htmlFor="vip-headline">Headline</label>
                <p className="editor-help">Short page title shown above the packages.</p>
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
                <p className="editor-help">
                  Optional intro copy for timing, availability, or package rules.
                </p>
                <textarea
                  id="vip-description"
                  value={vip.description ?? ''}
                  onChange={(event) =>
                    updateVip({
                      ...vip,
                      description: optionalString(event.target.value),
                    })
                  }
                />
              </div>
          </div>
        </section>
      )}
      {listingMode === 'manual' && (
        <section className="editor-section" aria-labelledby="vip-packages-title">
          <div className="editor-section__header">
            <div className="editor-section__title">
              <span className="editor-section__eyebrow">Step 3</span>
              <h3 id="vip-packages-title">VIP packages</h3>
              <p>
                Create reusable offers that can be selected on individual tour
                dates. Package URLs are only needed when they differ from the
                main VIP site.
              </p>
            </div>
          </div>
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
                <div className="editor-subsection">
                  <div className="editor-subsection__header">
                    <h4>Package identity</h4>
                    <p>Name the package and set the internal ID used by tour dates.</p>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${item.id}-id`}>ID</RequiredLabel>
                      <p className="editor-help">
                        Keep this stable once tour dates are using the package.
                      </p>
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
                  </div>
                </div>
                <div className="editor-subsection">
                  <div className="editor-subsection__header">
                    <h4>Package media and URL</h4>
                    <p>Add optional imagery and only add a package URL when it has its own page.</p>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${item.id}-image`}>Image path</label>
                      <p className="editor-help">Optional image used on the VIP page.</p>
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
                    <label className="editor-check editor-check--inline">
                      <input
                        checked={Boolean(item.purchaseUrl)}
                        type="checkbox"
                        onChange={(event) =>
                          updateItem(item.id, {
                            ...item,
                            purchaseUrl: event.target.checked
                              ? vip.externalStoreUrl
                                ? `${vip.externalStoreUrl.replace(/\/$/, '')}/${item.id}`
                                : 'https://exampleartistvip.store/packagename'
                              : undefined,
                          })
                        }
                      />
                      <span>Package URL is different from the main VIP site</span>
                    </label>
                  </div>
                  {item.purchaseUrl && (
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${item.id}-url`}>Package URL</label>
                      <p className="editor-help">
                        Example: `https://exampleartistvip.store/packagename`.
                      </p>
                      <input
                        id={`${item.id}-url`}
                        value={item.purchaseUrl}
                        onChange={(event) =>
                          updateItem(item.id, {
                            ...item,
                            purchaseUrl: optionalString(event.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                  </div>
                </div>
                <div className="editor-subsection">
                  <div className="editor-subsection__header">
                    <h4>Package details</h4>
                    <p>Describe what the package includes and whether it is featured.</p>
                  </div>
                  <div className="editor-grid">
                  <div className="editor-field editor-field--wide">
                    <label htmlFor={`${item.id}-description`}>Description</label>
                    <p className="editor-help">Short package summary for the VIP page.</p>
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
                    <p className="editor-help">
                      Example: Early entry, Photo opportunity, Commemorative laminate.
                    </p>
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
                  <label className="editor-check editor-check--inline">
                    <input
                      checked={item.isFeatured}
                      type="checkbox"
                      onChange={(event) =>
                        updateItem(item.id, { ...item, isFeatured: event.target.checked })
                      }
                    />
                    <span>Featured package</span>
                  </label>
                </div>
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
        </section>
      )}
    </div>
  )
}

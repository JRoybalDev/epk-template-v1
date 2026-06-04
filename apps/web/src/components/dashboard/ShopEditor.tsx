import type {
  ClothingSize,
  EPK,
  ShopItem,
  ShopItemCategory,
} from '../../../../../packages/schema'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
import './DashboardEditors.css'

type Shop = NonNullable<EPK['shop']>

const categoryOptions: Array<{ label: string; value: ShopItemCategory }> = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Music', value: 'music' },
  { label: 'Other', value: 'other' },
]

const clothingSizeOptions: Array<{ label: string; value: ClothingSize }> = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: '2XL', value: '2XL' },
  { label: '3XL', value: '3XL' },
]

const defaultShop: Shop = {
  externalStoreUrl: 'https://exampleartistshop.myshopify.com',
  headline: 'Featured merch',
  featuredItems: [],
  redirectOnly: true,
}

const createShopItem = (storeUrl: string): ShopItem => ({
  id: createEditorId('merch'),
  name: 'New item',
  price: '35.00',
  currency: 'USD',
  description: '',
  purchaseUrl: `${storeUrl.replace(/\/$/, '')}/products/item`,
  isFeatured: true,
  category: 'clothing',
  sizes: [],
  image: '/uploads/site/assets/merch-image.jpg',
})

export function ShopEditor({ draft, updateField }: DashboardEditorProps) {
  const shop = draft.shop ?? defaultShop
  const items = shop.featuredItems ?? []
  const listingMode = shop.redirectOnly ? 'external' : 'items'

  const updateShop = (value: Shop) => {
    updateField('shop', value)
  }

  const updateItem = (id: string, value: ShopItem) => {
    updateShop({
      ...shop,
      featuredItems: items.map((item) => (item.id === id ? value : item)),
    })
  }

  return (
    <div className="editor-form">
      <section className="editor-section" aria-labelledby="shop-settings-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Step 1</span>
            <h3 id="shop-settings-title">Shop settings</h3>
            <p>
              Choose one storefront link or curated product cards that each send
              visitors to an external store URL.
            </p>
          </div>
        </div>
        <div className="editor-actions">
          {draft.shop ? (
            <button
              className="editor-button"
              type="button"
              onClick={() => updateField('shop', undefined)}
            >
              Remove shop section
            </button>
          ) : (
            <button
              className="editor-button editor-button--primary"
              type="button"
              onClick={() => updateField('shop', defaultShop)}
            >
              Add shop section
            </button>
          )}
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label>Shop mode</label>
            <p className="editor-help">
              External links straight to the main store. Item links show product
              details on the EPK, then send buyers to each item's store URL.
            </p>
            <div
              className={`editor-segmented editor-segmented--${listingMode}`}
              role="radiogroup"
              aria-label="Shop mode"
            >
              <span className="editor-segmented__thumb" aria-hidden="true" />
              <label className="editor-segmented__option">
                <input
                  checked={listingMode === 'external'}
                  name="shop-listing-mode"
                  type="radio"
                  value="external"
                  onChange={() => updateShop({ ...shop, redirectOnly: true })}
                />
                <span>External</span>
              </label>
              <label className="editor-segmented__option">
                <input
                  checked={listingMode === 'items'}
                  name="shop-listing-mode"
                  type="radio"
                  value="items"
                  onChange={() => updateShop({ ...shop, redirectOnly: false })}
                />
                <span>Item links</span>
              </label>
            </div>
          </div>
          <div className="editor-field editor-field--wide">
            <RequiredLabel htmlFor="shop-url">Default store URL</RequiredLabel>
            <p className="editor-help">
              Used for External mode and as the fallback if an item has no URL.
            </p>
            <input
              id="shop-url"
              value={shop.externalStoreUrl}
              onChange={(event) =>
                updateShop({ ...shop, externalStoreUrl: event.target.value })
              }
            />
          </div>
        </div>
      </section>
      {listingMode === 'items' && (
        <section className="editor-section" aria-labelledby="shop-products-title">
          <div className="editor-section__header">
            <div className="editor-section__title">
              <span className="editor-section__eyebrow">Step 2</span>
              <h3 id="shop-products-title">Shop items</h3>
              <p>Add merch details and the external store URL for each item.</p>
            </div>
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="shop-headline">Headline</label>
            <p className="editor-help">Shown above the item cards.</p>
            <input
              id="shop-headline"
              value={shop.headline ?? ''}
              onChange={(event) =>
                updateShop({ ...shop, headline: optionalString(event.target.value) })
              }
            />
          </div>
          <div className="editor-list">
            {items.map((item, index) => (
              <article className="editor-item" key={item.id}>
                <div className="editor-item__header">
                  <h3>{item.name || `Shop item ${index + 1}`}</h3>
                  <button
                    className="editor-button"
                    type="button"
                    onClick={() =>
                      updateShop({
                        ...shop,
                        featuredItems: items.filter((entry) => entry.id !== item.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="editor-subsection">
                  <div className="editor-subsection__header">
                    <h4>Item details</h4>
                    <p>These fields appear on the public shop card.</p>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${item.id}-id`}>ID</RequiredLabel>
                      <p className="editor-help">Internal item ID for this EPK.</p>
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
                    <div className="editor-field">
                      <label htmlFor={`${item.id}-category`}>Category</label>
                      <select
                        id={`${item.id}-category`}
                        value={item.category ?? 'other'}
                        onChange={(event) =>
                          updateItem(item.id, {
                            ...item,
                            category: event.target.value as ShopItemCategory,
                            sizes:
                              event.target.value === 'clothing'
                                ? item.sizes ?? []
                                : undefined,
                          })
                        }
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {item.category === 'clothing' && (
                      <div className="editor-field editor-field--wide">
                        <label htmlFor={`${item.id}-sizes`}>Available sizes</label>
                        <div className="editor-size-picker">
                          <select
                            id={`${item.id}-sizes`}
                            value=""
                            onChange={(event) => {
                              const size = event.target.value as ClothingSize

                              if (!size || item.sizes?.includes(size)) return

                              updateItem(item.id, {
                                ...item,
                                sizes: [...(item.sizes ?? []), size],
                              })
                            }}
                          >
                            <option value="">Add a size</option>
                            {clothingSizeOptions.map((option) => (
                              <option
                                disabled={item.sizes?.includes(option.value)}
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="editor-size-picker__selected" aria-live="polite">
                            {item.sizes?.length ? (
                              item.sizes.map((size) => (
                                <span className="editor-size-pill" key={size}>
                                  <span>{size}</span>
                                  <button
                                    aria-label={`Remove ${size}`}
                                    type="button"
                                    onClick={() =>
                                      updateItem(item.id, {
                                        ...item,
                                        sizes: item.sizes?.filter((entry) => entry !== size),
                                      })
                                    }
                                  >
                                    x
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="editor-size-picker__empty">
                                No sizes selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
                      <RequiredLabel htmlFor={`${item.id}-url`}>Item store URL</RequiredLabel>
                      <p className="editor-help">
                        This is the product page, preorder page, or direct store
                        URL opened by the public Buy button.
                      </p>
                      <input
                        id={`${item.id}-url`}
                        value={item.purchaseUrl ?? ''}
                        onChange={(event) =>
                          updateItem(item.id, {
                            ...item,
                            purchaseUrl: optionalString(event.target.value),
                          })
                        }
                      />
                    </div>
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
                  <span>Featured item</span>
                </label>
              </article>
            ))}
          </div>
          <div className="editor-actions">
            <button
              className="editor-button editor-button--primary"
              type="button"
              onClick={() =>
                updateShop({
                  ...shop,
                  featuredItems: [...items, createShopItem(shop.externalStoreUrl)],
                })
              }
            >
              Add shop item
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

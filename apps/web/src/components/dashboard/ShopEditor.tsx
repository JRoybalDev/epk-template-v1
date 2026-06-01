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
  redirectOnly: false,
}

const createShopItem = (): ShopItem => ({
  id: createEditorId('merch'),
  name: 'New item',
  price: '35.00',
  currency: 'USD',
  description: '',
  purchaseUrl: 'https://exampleartistshop.myshopify.com/products/item',
  shopifyVariantId: '',
  isFeatured: true,
  category: 'clothing',
  sizes: [],
  image: '/uploads/site/assets/merch-image.jpg',
})

export function ShopEditor({ draft, updateField }: DashboardEditorProps) {
  const shop = draft.shop ?? defaultShop
  const items = shop.featuredItems ?? []
  const listingMode = shop.redirectOnly ? 'external' : 'manual'

  const updateItem = (id: string, value: ShopItem) => {
    updateField('shop', {
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
              Choose whether visitors go straight to a storefront or see featured
              Shopify products on this EPK first.
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
              External redirects to the store. Shopify shows selected products
              on the EPK with internal item pages and cart behavior.
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
                  onChange={() => updateField('shop', { ...shop, redirectOnly: true })}
                />
                <span>External</span>
              </label>
              <label className="editor-segmented__option">
                <input
                  checked={listingMode === 'manual'}
                  name="shop-listing-mode"
                  type="radio"
                  value="manual"
                  onChange={() => updateField('shop', { ...shop, redirectOnly: false })}
                />
                <span>Shopify</span>
              </label>
            </div>
          </div>
          <div className="editor-field editor-field--wide">
            <RequiredLabel htmlFor="shop-url">
              {listingMode === 'external' ? 'External store URL' : 'Shopify store URL'}
            </RequiredLabel>
            <p className="editor-help">
              Use the main Shopify storefront URL, for example
              `https://exampleartistshop.myshopify.com`.
            </p>
            <input
              id="shop-url"
              value={shop.externalStoreUrl}
              onChange={(event) =>
                updateField('shop', { ...shop, externalStoreUrl: event.target.value })
              }
            />
          </div>
        </div>
      </section>
      {listingMode === 'manual' && (
        <section className="editor-section" aria-labelledby="shop-products-title">
          <div className="editor-section__header">
            <div className="editor-section__title">
              <span className="editor-section__eyebrow">Step 2</span>
              <h3 id="shop-products-title">Shopify products</h3>
              <p>
                Add featured products visitors can inspect and add to a cart
                inside this EPK template.
              </p>
            </div>
          </div>
          <div className="editor-field editor-field--wide">
            <label htmlFor="shop-headline">Headline</label>
            <p className="editor-help">Shown above the featured product cards.</p>
            <input
              id="shop-headline"
              value={shop.headline ?? ''}
              onChange={(event) =>
                updateField('shop', { ...shop, headline: optionalString(event.target.value) })
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
                      updateField('shop', {
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
                    <h4>Product details</h4>
                    <p>Match these fields to the Shopify product listing.</p>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${item.id}-id`}>ID</RequiredLabel>
                      <p className="editor-help">Internal product ID for this EPK.</p>
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
                      <p className="editor-help">
                        Choose the product type so templates can handle clothing
                        options cleanly.
                      </p>
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
                        <p className="editor-help">
                          Add sizes from the dropdown. Selected sizes appear beside it.
                        </p>
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
                      <p className="editor-help">
                        Optional product details shown when visitors inspect the item.
                      </p>
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
                  </div>
                </div>
                <div className="editor-subsection">
                  <div className="editor-subsection__header">
                    <h4>Product links and media</h4>
                    <p>Use an uploaded or hosted product image. External URLs are optional references.</p>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${item.id}-image`}>Image path</label>
                      <p className="editor-help">
                        Usually an uploaded asset path like
                        <code>/uploads/site/assets/file.jpg</code>.
                      </p>
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
                      <label htmlFor={`${item.id}-url`}>Reference product URL</label>
                      <p className="editor-help">
                        Optional. The public shop opens this item inside the EPK
                        instead of sending visitors to this URL.
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
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${item.id}-variant`}>Shopify variant ID</label>
                      <p className="editor-help">
                        Optional reference for future Shopify integrations. The
                        template cart works inside the EPK without this value.
                      </p>
                      <input
                        id={`${item.id}-variant`}
                        value={item.shopifyVariantId ?? ''}
                        onChange={(event) =>
                          updateItem(item.id, {
                            ...item,
                            shopifyVariantId: optionalString(event.target.value),
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
                updateField('shop', {
                  ...shop,
                  featuredItems: [...items, createShopItem()],
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

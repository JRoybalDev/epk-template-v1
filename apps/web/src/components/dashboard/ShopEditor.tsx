import type { EPK, ShopItem } from '../../../../../packages/schema'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString } from './types'
import './DashboardEditors.css'

type Shop = NonNullable<EPK['shop']>

const defaultShop: Shop = {
  externalStoreUrl: 'https://example.com/store',
  headline: 'Featured merch',
  featuredItems: [],
  redirectOnly: false,
}

const createShopItem = (): ShopItem => ({
  id: createEditorId('merch'),
  name: 'New item',
  price: '35.00',
  currency: 'USD',
  purchaseUrl: 'https://example.com/store/item',
  isFeatured: true,
  category: 'merch',
  image: '/uploads/site/assets/merch-image.jpg',
})

export function ShopEditor({ draft, updateField }: DashboardEditorProps) {
  const shop = draft.shop ?? defaultShop
  const items = shop.featuredItems ?? []

  const updateItem = (id: string, value: ShopItem) => {
    updateField('shop', {
      ...shop,
      featuredItems: items.map((item) => (item.id === id ? value : item)),
    })
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Configure the external shop and optional featured merch. Image paths usually
        look like <code>/uploads/site/assets/file.jpg</code>.
      </p>
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
        <div className="editor-field">
          <label htmlFor="shop-headline">Headline</label>
          <input
            id="shop-headline"
            value={shop.headline ?? ''}
            onChange={(event) =>
              updateField('shop', { ...shop, headline: optionalString(event.target.value) })
            }
          />
        </div>
        <div className="editor-field">
          <RequiredLabel htmlFor="shop-url">External store URL</RequiredLabel>
          <input
            id="shop-url"
            value={shop.externalStoreUrl}
            onChange={(event) =>
              updateField('shop', { ...shop, externalStoreUrl: event.target.value })
            }
          />
        </div>
      </div>
      <label className="editor-check">
        <input
          checked={shop.redirectOnly}
          type="checkbox"
          onChange={(event) =>
            updateField('shop', { ...shop, redirectOnly: event.target.checked })
          }
        />
        <span>Redirect directly to external shop</span>
      </label>
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
            <div className="editor-grid">
              <div className="editor-field editor-field--wide">
                <RequiredLabel htmlFor={`${item.id}-id`}>ID</RequiredLabel>
                <input
                  id={`${item.id}-id`}
                  value={item.id}
                  onChange={(event) => updateItem(item.id, { ...item, id: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <RequiredLabel htmlFor={`${item.id}-name`}>Name</RequiredLabel>
                <input
                  id={`${item.id}-name`}
                  value={item.name}
                  onChange={(event) => updateItem(item.id, { ...item, name: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <RequiredLabel htmlFor={`${item.id}-price`}>Price</RequiredLabel>
                <input
                  id={`${item.id}-price`}
                  value={item.price}
                  onChange={(event) => updateItem(item.id, { ...item, price: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <RequiredLabel htmlFor={`${item.id}-currency`}>Currency</RequiredLabel>
                <input
                  id={`${item.id}-currency`}
                  value={item.currency}
                  onChange={(event) => updateItem(item.id, { ...item, currency: event.target.value })}
                />
              </div>
              <div className="editor-field">
                <label htmlFor={`${item.id}-category`}>Category</label>
                <input
                  id={`${item.id}-category`}
                  value={item.category ?? ''}
                  onChange={(event) =>
                    updateItem(item.id, {
                      ...item,
                      category: optionalString(event.target.value),
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
                <RequiredLabel htmlFor={`${item.id}-url`}>Purchase URL</RequiredLabel>
                <input
                  id={`${item.id}-url`}
                  value={item.purchaseUrl}
                  onChange={(event) =>
                    updateItem(item.id, { ...item, purchaseUrl: event.target.value })
                  }
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
    </div>
  )
}

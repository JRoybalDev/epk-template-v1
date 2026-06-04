import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'

const categoryLabels = {
  clothing: 'Clothing',
  music: 'Music',
  other: 'Merch',
} as const

const getFeaturedItems = (shop: NonNullable<ReturnType<typeof useEPKOutlet>['epk']['shop']>) =>
  (shop.featuredItems ?? []).filter((item) => item.isFeatured)

export function ShopGrid() {
  const { epk } = useEPKOutlet()
  const shop = epk.shop

  if (!shop) {
    return (
      <section data-section="shop" data-state="unavailable">
        <h1>Shop unavailable</h1>
        <p>Shop details have not been added yet.</p>
      </section>
    )
  }

  if (shop.redirectOnly) {
    return (
      <section data-section="shop">
        <header>
          <p>Shop</p>
          <h1>{shop.headline || 'Shop'}</h1>
          <a href={shop.externalStoreUrl} rel="noreferrer" target="_blank">
            Visit store
          </a>
        </header>
      </section>
    )
  }

  const featuredItems = getFeaturedItems(shop)

  return (
    <section data-section="shop">
      <header>
        <p>Shop</p>
        <h1>{shop.headline || 'Featured merch'}</h1>
      </header>
      <div data-list="shopItems">
        {featuredItems.map((item) => {
          const itemUrl = item.purchaseUrl ?? shop.externalStoreUrl

          return (
            <article data-item="shopItem" key={item.id}>
              <FallbackImage alt="" fallbackLabel="Shop image" src={item.image} />
              <div>
                <h2>{item.name}</h2>
                <p>
                  {item.currency} {item.price}
                </p>
                {item.category && <p>{categoryLabels[item.category]}</p>}
                {item.description && <p>{item.description}</p>}
                {item.category === 'clothing' && item.sizes?.length ? (
                  <p>Sizes: {item.sizes.join(', ')}</p>
                ) : null}
                <a href={itemUrl} rel="noreferrer" target="_blank">
                  Buy
                </a>
              </div>
            </article>
          )
        })}
        {featuredItems.length === 0 && <p>No featured shop items yet.</p>}
      </div>
    </section>
  )
}

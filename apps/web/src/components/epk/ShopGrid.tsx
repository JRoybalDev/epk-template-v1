import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'

export function ShopGrid() {
  const { epk } = useEPKOutlet()
  const shop = epk.shop
  const items = shop?.featuredItems ?? []
  const featuredItems = items.some((item) => item.isFeatured)
    ? items.filter((item) => item.isFeatured)
    : items

  if (!shop) {
    return (
      <section data-section="shop" data-state="unavailable">
        <h1>Shop unavailable</h1>
        <p>Shop details have not been added yet.</p>
      </section>
    )
  }

  return (
    <section data-section="shop">
      <header>
        <p>Shop</p>
        <h1>{shop.headline || 'Featured merch'}</h1>
        <a href={shop.externalStoreUrl}>Visit store</a>
      </header>
      {shop.redirectOnly && <p>This shop section is configured as an external store link.</p>}
      <div data-list="shopItems">
        {featuredItems.map((item) => (
          <article data-item="shopItem" key={item.id}>
            <FallbackImage
              alt=""
              fallbackLabel="Shop image"
              src={item.image}
            />
            <div>
              <h2>{item.name}</h2>
              <p>{item.currency} {item.price}</p>
              <a href={item.purchaseUrl}>View item</a>
            </div>
          </article>
        ))}
        {featuredItems.length === 0 && <p>No featured shop items yet.</p>}
      </div>
    </section>
  )
}

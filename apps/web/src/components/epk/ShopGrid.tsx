import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function ShopGrid() {
  const { epk } = useEPKOutlet()
  const shop = epk.shop

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">Shop</p>
          <h1>{shop?.headline || 'Featured merch'}</h1>
          {shop?.externalStoreUrl && <a className="epk-button" href={shop.externalStoreUrl}>Visit store</a>}
        </div>
        <div className="epk-grid music-grid">
          {shop?.featuredItems?.map((item) => (
            <article className="epk-card" key={item.id}>
              {item.image && <img src={item.image} alt="" />}
              <div className="epk-card__body">
                <h2>{item.name}</h2>
                <p className="epk-muted">{item.currency} {item.price}</p>
                <a className="epk-button epk-button--ghost" href={item.purchaseUrl}>View item</a>
              </div>
            </article>
          )) ?? <p className="epk-muted">No featured shop items yet.</p>}
        </div>
      </div>
    </section>
  )
}

import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'

export function VIPPage() {
  const { epk } = useEPKOutlet()
  const vip = epk.vip
  const items = vip?.items ?? []
  const featuredItems = items.some((item) => item.isFeatured)
    ? items.filter((item) => item.isFeatured)
    : items

  if (!vip) {
    return (
      <section data-section="vip" data-state="unavailable">
        <h1>VIP unavailable</h1>
        <p>VIP details have not been added yet.</p>
      </section>
    )
  }

  if (vip.redirectOnly) {
    return (
      <section data-section="vip">
        <header>
          <p>VIP</p>
          <h1>{vip.headline || 'VIP upgrades'}</h1>
          {vip.description && <p>{vip.description}</p>}
          <a href={vip.externalStoreUrl} rel="noreferrer" target="_blank">
            Open VIP store
          </a>
        </header>
      </section>
    )
  }

  return (
    <section data-section="vip">
      <header>
        <p>VIP</p>
        <h1>{vip.headline || 'VIP upgrades'}</h1>
        {vip.description && <p>{vip.description}</p>}
      </header>
      <div data-list="vipItems">
        {featuredItems.map((item) => (
          <article data-item="vipItem" key={item.id}>
            <FallbackImage
              alt=""
              fallbackLabel="VIP image"
              src={item.image}
            />
            <div>
              <h2>{item.name}</h2>
              <p>{item.currency} {item.price}</p>
              {item.description && <p>{item.description}</p>}
              {item.features && item.features.length > 0 && (
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <a href={item.purchaseUrl}>View package</a>
            </div>
          </article>
        ))}
        {featuredItems.length === 0 && <p>No VIP packages yet.</p>}
      </div>
    </section>
  )
}

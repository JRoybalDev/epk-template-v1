import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import './EPKSections.css'

export function VIPPage() {
  const { epk } = useEPKOutlet()
  const vip = epk.vip

  return (
    <section className="epk-section">
      <div className="site-container">
        <div className="epk-section__header">
          <p className="epk-section__eyebrow">VIP</p>
          <h1>{vip?.headline || 'VIP upgrades'}</h1>
          {vip?.description && <p className="epk-section__lede">{vip.description}</p>}
        </div>
        {vip?.externalStoreUrl ? (
          <a className="epk-button" href={vip.externalStoreUrl}>Open VIP store</a>
        ) : (
          <p className="epk-muted">VIP details have not been added yet.</p>
        )}
      </div>
    </section>
  )
}

import { useEPKOutlet } from '../../hooks/useEPKOutlet'

export function VIPPage() {
  const { epk } = useEPKOutlet()
  const vip = epk.vip

  if (!vip) {
    return (
      <section data-section="vip" data-state="unavailable">
        <h1>VIP unavailable</h1>
        <p>VIP details have not been added yet.</p>
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
      {vip.redirectOnly && <p>This VIP section is configured as an external store link.</p>}
      <a href={vip.externalStoreUrl}>Open VIP store</a>
    </section>
  )
}

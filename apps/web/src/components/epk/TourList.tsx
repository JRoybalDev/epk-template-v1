import { useEffect, useRef } from 'react'
import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { formatTourDate } from '../../utils/tourDateFormat'
import type {
  EPK,
  TourDate,
  TourDateVipPackage,
  VIPItem,
} from '../../../../../packages/schema'

const formatTourLocation = (
  city: string,
  region: string | undefined,
  country: string,
) => [city, region, country].filter(Boolean).join(', ')

const getTodayDateKey = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const isTourDateAnnounced = (date: { date: string; isAnnounced: boolean }) =>
  date.isAnnounced && date.date >= getTodayDateKey()

const getVipPackageSelections = (date: TourDate): TourDateVipPackage[] => {
  if (date.vipPackages?.length) return date.vipPackages

  return (date.vipPackageIds ?? []).map((packageId) => ({ packageId }))
}

const getSelectedVipPackages = (epk: EPK, date: TourDate) => {
  const packageIds = getVipPackageSelections(date).map((item) => item.packageId)
  const packages = epk.vip?.items ?? []

  return packages.filter((item) => packageIds.includes(item.id))
}

const getPackageVipUrl = (
  epk: EPK,
  selection?: TourDateVipPackage,
  item?: VIPItem,
) => {
  if (epk.vip?.redirectOnly) return epk.vip.externalStoreUrl

  return selection?.dateSpecificUrl ?? item?.purchaseUrl ?? epk.vip?.externalStoreUrl
}

function TourVipLinks({ date, epk }: { date: TourDate; epk: EPK }) {
  const selectedPackages = getSelectedVipPackages(epk, date)

  if (selectedPackages.length > 0) {
    const selectedPackageUrls = getVipPackageSelections(date)

    return (
      <>
        {selectedPackages.map((item) => {
          const selection = selectedPackageUrls.find(
            (entry) => entry.packageId === item.id,
          )
          const vipUrl = getPackageVipUrl(epk, selection, item)

          return vipUrl ? (
            <a href={vipUrl} key={item.id}>{item.name}</a>
          ) : (
            <span key={item.id}>{item.name}</span>
          )
        })}
      </>
    )
  }

  const fallbackVipUrl = date.vipUrl ?? epk.vip?.externalStoreUrl

  return fallbackVipUrl ? <a href={fallbackVipUrl}>VIP</a> : null
}

function SeatedTourEmbed({
  embedCode,
  widgetUrl,
}: {
  embedCode?: string
  widgetUrl?: string
}) {
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = embedRef.current
    if (!container || !embedCode) return

    container.innerHTML = ''

    const template = document.createElement('template')
    template.innerHTML = embedCode

    Array.from(template.content.childNodes).forEach((node) => {
      if (node instanceof HTMLScriptElement) {
        const script = document.createElement('script')

        Array.from(node.attributes).forEach((attribute) => {
          script.setAttribute(attribute.name, attribute.value)
        })
        script.text = node.text
        container.appendChild(script)
        return
      }

      container.appendChild(node.cloneNode(true))
    })

    return () => {
      container.innerHTML = ''
    }
  }, [embedCode])

  if (embedCode) {
    return <div data-field="seatedTourEmbed" ref={embedRef} />
  }

  if (widgetUrl) {
    return (
      <iframe
        data-field="seatedTourEmbed"
        src={widgetUrl}
        title="Seated tour listings"
      />
    )
  }

  return <p>Seated tour listings have not been configured yet.</p>
}

export function TourList() {
  const { epk } = useEPKOutlet()
  const dates = [...epk.tour.dates].sort((a, b) => a.date.localeCompare(b.date))
  const dateDisplayFormat = epk.tour.dateDisplayFormat ?? 'long_month_day_year'
  const listingMode =
    epk.tour.listingMode ??
    (epk.tour.seatedEmbedCode || epk.tour.seatedWidgetUrl ? 'seated' : 'manual')

  return (
    <section data-section="tour">
      <header>
        <p>Tour</p>
        <h1>{epk.tour.tourName || 'Upcoming dates'}</h1>
        {listingMode === 'seated' && epk.tour.seatedWidgetUrl && (
          <a href={epk.tour.seatedWidgetUrl}>Open tour listings</a>
        )}
      </header>
      {listingMode === 'seated' ? (
        <SeatedTourEmbed
          embedCode={epk.tour.seatedEmbedCode}
          widgetUrl={epk.tour.seatedWidgetUrl}
        />
      ) : (
        <>
          {dates.length === 0 && <p>No tour dates have been added yet.</p>}
          <div data-list="tourDates">
            {dates.map((date) => (
              <article data-item="tourDate" key={date.id}>
                <p>{formatTourDate(date.date, dateDisplayFormat)}</p>
                <div>
                  <h2>{isTourDateAnnounced(date) ? date.venue : 'Coming soon'}</h2>
                  <p>{formatTourLocation(date.city, date.region, date.country)}</p>
                  {date.supportingActs && date.supportingActs.length > 0 && (
                    <p>{date.supportingActs.join(', ')}</p>
                  )}
                </div>
                <div>
                  <TourVipLinks date={date} epk={epk} />
                  {date.ticketUrl && !date.isSoldOut && <a href={date.ticketUrl}>Tickets</a>}
                  {date.isSoldOut && <span>Sold out</span>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {listingMode === 'manual' && epk.tour.notifyCta && (
        <section data-section="tour-notify">
          <p>{epk.tour.notifyCta.text}</p>
          <a href={epk.tour.notifyCta.buttonUrl}>{epk.tour.notifyCta.buttonLabel}</a>
        </section>
      )}
    </section>
  )
}

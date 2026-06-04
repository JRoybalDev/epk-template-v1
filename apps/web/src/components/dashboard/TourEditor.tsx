import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type {
  DateDisplayFormat,
  TourDate,
  TourDateVipPackage,
  TourListingMode,
} from '../../../../../packages/schema'
import { DashboardDateInput, getTodayDateKey } from './DashboardDateInput'
import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { createEditorId, optionalString, parseCommaList } from './types'
import { formatTourDate } from '../../utils/tourDateFormat'
import './DashboardEditors.css'

const createTourDate = (): TourDate => ({
  id: createEditorId('show'),
  date: new Date().toISOString().slice(0, 10),
  venue: 'New venue',
  city: 'City',
  country: 'USA',
  isSoldOut: false,
  isAnnounced: true,
})

const isPastDate = (date: string) => date < getTodayDateKey()
const formatTourLocation = (date: TourDate) =>
  [date.city, date.region, date.country].filter(Boolean).join(', ')
const getVipPackageSelections = (date: TourDate): TourDateVipPackage[] => {
  if (date.vipPackages?.length) return date.vipPackages

  return (date.vipPackageIds ?? []).map((packageId) => ({ packageId }))
}

const dateDisplayFormatOptions: Array<{
  label: string
  value: DateDisplayFormat
}> = [
  { label: 'ISO date: 2026-06-05', value: 'iso' },
  { label: 'Short month, day, year: Jun 5, 2026', value: 'short_month_day_year' },
  { label: 'Short month and day: Jun 5', value: 'short_month_day' },
  { label: 'Full month, day, year: June 5, 2026', value: 'long_month_day_year' },
  { label: 'Full month and day: June 5', value: 'long_month_day' },
  { label: 'Numeric: 06/05/2026', value: 'numeric_month_day_year' },
  { label: 'Day, short month, year: 5 Jun 2026', value: 'day_short_month_year' },
]

export function TourEditor({ draft, updateField }: DashboardEditorProps) {
  const [openDateId, setOpenDateId] = useState<string | null>(null)
  const tour = draft.tour
  const dates = tour.dates
  const vipPackages = draft.vip?.items ?? []
  const isVipExternalMode = Boolean(draft.vip?.redirectOnly)
  const defaultVipExternalUrl = draft.vip?.externalStoreUrl
  const listingMode: TourListingMode =
    tour.listingMode ?? (tour.seatedEmbedCode || tour.seatedWidgetUrl ? 'seated' : 'manual')
  const notifyCta = tour.notifyCta ?? {
    text: '',
    buttonLabel: '',
    buttonUrl: '',
  }

  useEffect(() => {
    if (!dates.some((date) => date.isAnnounced && isPastDate(date.date))) return

    updateField('tour', {
      ...tour,
      dates: dates.map((date) =>
        date.isAnnounced && isPastDate(date.date)
          ? { ...date, isAnnounced: false }
          : date,
      ),
    })
  }, [dates, tour, updateField])

  useEffect(() => {
    if (!isVipExternalMode) return

    const nextDates = dates.map((date) => {
      const selectedVipPackages = getVipPackageSelections(date)

      if (selectedVipPackages.length === 0) return date

      const nextVipPackages = selectedVipPackages.map((selection) => ({
        ...selection,
        dateSpecificUrl: defaultVipExternalUrl,
      }))

      const didChange =
        date.vipPackages?.length !== nextVipPackages.length ||
        nextVipPackages.some(
          (selection, index) =>
            date.vipPackages?.[index]?.packageId !== selection.packageId ||
            date.vipPackages?.[index]?.dateSpecificUrl !== selection.dateSpecificUrl,
        )

      return didChange
        ? {
            ...date,
            vipPackageIds: nextVipPackages.map((item) => item.packageId),
            vipPackages: nextVipPackages,
          }
        : date
    })

    if (nextDates.some((date, index) => date !== dates[index])) {
      updateField('tour', {
        ...tour,
        dates: nextDates,
      })
    }
  }, [dates, defaultVipExternalUrl, isVipExternalMode, tour, updateField])

  const updateDate = (id: string, value: TourDate) => {
    updateField('tour', {
      ...tour,
      dates: dates.map((date) => (date.id === id ? value : date)),
    })
  }

  const toggleDate = (id: string) => {
    setOpenDateId((current) => (current === id ? null : id))
  }

  const addTourDate = () => {
    const nextDate = createTourDate()

    updateField('tour', { ...tour, dates: [...dates, nextDate] })
    setOpenDateId(nextDate.id)
  }

  const updateDateRegion = (date: TourDate, value: string) => {
    const nextDate = { ...date }
    const region = optionalString(value)

    if (region) {
      nextDate.region = region
    } else {
      delete nextDate.region
    }

    updateDate(date.id, nextDate)
  }

  const updateVipPackageSelections = (
    date: TourDate,
    vipPackages: TourDateVipPackage[],
  ) => {
    const nextVipPackages = vipPackages.length > 0 ? vipPackages : undefined

    updateDate(date.id, {
      ...date,
      vipPackageIds: nextVipPackages?.map((item) => item.packageId),
      vipPackages: isVipExternalMode
        ? nextVipPackages?.map((item) => ({
            ...item,
            dateSpecificUrl: defaultVipExternalUrl,
          }))
        : nextVipPackages,
    })
  }

  const addVipPackageSelection = (date: TourDate, packageId: string) => {
    if (!packageId) return

    const currentSelections = getVipPackageSelections(date)
    if (currentSelections.some((item) => item.packageId === packageId)) return

    updateVipPackageSelections(date, [
      ...currentSelections,
      {
        packageId,
        dateSpecificUrl: isVipExternalMode ? defaultVipExternalUrl : undefined,
      },
    ])
  }

  const updateVipPackageSelection = (
    date: TourDate,
    packageId: string,
    value: TourDateVipPackage,
  ) => {
    updateVipPackageSelections(
      date,
      getVipPackageSelections(date).map((item) =>
        item.packageId === packageId ? value : item,
      ),
    )
  }

  const removeVipPackageSelection = (date: TourDate, packageId: string) => {
    updateVipPackageSelections(
      date,
      getVipPackageSelections(date).filter((item) => item.packageId !== packageId),
    )
  }

  const updateNotifyCta = (value: typeof notifyCta) => {
    const shouldKeep =
      value.text.trim().length > 0 ||
      value.buttonLabel.trim().length > 0 ||
      value.buttonUrl.trim().length > 0

    updateField('tour', {
      ...tour,
      notifyCta: shouldKeep ? value : undefined,
    })
  }

  return (
    <div className="editor-form">
      <section className="editor-section" aria-labelledby="tour-setup-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Step 1</span>
            <h3 id="tour-setup-title">Tour setup</h3>
            <p>Choose the listing source and set the public tour title.</p>
          </div>
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label>Tour listing source</label>
            <p className="editor-help">
              Seated uses an external widget. Manual uses the tour date rows below.
            </p>
            <div
              className={`editor-segmented editor-segmented--${listingMode}`}
              role="radiogroup"
              aria-label="Tour listing source"
            >
              <span className="editor-segmented__thumb" aria-hidden="true" />
              <label className="editor-segmented__option">
                <input
                  checked={listingMode === 'seated'}
                  name="tour-listing-mode"
                  type="radio"
                  value="seated"
                  onChange={() =>
                    updateField('tour', {
                      ...tour,
                      listingMode: 'seated',
                    })
                  }
                />
                <span>Seated</span>
              </label>
              <label className="editor-segmented__option">
                <input
                  checked={listingMode === 'manual'}
                  name="tour-listing-mode"
                  type="radio"
                  value="manual"
                  onChange={() =>
                    updateField('tour', {
                      ...tour,
                      listingMode: 'manual',
                    })
                  }
                />
                <span>Manual</span>
              </label>
            </div>
          </div>
          <div className="editor-field">
            <label htmlFor="tour-name">Tour name</label>
            <p className="editor-help">Optional public heading above tour listings.</p>
            <input
              id="tour-name"
              value={tour.tourName ?? ''}
              onChange={(event) =>
                updateField('tour', {
                  ...tour,
                  tourName: optionalString(event.target.value),
                })
              }
            />
          </div>
        </div>
      </section>
      {listingMode === 'seated' && (
        <section className="editor-section" aria-labelledby="tour-seated-title">
          <div className="editor-section__header">
            <div className="editor-section__title">
              <span className="editor-section__eyebrow">Step 2</span>
              <h3 id="tour-seated-title">Seated integration</h3>
              <p>Add the embedded widget code, or use a widget URL as fallback.</p>
            </div>
          </div>
          <div className="editor-grid">
              <div className="editor-field editor-field--wide">
                <label htmlFor="seated-embed">Seated embed code</label>
                <p className="editor-help">Paste the full embed snippet from Seated.</p>
                <textarea
                  id="seated-embed"
                  value={tour.seatedEmbedCode ?? ''}
                  onChange={(event) =>
                    updateField('tour', {
                      ...tour,
                      seatedEmbedCode: optionalString(event.target.value),
                    })
                  }
                />
              </div>
              <div className="editor-field editor-field--wide">
                <label htmlFor="seated-widget">Seated widget URL fallback</label>
                <p className="editor-help">
                  Used as an iframe fallback and as an external listings link.
                </p>
                <input
                  id="seated-widget"
                  value={tour.seatedWidgetUrl ?? ''}
                  onChange={(event) =>
                    updateField('tour', {
                      ...tour,
                      seatedWidgetUrl: optionalString(event.target.value),
                    })
                  }
                />
              </div>
          </div>
        </section>
      )}
      {listingMode === 'manual' && (
        <>
      <section className="editor-section" aria-labelledby="tour-display-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Step 2</span>
            <h3 id="tour-display-title">Manual listing display</h3>
            <p>Control date formatting and the optional notify call to action.</p>
          </div>
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <label htmlFor="tour-date-format">Date display format</label>
            <p className="editor-help">Choose how dates appear on the public Tour page.</p>
            <select
              id="tour-date-format"
              value={tour.dateDisplayFormat ?? 'long_month_day_year'}
              onChange={(event) =>
                updateField('tour', {
                  ...tour,
                  dateDisplayFormat: event.target.value as DateDisplayFormat,
                })
              }
            >
              {dateDisplayFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
      <section className="editor-item" aria-labelledby="tour-notify-title">
        <div className="editor-item__header">
          <h3 id="tour-notify-title">Notify CTA</h3>
          {tour.notifyCta && (
            <button
              className="editor-button"
              type="button"
              onClick={() => updateField('tour', { ...tour, notifyCta: undefined })}
            >
              Clear CTA
            </button>
          )}
        </div>
        <div className="editor-grid">
          <div className="editor-field editor-field--wide">
            <RequiredLabel htmlFor="notify-text">Text</RequiredLabel>
            <p className="editor-help">Shown below manual tour listings.</p>
            <input
              id="notify-text"
              value={notifyCta.text}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, text: event.target.value })
              }
            />
          </div>
          <div className="editor-field">
            <RequiredLabel htmlFor="notify-label">Button label</RequiredLabel>
            <p className="editor-help">Short action text for the notify link.</p>
            <input
              id="notify-label"
              value={notifyCta.buttonLabel}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, buttonLabel: event.target.value })
              }
            />
          </div>
          <div className="editor-field">
            <RequiredLabel htmlFor="notify-url">Button URL</RequiredLabel>
            <p className="editor-help">Bandsintown, Seated, newsletter, or follow URL.</p>
            <input
              id="notify-url"
              value={notifyCta.buttonUrl}
              onChange={(event) =>
                updateNotifyCta({ ...notifyCta, buttonUrl: event.target.value })
              }
            />
          </div>
        </div>
      </section>
      <section className="editor-section" aria-labelledby="tour-dates-title">
        <div className="editor-section__header">
          <div className="editor-section__title">
            <span className="editor-section__eyebrow">Step 3</span>
            <h3 id="tour-dates-title">Tour dates</h3>
            <p>Add shows, ticket links, and VIP package selections for each date.</p>
          </div>
        </div>
        <div className="editor-list">
        {dates.map((date, index) => {
          const isOpen = openDateId === date.id
          const dateTitle = date.venue || `Show ${index + 1}`
          const dateLocation = formatTourLocation(date)
          const selectedVipPackages = getVipPackageSelections(date)
          const selectedVipPackageIds = selectedVipPackages.map((item) => item.packageId)
          const availableVipPackages = vipPackages.filter(
            (item) => !selectedVipPackageIds.includes(item.id),
          )
          const vipPackageCount = selectedVipPackages.length
          const dateMeta = [
            formatTourDate(
              date.date,
              tour.dateDisplayFormat ?? 'long_month_day_year',
            ),
            dateLocation,
            vipPackageCount > 0
              ? `${vipPackageCount} VIP package${vipPackageCount === 1 ? '' : 's'}`
              : '',
          ].filter(Boolean).join(' · ')

          return (
            <article
              className={[
                'editor-item',
                'editor-collapse',
                isOpen ? 'editor-collapse--open' : '',
              ].filter(Boolean).join(' ')}
              key={date.id}
            >
              <button
                aria-controls={`${date.id}-tour-date-settings`}
                aria-expanded={isOpen}
                className="editor-collapse__trigger"
                type="button"
                onClick={() => toggleDate(date.id)}
              >
                <span>
                  {dateTitle}
                  <small>{dateMeta}</small>
                </span>
                <FiChevronDown aria-hidden="true" />
              </button>
              {isOpen && (
                <div
                  className="editor-collapse__content"
                  id={`${date.id}-tour-date-settings`}
                >
                  {isPastDate(date.date) && (
                    <p className="editor-empty">
                      This date has passed, so it is automatically unannounced.
                    </p>
                  )}
                  <div className="editor-item__header">
                    <h3>{dateTitle}</h3>
                    <button
                      className="editor-button"
                      type="button"
                      onClick={() => {
                        updateField('tour', {
                          ...tour,
                          dates: dates.filter((item) => item.id !== date.id),
                        })
                        setOpenDateId((current) =>
                          current === date.id ? null : current,
                        )
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="editor-subsection">
                    <div className="editor-subsection__header">
                      <h4>Show details</h4>
                      <p>Set the date, venue, and location shown in the tour row.</p>
                    </div>
                  <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <RequiredLabel htmlFor={`${date.id}-id`}>ID</RequiredLabel>
                      <p className="editor-help">
                        Internal show identifier. Keep it stable after launch.
                      </p>
                      <input
                        id={`${date.id}-id`}
                        value={date.id}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, id: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-date`}>Date</RequiredLabel>
                      <DashboardDateInput
                        id={`${date.id}-date`}
                        value={date.date}
                        onChange={(value) =>
                          updateDate(date.id, {
                            ...date,
                            date: value,
                            isAnnounced: isPastDate(value) ? false : date.isAnnounced,
                          })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-venue`}>Venue</RequiredLabel>
                      <input
                        id={`${date.id}-venue`}
                        value={date.venue}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, venue: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-city`}>City</RequiredLabel>
                      <input
                        id={`${date.id}-city`}
                        value={date.city}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, city: event.target.value })
                        }
                      />
                    </div>
                    <div className="editor-field">
                      <label htmlFor={`${date.id}-region`}>Region</label>
                      <p className="editor-help">State, province, or region when needed.</p>
                      <input
                        id={`${date.id}-region`}
                        value={date.region ?? ''}
                        onChange={(event) => updateDateRegion(date, event.target.value)}
                      />
                    </div>
                    <div className="editor-field">
                      <RequiredLabel htmlFor={`${date.id}-country`}>Country</RequiredLabel>
                      <input
                        id={`${date.id}-country`}
                        value={date.country}
                        onChange={(event) =>
                          updateDate(date.id, { ...date, country: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  </div>
                  <div className="editor-subsection">
                    <div className="editor-subsection__header">
                      <h4>Ticketing and VIP</h4>
                      <p>
                        Add the public ticket link and select any VIP packages
                        available for this show.
                      </p>
                    </div>
                    <div className="editor-grid">
                      <div className="editor-field">
                        <label htmlFor={`${date.id}-ticket`}>Ticket URL</label>
                        <p className="editor-help">Leave blank if tickets are not public yet.</p>
                        <input
                          id={`${date.id}-ticket`}
                          value={date.ticketUrl ?? ''}
                          onChange={(event) =>
                            updateDate(date.id, {
                              ...date,
                              ticketUrl: optionalString(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div
                        aria-labelledby={`${date.id}-vip-packages-label`}
                        className="editor-field editor-field--wide"
                        role="group"
                      >
                      <span
                        className="editor-field__label"
                        id={`${date.id}-vip-packages-label`}
                      >
                        VIP packages for this date
                      </span>
                      <p className="editor-help">
                        {isVipExternalMode
                          ? 'VIP mode is External, so selected packages use the Default External URL.'
                          : 'Add packages from the VIP tab, then optionally override each package with a venue/date-specific URL.'}
                      </p>
                      {vipPackages.length > 0 ? (
                        <div className="editor-vip-package-picker">
                          <select
                            aria-label="Add VIP package to this date"
                            value=""
                            onChange={(event) =>
                              addVipPackageSelection(date, event.target.value)
                            }
                          >
                            <option value="">Select a VIP package...</option>
                            {availableVipPackages.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          {selectedVipPackages.length > 0 ? (
                            <div className="editor-list">
                              {selectedVipPackages.map((selection) => {
                                const vipPackage = vipPackages.find(
                                  (item) => item.id === selection.packageId,
                                )
                                const packageName =
                                  vipPackage?.name ?? selection.packageId

                                return (
                                  <article className="editor-item" key={selection.packageId}>
                                    <div className="editor-item__header">
                                      <h4>{packageName}</h4>
                                      <button
                                        className="editor-button"
                                        type="button"
                                        onClick={() =>
                                          removeVipPackageSelection(
                                            date,
                                            selection.packageId,
                                          )
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    {isVipExternalMode ? (
                                      <div className="editor-field">
                                        <label htmlFor={`${date.id}-${selection.packageId}-vip-url`}>
                                          Default External URL
                                        </label>
                                        <p className="editor-help">
                                          Controlled by the Main VIP site URL in the VIP tab.
                                        </p>
                                        <input
                                          id={`${date.id}-${selection.packageId}-vip-url`}
                                          readOnly
                                          value={defaultVipExternalUrl ?? ''}
                                        />
                                      </div>
                                    ) : (
                                      <div className="editor-field">
                                        <label htmlFor={`${date.id}-${selection.packageId}-vip-url`}>
                                          Date-specific package URL
                                        </label>
                                        <p className="editor-help">
                                          Example:
                                          `https://exampleartistvip.store/packagename/venueordate`.
                                        </p>
                                        <input
                                          id={`${date.id}-${selection.packageId}-vip-url`}
                                          value={selection.dateSpecificUrl ?? ''}
                                          onChange={(event) =>
                                            updateVipPackageSelection(
                                              date,
                                              selection.packageId,
                                              {
                                                ...selection,
                                                dateSpecificUrl: optionalString(
                                                  event.target.value,
                                                ),
                                              },
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </article>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="editor-empty">
                              Select packages from the dropdown for this tour date.
                            </p>
                          )}
                        </div>
                      ) : !isVipExternalMode ? (
                        <p className="editor-empty">
                          Create VIP packages in the VIP tab, then select them here.
                        </p>
                      ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="editor-subsection">
                    <div className="editor-subsection__header">
                      <h4>Lineup and status</h4>
                      <p>Add supporting acts and set public availability states.</p>
                    </div>
                    <div className="editor-grid">
                    <div className="editor-field editor-field--wide">
                      <label htmlFor={`${date.id}-supporting`}>
                        Supporting acts, comma separated
                      </label>
                      <p className="editor-help">Optional list shown under the location.</p>
                      <input
                        id={`${date.id}-supporting`}
                        value={date.supportingActs?.join(', ') ?? ''}
                        onChange={(event) => {
                          const supportingActs = parseCommaList(event.target.value)
                          updateDate(date.id, {
                            ...date,
                            supportingActs:
                              supportingActs.length > 0 ? supportingActs : undefined,
                          })
                        }}
                      />
                    </div>
                    </div>
                  <div className="editor-check-list">
                    <label className="editor-check">
                      <input
                        checked={date.isSoldOut}
                        type="checkbox"
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            isSoldOut: event.target.checked,
                          })
                        }
                      />
                      <span>Sold out</span>
                    </label>
                    <label className="editor-check">
                      <input
                        checked={date.isAnnounced && !isPastDate(date.date)}
                        disabled={isPastDate(date.date)}
                        type="checkbox"
                        onChange={(event) =>
                          updateDate(date.id, {
                            ...date,
                            isAnnounced: event.target.checked,
                          })
                        }
                      />
                      <span>Announced</span>
                    </label>
                  </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
        </div>
        <div className="editor-actions">
          <button
            className="editor-button editor-button--primary"
            type="button"
            onClick={addTourDate}
          >
            Add tour date
          </button>
        </div>
      </section>
        </>
      )}
    </div>
  )
}

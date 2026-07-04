export function RequiredLegend() {
  return (
    <div className="required-legend">
      <span className="required-legend__item">
        <span className="required-legend__badge required-legend__badge--required" aria-hidden="true">
          &#9733;
        </span>
        Required to publish
      </span>
      <span className="required-legend__item">
        <span className="required-legend__badge required-legend__badge--optional" aria-hidden="true">
          +
        </span>
        Optional
      </span>
    </div>
  )
}

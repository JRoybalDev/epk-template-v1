// Shared component: portable between projects. See ./README.md for the rules.
// Requires: react

import { useState, type ComponentPropsWithoutRef } from 'react'

type FallbackImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  alt: string
  src?: string
  /** Text shown in place of the image when `src` is missing or fails to load. */
  fallbackLabel?: string
}

/**
 * An <img> that renders a labelled placeholder instead of a broken image when
 * `src` is empty or fails to load. Changing `src` retries automatically.
 */
export function FallbackImage({
  alt,
  className,
  fallbackLabel = 'Image unavailable',
  onError,
  src,
  ...imgProps
}: FallbackImageProps) {
  // Remember which src failed, so a new src gets a fresh attempt without an effect.
  const [failedSrc, setFailedSrc] = useState<string>()

  if (!src || failedSrc === src) {
    return (
      <div className={className} data-state="image-unavailable" role="img" aria-label={alt || fallbackLabel}>
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return (
    <img
      {...imgProps}
      alt={alt}
      className={className}
      src={src}
      onError={(event) => {
        setFailedSrc(src)
        onError?.(event)
      }}
    />
  )
}

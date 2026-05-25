import { useState } from 'react'

type FallbackImageProps = {
  alt: string
  className?: string
  fallbackLabel?: string
  src?: string
}

export function FallbackImage({
  alt,
  className,
  fallbackLabel = 'Image unavailable',
  src,
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={className ? `epk-image-fallback ${className}` : 'epk-image-fallback'}>
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      src={src}
      onError={() => setHasError(true)}
    />
  )
}

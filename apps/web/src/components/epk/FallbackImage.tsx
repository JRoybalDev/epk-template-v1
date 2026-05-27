import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div className={className} data-state="image-unavailable">
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

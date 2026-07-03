import { useEffect, useRef, useState } from 'react'

const armedDurationMs = 3200

type ConfirmButtonProps = {
  className?: string
  confirmLabel?: string
  label: string
  onConfirm: () => void
}

export function ConfirmButton({
  className = 'editor-button',
  confirmLabel = 'Confirm remove?',
  label,
  onConfirm,
}: ConfirmButtonProps) {
  const [isArmed, setIsArmed] = useState(false)
  const disarmTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(disarmTimeoutRef.current), [])

  const disarm = () => {
    clearTimeout(disarmTimeoutRef.current)
    setIsArmed(false)
  }

  return (
    <button
      className={[
        className,
        'confirm-button',
        isArmed ? 'confirm-button--armed' : '',
      ].filter(Boolean).join(' ')}
      type="button"
      onBlur={disarm}
      onClick={() => {
        if (isArmed) {
          disarm()
          onConfirm()
          return
        }

        setIsArmed(true)
        clearTimeout(disarmTimeoutRef.current)
        disarmTimeoutRef.current = setTimeout(disarm, armedDurationMs)
      }}
    >
      {isArmed ? confirmLabel : label}
    </button>
  )
}

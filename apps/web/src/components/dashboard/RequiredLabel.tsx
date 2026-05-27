import type { ReactNode } from 'react'

type RequiredLabelProps = {
  children: ReactNode
  htmlFor: string
}

export function RequiredLabel({ children, htmlFor }: RequiredLabelProps) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      <span aria-hidden="true" className="editor-required">
        *
      </span>
      <span className="editor-sr-only">required</span>
    </label>
  )
}

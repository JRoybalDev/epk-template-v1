import type { CSSProperties } from 'react'
import type { EPK } from '../../../../packages/schema'

type Branding = EPK['branding']
type FontAssignment = NonNullable<
  NonNullable<Branding['fonts']>['assignments']
>[keyof NonNullable<NonNullable<Branding['fonts']>['assignments']>]

const cssVar = (name: string, value?: string) =>
  value ? ({ [name]: value } as CSSProperties) : {}

const escapeCssString = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

const fontFamily = (family?: string) => {
  if (!family) return undefined
  return `"${escapeCssString(family)}", var(--font-body)`
}

const fontRule = (selector: string, assignment?: FontAssignment) => {
  if (!assignment) return ''

  const declarations = [
    assignment.family ? `font-family: ${fontFamily(assignment.family)};` : '',
    assignment.weight ? `font-weight: ${assignment.weight};` : '',
    assignment.style ? `font-style: ${assignment.style};` : '',
    assignment.size ? `font-size: ${assignment.size};` : '',
    assignment.lineHeight ? `line-height: ${assignment.lineHeight};` : '',
    assignment.letterSpacing ? `letter-spacing: ${assignment.letterSpacing};` : '',
    assignment.textTransform ? `text-transform: ${assignment.textTransform};` : '',
  ].filter(Boolean)

  if (declarations.length === 0) return ''

  return `[data-template="epk-public-shell"] ${selector}{${declarations.join('')}}`
}

const googleImport = (
  font: NonNullable<NonNullable<Branding['fonts']>['googleFonts']>[number],
) => {
  const family = font.family.trim()
  if (!family) return ''

  const weights = font.weights?.trim() || '400;700'
  const familyParam = family.replace(/\s+/g, '+')

  return `@import url("https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weights}&display=swap");`
}

const uploadedFontFace = (
  font: NonNullable<NonNullable<Branding['fonts']>['uploadedFonts']>[number],
) => {
  if (!font.family.trim() || !font.source.trim()) return ''

  return [
    '@font-face{',
    `font-family:"${escapeCssString(font.family)}";`,
    `src:url("${escapeCssString(font.source)}");`,
    font.weight ? `font-weight:${font.weight};` : '',
    font.style ? `font-style:${font.style};` : '',
    'font-display:swap;',
    '}',
  ].filter(Boolean).join('')
}

export const getEPKBrandingStyle = (branding: Branding) => {
  const theme = branding.theme
  const variables: CSSProperties = {
    ...cssVar('--bg', theme?.bg),
    ...cssVar('--bg-alt', theme?.bgAlt),
    ...cssVar('--surface', theme?.surface),
    ...cssVar('--surface-strong', theme?.surfaceStrong),
    ...cssVar('--text', theme?.text),
    ...cssVar('--muted', theme?.muted),
    ...cssVar('--accent', theme?.accent ?? branding.accentColor),
    ...cssVar('--accent-strong', theme?.accentStrong),
    ...cssVar('--accent-soft', theme?.accentSoft),
    ...cssVar('--border', theme?.border),
    ...cssVar('--card-border', theme?.cardBorder),
    ...cssVar('--foam', theme?.foam),
    ...cssVar('--color-page', theme?.bg),
    ...cssVar('--color-surface', theme?.surface),
    ...cssVar('--color-surface-muted', theme?.bgAlt),
    ...cssVar('--color-surface-strong', theme?.surfaceStrong),
    ...cssVar('--color-text', theme?.text),
    ...cssVar('--color-text-muted', theme?.muted),
    ...cssVar('--color-border', theme?.border),
    ...cssVar('--color-border-strong', theme?.accentSoft),
    ...cssVar('--color-accent', theme?.accent ?? branding.accentColor),
    ...cssVar('--color-accent-hover', theme?.accentStrong),
    ...cssVar('--color-accent-contrast', theme?.foam),
  }
  const assignments = branding.fonts?.assignments
  const css = [
    ...(branding.fonts?.googleFonts ?? []).map(googleImport),
    ...(branding.fonts?.uploadedFonts ?? []).map(uploadedFontFace),
    '[data-template="epk-public-shell"]{background:var(--color-page);color:var(--color-text);font-family:var(--font-body);}',
    fontRule('', assignments?.body),
    fontRule('h1', assignments?.h1),
    fontRule('h2', assignments?.h2),
    fontRule('h3', assignments?.h3),
    fontRule('p', assignments?.p),
    fontRule('a', assignments?.a),
    fontRule('button', assignments?.button),
    fontRule('nav', assignments?.nav),
  ].filter(Boolean).join('\n')

  return { css, variables }
}

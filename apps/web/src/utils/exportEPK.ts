import type { EPK } from '../../../../packages/schema'

export const getEPKExportFilename = (data: Pick<EPK, 'artistName'>) => {
  const artistSlug =
    data.artistName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'artist'

  return `${artistSlug}-epk.json`
}

export const downloadEPKJson = (data: EPK) => {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = getEPKExportFilename(data)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

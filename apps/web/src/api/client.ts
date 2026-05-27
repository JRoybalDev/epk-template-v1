import {
  EPKSchema,
  formatValidationIssues,
  type EPK,
  type Video,
} from '../../../../packages/schema'

export const apiBaseUrl = '/api'

export type AssetType = 'photos' | 'branding' | 'assets' | 'fonts'
export type SaveEPKResponse = { ok: true; epk?: EPK }
export type UploadAssetResponse = { path: string }
export type YouTubeMetadataResponse = Pick<
  Video,
  'channelName' | 'publishedDate' | 'title' | 'type' | 'youtubeVideoId'
>

export class ApiClientError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown = null) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.payload = payload
  }
}

export const getEPKUrl = () => `${apiBaseUrl}/epk`
export const uploadUrl = (type: AssetType) => `${apiBaseUrl}/upload/${type}`
export const youtubeMetadataUrl = (urlOrId: string) =>
  `${apiBaseUrl}/youtube-metadata?url=${encodeURIComponent(urlOrId)}`

const parseFetchedEPK = (payload: unknown) => {
  const parsed = EPKSchema.safeParse(payload)

  if (!parsed.success) {
    const issues = formatValidationIssues(parsed.error)

    throw new ApiClientError(
      issues
        .map((issue) => `${issue.path || 'root'}: ${issue.message}`)
        .join('\n'),
      422,
      { error: 'Fetched EPK failed schema validation', issues },
    )
  }

  return parsed.data
}

const readResponsePayload = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === 'string' && payload.length > 0) return payload

  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    if (
      'issues' in payload &&
      Array.isArray(payload.issues) &&
      payload.issues.length > 0
    ) {
      return payload.issues
        .map((issue) => {
          if (!issue || typeof issue !== 'object') return null
          const path =
            'path' in issue && typeof issue.path === 'string' && issue.path.length > 0
              ? `${issue.path}: `
              : ''
          const message =
            'message' in issue && typeof issue.message === 'string'
              ? issue.message
              : 'Invalid value'

          return `${path}${message}`
        })
        .filter(Boolean)
        .join('\n')
    }

    return payload.error
  }

  return fallback
}

const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init)
  const payload = await readResponsePayload(response)

  if (!response.ok) {
    throw new ApiClientError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    )
  }

  return payload as T
}

const assertAdminKey = (adminKey: string) => {
  if (adminKey.trim().length === 0) {
    throw new ApiClientError('Admin key is required', 0)
  }
}

export const getEPK = async () =>
  parseFetchedEPK(await requestJson<unknown>(getEPKUrl(), { cache: 'no-store' }))

export const saveEPK = async (data: EPK, adminKey: string) => {
  assertAdminKey(adminKey)

  const response = await requestJson<SaveEPKResponse>(getEPKUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey,
    },
    body: JSON.stringify(data),
  })

  if (!response.epk) return response

  const rawEPK = response.epk as unknown
  const responseEPK =
    rawEPK &&
    typeof rawEPK === 'object' &&
    'tour' in rawEPK &&
    rawEPK.tour &&
    typeof rawEPK.tour === 'object' &&
    !('dateDisplayFormat' in rawEPK.tour)
      ? {
          ...(rawEPK as Record<string, unknown>),
          tour: {
            ...(rawEPK.tour as Record<string, unknown>),
            dateDisplayFormat: data.tour.dateDisplayFormat,
          },
        }
      : rawEPK

  return { ...response, epk: parseFetchedEPK(responseEPK) }
}

export const getYouTubeMetadata = (urlOrId: string) =>
  requestJson<YouTubeMetadataResponse>(youtubeMetadataUrl(urlOrId))

export const uploadAsset = (
  type: AssetType,
  file: File,
  adminKey: string,
) => {
  assertAdminKey(adminKey)

  const formData = new FormData()
  formData.append('file', file)

  return requestJson<UploadAssetResponse>(uploadUrl(type), {
    method: 'POST',
    headers: {
      'X-Admin-Key': adminKey,
    },
    body: formData,
  })
}

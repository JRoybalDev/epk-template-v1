import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EPK } from '../../../../packages/schema'
import { getEPK } from '../api/client'

export const epkQueryKey = ['epk'] as const
export const epkUpdatedStorageKey = 'epk-content-updated-at'
export const epkUpdatedEventName = 'epk-content-updated'
export const livePreviewDraftStorageKey = 'epk-dashboard-draft'
export const livePreviewQueryParam = 'livePreview'

export const isLivePreviewMode = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get(livePreviewQueryParam) === '1'

const readLivePreviewDraft = (): EPK | null => {
  try {
    const raw = window.localStorage.getItem(livePreviewDraftStorageKey)
    if (!raw) return null

    const parsed = JSON.parse(raw) as { state?: { draft?: EPK | null } }
    return parsed.state?.draft ?? null
  } catch {
    return null
  }
}

export const useEPK = (
  options?: Omit<
    UseQueryOptions<EPK, Error, EPK, typeof epkQueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryClient = useQueryClient()
  const livePreview = isLivePreviewMode()

  useEffect(() => {
    const refetchEPK = () => {
      void queryClient.invalidateQueries({ queryKey: epkQueryKey })
      void queryClient.refetchQueries({ queryKey: epkQueryKey, type: 'active' })
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === epkUpdatedStorageKey) {
        refetchEPK()
      }

      if (livePreview && event.key === livePreviewDraftStorageKey) {
        refetchEPK()
      }
    }

    window.addEventListener(epkUpdatedEventName, refetchEPK)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(epkUpdatedEventName, refetchEPK)
      window.removeEventListener('storage', handleStorage)
    }
  }, [queryClient, livePreview])

  return useQuery({
    queryKey: epkQueryKey,
    queryFn: livePreview
      ? async () => readLivePreviewDraft() ?? (await getEPK())
      : getEPK,
    staleTime: 1000 * 60,
    ...options,
  })
}

export const invalidateEPK = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: epkQueryKey })

export const broadcastEPKUpdate = () => {
  window.localStorage.setItem(epkUpdatedStorageKey, String(Date.now()))
  window.dispatchEvent(new Event(epkUpdatedEventName))
}

export const setCachedEPK = (queryClient: QueryClient, data: EPK) =>
  queryClient.setQueryData(epkQueryKey, data)

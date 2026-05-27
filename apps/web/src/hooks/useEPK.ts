import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EPK } from '../../../../packages/schema'
import { getEPK } from '../api/client'

export const epkQueryKey = ['epk'] as const
export const epkUpdatedStorageKey = 'epk-content-updated-at'
export const epkUpdatedEventName = 'epk-content-updated'

export const useEPK = (
  options?: Omit<
    UseQueryOptions<EPK, Error, EPK, typeof epkQueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const refetchEPK = () => {
      void queryClient.invalidateQueries({ queryKey: epkQueryKey })
      void queryClient.refetchQueries({ queryKey: epkQueryKey, type: 'active' })
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === epkUpdatedStorageKey) {
        refetchEPK()
      }
    }

    window.addEventListener(epkUpdatedEventName, refetchEPK)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(epkUpdatedEventName, refetchEPK)
      window.removeEventListener('storage', handleStorage)
    }
  }, [queryClient])

  return useQuery({
    queryKey: epkQueryKey,
    queryFn: getEPK,
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

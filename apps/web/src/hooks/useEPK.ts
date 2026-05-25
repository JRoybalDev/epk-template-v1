import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { EPK } from '../../../../packages/schema'
import { getEPK } from '../api/client'

export const epkQueryKey = ['epk'] as const

export const useEPK = (
  options?: Omit<
    UseQueryOptions<EPK, Error, EPK, typeof epkQueryKey>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: epkQueryKey,
    queryFn: getEPK,
    staleTime: 1000 * 60,
    ...options,
  })

export const invalidateEPK = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: epkQueryKey })

export const setCachedEPK = (queryClient: QueryClient, data: EPK) =>
  queryClient.setQueryData(epkQueryKey, data)

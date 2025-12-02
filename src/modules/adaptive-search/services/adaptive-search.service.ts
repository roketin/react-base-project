import { createQuery } from 'react-query-kit';
import http from '@/plugins/axios';
import type { TApiResponse } from '@/modules/app/types/api.type';
import type { TApiSearchResultItem } from '../types/adaptive-search.type';

export const SEARCH_ADAPTIVE_DATA = 'SEARCH_ADAPTIVE_DATA';

/**
 * Type for search query params
 */
type TSearchAdaptiveDataParams = {
  query: string;
  modules?: string[];
};

/**
 * Type for search response data
 */
type TSearchAdaptiveDataResponse = TApiResponse<TApiSearchResultItem[]>;

/**
 * React-Query hook to search dynamic data from API
 *
 * @example
 * const { data, isLoading } = useSearchAdaptiveData(
 *   { query: 'FAC-001' },
 *   { enabled: query.length >= 2 }
 * );
 */
export const useSearchAdaptiveData = createQuery<
  TSearchAdaptiveDataResponse,
  TSearchAdaptiveDataParams,
  Error
>({
  queryKey: [SEARCH_ADAPTIVE_DATA],
  fetcher: async (params, { signal }) => {
    const resp = await http.get<TSearchAdaptiveDataResponse>(
      '/api/search/adaptive',
      {
        params: {
          q: params.query,
          modules: params.modules?.join(','),
        },
        signal,
      },
    );
    return resp.data;
  },
  // Only fetch when query is not empty
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 60 * 1000, // 1 minute
});

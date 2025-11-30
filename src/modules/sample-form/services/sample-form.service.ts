import { createInfiniteQuery, createQuery } from 'react-query-kit';
import type {
  TApiResponsePaginate,
  TApiDefaultQueryParams,
} from '@/modules/app/types/api.type';
import type {
  TRickAndMortyCharacter,
  TRickAndMortyCharactersResponse,
  TSampleItem,
} from '@/modules/sample-form/types/sample-form.type';
import http from '@/plugins/axios';

export const GET_SAMPLE_LISTS = 'GET_SAMPLE_LISTS';
export const GET_SAMPLE_LISTS_INFINITE = 'GET_SAMPLE_LISTS_INFINITE';
export const GET_RM_CHARACTERS = 'GET_RM_CHARACTERS';

export const useGetSampleFormList = createQuery<
  TApiResponsePaginate<TSampleItem>,
  TApiDefaultQueryParams
>({
  queryKey: [GET_SAMPLE_LISTS],
  fetcher: async (params, { signal }) => {
    const resp = await http.get('/sample/list', { params, signal });
    return resp.data;
  },
});

export const useGetSampleFormInfiniteList = createInfiniteQuery<
  TApiResponsePaginate<TSampleItem>,
  TApiDefaultQueryParams
>({
  queryKey: [GET_SAMPLE_LISTS_INFINITE],
  initialPageParam: 1,
  fetcher: async (params, { pageParam = 1, signal }) => {
    const resp = await http.get<TApiResponsePaginate<TSampleItem>>(
      '/sample/list',
      {
        params: { ...params, page: pageParam },
        signal,
      },
    );
    return resp.data;
  },
  getNextPageParam: (lastPage) => {
    const { current_page, last_page } = lastPage.meta;
    if (current_page >= last_page) {
      return undefined;
    }
    return current_page + 1;
  },
});

export const useGetRickAndMortyCharactersInfinite = createInfiniteQuery<
  TRickAndMortyCharactersResponse<TRickAndMortyCharacter>,
  { name?: string }
>({
  queryKey: [GET_RM_CHARACTERS],
  initialPageParam: 1,
  fetcher: async (variables = {}, { pageParam = 1, signal }) => {
    const res = await http.get<
      TRickAndMortyCharactersResponse<TRickAndMortyCharacter>
    >('https://rickandmortyapi.com/api/character', {
      params: {
        page: pageParam,
        ...(variables.name ? { name: variables.name } : {}),
      },
      signal,
    });
    return res.data;
  },
  getNextPageParam: (lastPage) => {
    if (!lastPage.info.next) return undefined;
    const url = new URL(lastPage.info.next);
    const next = url.searchParams.get('page');
    return next ? Number(next) : undefined;
  },
});

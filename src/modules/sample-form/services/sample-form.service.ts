import {
  useAxiosInfiniteQuery,
  useAxiosQuery,
} from '@/modules/app/libs/query-utils';
import type {
  TApiResponsePaginate,
  TApiDefaultQueryParams,
} from '@/modules/app/types/api.type';
import type {
  TInfiniteQueryOpts,
  TQueryOpts,
} from '@/modules/app/types/react-query.type';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import http from '@/plugins/axios';

export const GET_SAMPLE_LISTS = Symbol();
export const GET_SAMPLE_LISTS_INFINITE = Symbol();

export const useGetSampleFormList = (
  params: TApiDefaultQueryParams,
  opt?: TQueryOpts<TApiResponsePaginate<TSampleItem>>,
) => {
  return useAxiosQuery<TApiResponsePaginate<TSampleItem>>({
    queryKey: [GET_SAMPLE_LISTS, params],
    queryFn: async ({ signal }) => {
      const resp = await http.get('/sample/list', { params, signal });
      return resp.data;
    },
    ...opt,
  });
};

export const useGetSampleFormInfiniteList = (
  params: TApiDefaultQueryParams = {},
  opt?: TInfiniteQueryOpts<
    TApiResponsePaginate<TSampleItem>,
    [typeof GET_SAMPLE_LISTS_INFINITE, TApiDefaultQueryParams],
    number
  >,
) => {
  return useAxiosInfiniteQuery({
    queryKey: [GET_SAMPLE_LISTS_INFINITE, params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1, signal }) => {
      const resp = await http.get('/sample/list', {
        params: { ...params, page: pageParam },
        signal,
      });
      return resp.data;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      if (current_page >= last_page) {
        return undefined;
      }
      return current_page + 1;
    },
    ...opt,
  });
};

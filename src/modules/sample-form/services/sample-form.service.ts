import { useAxiosQuery } from '@/modules/app/libs/query-utils';
import type {
  TApiResponsePaginate,
  TApiDefaultQueryParams,
} from '@/modules/app/types/api.type';
import type { TQueryOpts } from '@/modules/app/types/react-query.type';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import http from '@/plugins/axios';

export const GET_SAMPLE_LISTS = Symbol();

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

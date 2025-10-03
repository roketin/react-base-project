import type {
  TApiResponsePaginate,
  TApiDefaultQueryParams,
} from '@/modules/app/types/api.type';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import http from '@/plugins/axios';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const GET_SAMPLE_LISTS = Symbol();

export const useGetSampleFormList = (params: TApiDefaultQueryParams) => {
  return useQuery<
    TApiResponsePaginate<TSampleItem>,
    AxiosError,
    TApiResponsePaginate<TSampleItem>
  >({
    queryKey: [GET_SAMPLE_LISTS, params],
    queryFn: async () => {
      const resp = await http.get('/sample/list', { params });
      return resp.data;
    },
  });
};

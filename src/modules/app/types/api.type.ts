/**
 * Type for basic response
 */
export type TApiResponse<TData> = {
  status: string;
  data: TData;
  message: string;
};

/**
 * Type for pagination response
 */
export type TApiResponsePaginate<TData> = {
  status: string;
  data: TData[];
  meta: TApiResponsePaginateMeta;
  message: string;
};

/**
 * Type for meta pagination
 */
export type TApiResponsePaginateMeta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
};

/**
 * Type for default query params
 */
export type TApiDefaultQueryParams = Partial<{
  sort_order: string;
  sort_field: string;
  search: string;
  per_page: number;
  page: number;
}>;

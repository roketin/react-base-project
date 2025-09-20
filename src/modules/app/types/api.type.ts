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
  message: string;
  pagination: {
    count: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total_data: number;
  };
};

/**
 * Type for default query params
 */
export type TApiDefaultQueryParams = {
  sort_order: string;
  sort_field: string;
  search: string;
  per_page: number;
  page: number;
};

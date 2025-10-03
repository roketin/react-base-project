import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

/**
 * Custom hook that wraps React Query's useQuery with AxiosError as the default error type.
 * This hook is designed to handle data fetching operations where Axios is used as the HTTP client.
 * By defaulting the error type to AxiosError, it provides better type safety and error handling
 * for API requests made with Axios.
 *
 * Use this hook when you want to fetch data and automatically handle Axios-specific errors,
 * making it easier to manage API responses and errors in a consistent way throughout your application.
 *
 * @template TData - The expected shape of the data returned from the query.
 * @param {UseQueryOptions<TData, AxiosError>} options - Options to configure the query behavior.
 * @returns {UseQueryResult<TData, AxiosError>} - The result object containing query status, data, and error.
 */
export function useAxiosQuery<TData>(
  options: UseQueryOptions<TData, AxiosError>,
): UseQueryResult<TData, AxiosError> {
  return useQuery<TData, AxiosError>(options);
}

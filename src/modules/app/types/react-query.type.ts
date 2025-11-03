import type {
  QueryObserverOptions,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type TQueryOpts<
  TQueryFnData,
  TError = AxiosError,
  TData = TQueryFnData,
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData>,
  'queryKey' | 'queryFn'
>;

export type TInfiniteQueryOpts<
  TQueryFnData,
  TQueryKey extends QueryKey,
  TPageParam,
  TError = AxiosError,
  TData = InfiniteData<TQueryFnData>,
> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

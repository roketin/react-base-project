import type { QueryObserverOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type TQueryOpts<
  TQueryFnData,
  TError = AxiosError,
  TData = TQueryFnData,
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData>,
  'queryKey' | 'queryFn'
>;

import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { InfiniteData } from '@tanstack/react-query';
import type { BaseOptionType, DefaultOptionType } from 'rc-select/lib/Select';
import type { TRSelectProps } from '@/modules/app/components/base/r-select';

type InfiniteScrollConfig = NonNullable<
  TRSelectProps<unknown, DefaultOptionType>['infiniteScroll']
>;

type MinimalInfiniteQueryResult<TPage> = {
  data?: InfiniteData<TPage>;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

type UseInfiniteSelectOptionsParams<
  TPage,
  TOption extends BaseOptionType,
  TParams extends Record<string, unknown>,
  TResult extends MinimalInfiniteQueryResult<TPage>,
> = {
  baseParams: TParams;
  query: (params: TParams) => TResult;
  getPageItems: (page: TPage) => TOption[];
  searchParamKey?: string;
  initialSearchValue?: string;
};

type UseInfiniteSelectOptionsResult<
  TPage,
  TOption extends BaseOptionType,
  TParams extends Record<string, unknown>,
  TResult extends MinimalInfiniteQueryResult<TPage>,
> = {
  options: TOption[];
  infiniteScroll: InfiniteScrollConfig;
  isInitialLoading: boolean;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  queryParams: TParams;
  queryResult: TResult;
};

export function useInfiniteSelectOptions<
  TPage,
  TOption extends BaseOptionType = DefaultOptionType,
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TResult extends
    MinimalInfiniteQueryResult<TPage> = MinimalInfiniteQueryResult<TPage>,
>({
  baseParams,
  query,
  getPageItems,
  searchParamKey,
  initialSearchValue,
}: UseInfiniteSelectOptionsParams<
  TPage,
  TOption,
  TParams,
  TResult
>): UseInfiniteSelectOptionsResult<TPage, TOption, TParams, TResult> {
  const [searchValue, setSearchValue] = useState(initialSearchValue ?? '');

  const searchKey = searchParamKey ?? 'search';

  const queryParams = useMemo(() => {
    const params = { ...baseParams } as TParams & Record<string, unknown>;

    if (searchValue.trim() !== '') {
      params[searchKey] = searchValue;
    } else if (searchKey in params) {
      delete params[searchKey];
    }

    return params as TParams;
  }, [baseParams, searchKey, searchValue]);

  const queryResult = query(queryParams);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult;

  const options = useMemo(() => {
    if (!data) {
      return [] as TOption[];
    }

    return data.pages.flatMap((page) => getPageItems(page));
  }, [data, getPageItems]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const infiniteScroll = useMemo<InfiniteScrollConfig>(
    () => ({
      onLoadMore: handleLoadMore,
      hasMore: Boolean(hasNextPage),
      isLoading: isFetchingNextPage,
    }),
    [handleLoadMore, hasNextPage, isFetchingNextPage],
  );

  const isInitialLoading = isLoading && options.length === 0;

  return {
    options,
    infiniteScroll,
    isInitialLoading,
    searchValue,
    setSearchValue,
    queryParams,
    queryResult,
  };
}

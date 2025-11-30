import {
  useCallback,
  useEffect,
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
  baseParams?: TParams;
  query: (options: { variables: TParams }) => TResult;
  getPageItems: (page: TPage) => TOption[];
  searchParamKey?: string;
  initialSearchValue?: string;
  /**
   * Extra options to append (e.g. from detail API in edit mode).
   */
  appendOptions?: TOption[];
  /**
   * Deduplicate options by this key. If not provided, no deduplication will be performed.
   */
  deduplicateKey?: keyof TOption;
  /**
   * Debounce delay in milliseconds for search input (default: 300ms)
   */
  debounceMs?: number;
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
  TResult extends MinimalInfiniteQueryResult<TPage> =
    MinimalInfiniteQueryResult<TPage>,
>({
  baseParams,
  query,
  getPageItems,
  searchParamKey,
  initialSearchValue,
  appendOptions = [],
  deduplicateKey,
  debounceMs = 300,
}: UseInfiniteSelectOptionsParams<
  TPage,
  TOption,
  TParams,
  TResult
>): UseInfiniteSelectOptionsResult<TPage, TOption, TParams, TResult> {
  const [searchValue, setSearchValue] = useState(initialSearchValue ?? '');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(
    initialSearchValue ?? '',
  );

  const searchKey = searchParamKey ?? 'search';

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  const queryParams = useMemo(() => {
    const params = { ...(baseParams ?? {}) } as Record<string, unknown>;

    if (debouncedSearchValue.trim() !== '') {
      params[searchKey] = debouncedSearchValue;
    } else if (searchKey in params) {
      delete params[searchKey];
    }

    return params as TParams;
  }, [baseParams, searchKey, debouncedSearchValue]);

  const queryResult = query({ variables: queryParams } as Parameters<
    typeof query
  >[0]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult;

  const options = useMemo(() => {
    const collected = data
      ? data.pages.flatMap((page) => getPageItems(page))
      : [];

    const all = [...appendOptions, ...collected] as TOption[];

    if (!deduplicateKey) return all;

    const seen = new Set<string>();
    const unique: TOption[] = [];

    for (const item of all) {
      const key = String(
        deduplicateKey in item
          ? (item as Record<string, unknown>)[deduplicateKey as string]
          : undefined,
      );
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    return unique;
  }, [appendOptions, data, deduplicateKey, getPageItems]);

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

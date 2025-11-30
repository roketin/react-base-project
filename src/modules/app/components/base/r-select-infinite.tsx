import { memo } from 'react';
import RSelect from '@/modules/app/components/base/r-select';
import type { TRSelectProps } from '@/modules/app/components/base/r-select';
import type { BaseOptionType, DefaultOptionType } from 'rc-select/lib/Select';
import { useInfiniteSelectOptions } from '@/modules/app/hooks/use-infinite-select';
import type { InfiniteData } from '@tanstack/react-query';

type MinimalInfiniteQueryResult<TPage> = {
  data?: InfiniteData<TPage>;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

type RSelectInfiniteProps<
  TPage,
  TOption extends BaseOptionType = DefaultOptionType,
  TParams extends Record<string, unknown> = Record<string, unknown>,
> = Omit<
  TRSelectProps<unknown, TOption>,
  'options' | 'loading' | 'infiniteScroll' | 'searchValue' | 'onSearch'
> & {
  query: (options: { variables: TParams }) => MinimalInfiniteQueryResult<TPage>;
  getPageItems: (page: TPage) => TOption[];
  baseParams?: TParams;
  searchParamKey?: string;
  deduplicateKey?: keyof TOption;
  debounceMs?: number;
};

function RSelectInfiniteBase<
  TPage,
  TOption extends BaseOptionType = DefaultOptionType,
  TParams extends Record<string, unknown> = Record<string, unknown>,
>({
  query,
  getPageItems,
  baseParams,
  searchParamKey,
  deduplicateKey,
  debounceMs,
  ...selectProps
}: RSelectInfiniteProps<TPage, TOption, TParams>) {
  const {
    options,
    infiniteScroll,
    isInitialLoading,
    searchValue,
    setSearchValue,
  } = useInfiniteSelectOptions<TPage, TOption, TParams>({
    query,
    getPageItems,
    baseParams,
    searchParamKey,
    deduplicateKey,
    debounceMs,
  });

  return (
    <RSelect
      {...selectProps}
      options={options}
      loading={isInitialLoading}
      infiniteScroll={infiniteScroll}
      searchValue={searchValue}
      onSearch={setSearchValue}
    />
  );
}

export const RSelectInfinite = memo(
  RSelectInfiniteBase,
) as typeof RSelectInfiniteBase;

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  RVirtualScroll,
  type TRVirtualScrollProps,
} from '@/modules/app/components/base/r-virtual-scroll';

export type TRInfiniteScrollProps<Item> = {
  items: readonly Item[];
  renderItem: (item: Item, index: number) => ReactNode;
  loadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  emptyElement?: ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  manual?: boolean;
  initialLoad?: boolean;
  height?: number;
  itemHeight?: number;
  overscan?: number;
  onScrollPositionChange?: TRVirtualScrollProps<Item>['onScrollPositionChange'];
  endReachedThreshold?: number;
};

export function RInfiniteScroll<Item>({
  items,
  renderItem,
  loadMore,
  hasMore = true,
  isLoading = false,
  loader,
  endMessage,
  emptyElement,
  className,
  listClassName,
  itemClassName,
  manual = false,
  initialLoad = false,
  height,
  itemHeight = 72,
  overscan,
  onScrollPositionChange,
  endReachedThreshold,
}: TRInfiniteScrollProps<Item>) {
  const [shouldTriggerInitialLoad, setShouldTriggerInitialLoad] =
    useState(initialLoad);

  const loaderNode = useMemo(
    () =>
      loader ?? (
        <div className='flex items-center justify-center py-4 text-sm text-muted-foreground'>
          Loading more…
        </div>
      ),
    [loader],
  );

  const endNode = useMemo(
    () =>
      endMessage ?? (
        <div className='py-4 text-center text-xs text-muted-foreground'>
          You’ve reached the end.
        </div>
      ),
    [endMessage],
  );

  useEffect(() => {
    if (!shouldTriggerInitialLoad) return;
    if (!initialLoad) return;
    if (!loadMore) return;

    setShouldTriggerInitialLoad(false);
    void loadMore();
  }, [initialLoad, loadMore, shouldTriggerInitialLoad]);

  const handleLoadMore = manual ? undefined : loadMore;

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <RVirtualScroll<Item>
        className={cn('w-full', listClassName)}
        items={items}
        itemHeight={itemHeight}
        height={height}
        overscan={overscan}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        loader={loaderNode}
        emptyElement={emptyElement}
        onScrollPositionChange={onScrollPositionChange}
        endReachedThreshold={endReachedThreshold}
        renderItem={({ item, index, style }) => (
          <div style={style} className={cn('w-full', itemClassName)}>
            {renderItem(item, index)}
          </div>
        )}
      />
      {!hasMore && !isLoading ? endNode : null}
    </div>
  );
}

export default RInfiniteScroll;

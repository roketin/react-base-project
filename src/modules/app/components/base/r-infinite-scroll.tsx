import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRInfiniteScrollProps<Item> = {
  items: readonly Item[];
  renderItem: (item: Item, index: number) => ReactNode;
  loadMore: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
  listClassName?: string;
  threshold?: number;
  rootMargin?: string;
  manual?: boolean;
  initialLoad?: boolean;
};

export function RInfiniteScroll<Item>({
  items,
  renderItem,
  loadMore,
  hasMore = true,
  isLoading = false,
  loader,
  endMessage,
  className,
  listClassName,
  threshold = 0.1,
  rootMargin = '0px',
  manual = false,
  initialLoad = false,
}: TRInfiniteScrollProps<Item>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(initialLoad);

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

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      if (!hasMore || isLoading || manual) return;
      loadMore();
    },
    [hasMore, isLoading, manual, loadMore],
  );

  useEffect(() => {
    if (manual) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, manual, rootMargin, threshold]);

  useEffect(() => {
    if (!initialLoad || manual) return;
    if (isInitialLoad) {
      loadMore();
      setIsInitialLoad(false);
    }
  }, [initialLoad, isInitialLoad, loadMore, manual]);

  const renderList = useMemo(
    () =>
      items.map((item, index) => (
        <div key={index} className='w-full'>
          {renderItem(item, index)}
        </div>
      )),
    [items, renderItem],
  );

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className={cn('flex flex-col gap-3', listClassName)}>
        {renderList}
      </div>

      <div ref={sentinelRef} className='h-px w-full' aria-hidden='true' />

      {isLoading ? loaderNode : !hasMore ? endNode : null}
    </div>
  );
}

export default RInfiniteScroll;

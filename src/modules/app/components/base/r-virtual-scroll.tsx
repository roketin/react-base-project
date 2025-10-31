import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  ForwardedRef,
  ReactNode,
  Ref,
  UIEvent,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRVirtualScrollHandle = {
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
};

export type TRVirtualScrollProps<Item> = {
  items: readonly Item[];
  itemHeight: number;
  height?: number;
  overscan?: number;
  className?: string;
  innerClassName?: string;
  renderItem: (args: {
    item: Item;
    index: number;
    style: CSSProperties;
    isVisible: boolean;
  }) => ReactNode;
  getKey?: (item: Item, index: number) => React.Key;
  onRangeChange?: (range: { start: number; end: number }) => void;
  autoFocusIndex?: number;
  observeResize?: boolean;
  onResize?: (height: number) => void;
  onScrollPositionChange?: (info: {
    scrollTop: number;
    height: number;
  }) => void;
  endReachedThreshold?: number;
  onEndReached?: (info: { startIndex: number; endIndex: number }) => void;
  loadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
  loader?: ReactNode;
  emptyElement?: ReactNode;
  lazy?: boolean;
};

const DEFAULT_OVERSCAN = 4;

function getRange({
  scrollTop,
  height,
  itemHeight,
  count,
  overscan,
}: {
  scrollTop: number;
  height: number;
  itemHeight: number;
  count: number;
  overscan: number;
}) {
  const startIndex = Math.max(Math.floor(scrollTop / itemHeight) - overscan, 0);
  const endIndex = Math.min(
    count - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan,
  );

  return { startIndex, endIndex };
}

function useVirtualRange<Item>({
  items,
  height,
  itemHeight,
  overscan,
  onRangeChange,
}: {
  items: readonly Item[];
  height: number;
  itemHeight: number;
  overscan: number;
  onRangeChange?: (range: { start: number; end: number }) => void;
}) {
  const [{ startIndex, endIndex }, setRange] = useState(() =>
    getRange({
      scrollTop: 0,
      height,
      itemHeight,
      count: items.length,
      overscan,
    }),
  );

  const updateRange = useCallback(
    (scrollTop: number) => {
      setRange((prev) => {
        const next = getRange({
          scrollTop,
          height,
          itemHeight,
          count: items.length,
          overscan,
        });

        if (
          prev.startIndex === next.startIndex &&
          prev.endIndex === next.endIndex
        ) {
          return prev;
        }

        return next;
      });
    },
    [height, itemHeight, items.length, overscan],
  );

  useEffect(() => {
    onRangeChange?.({ start: startIndex, end: endIndex });
  }, [startIndex, endIndex, onRangeChange]);

  useEffect(() => {
    setRange(
      getRange({
        scrollTop: 0,
        height,
        itemHeight,
        count: items.length,
        overscan,
      }),
    );
  }, [height, itemHeight, items.length, overscan]);

  return { startIndex, endIndex, updateRange };
}

function RVirtualScrollInner<Item>(
  {
    items,
    itemHeight,
    height,
    overscan = DEFAULT_OVERSCAN,
    className,
    innerClassName,
    renderItem,
    getKey,
    onRangeChange,
    autoFocusIndex,
    observeResize = false,
    onResize,
    onScrollPositionChange,
    endReachedThreshold = 2,
    onEndReached,
    loadMore,
    hasMore = false,
    isLoading = false,
    loader,
    emptyElement,
    lazy = false,
  }: TRVirtualScrollProps<Item>,
  ref: ForwardedRef<TRVirtualScrollHandle>,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(
    height ?? null,
  );
  const [isInView, setIsInView] = useState(!lazy);
  const lastEndRef = useRef<number>(-1);

  const resolvedHeight = useMemo(() => {
    if (height !== undefined) return height;
    if (dynamicHeight && dynamicHeight > 0) return dynamicHeight;
    return 320;
  }, [dynamicHeight, height]);

  const { startIndex, endIndex, updateRange } = useVirtualRange<Item>({
    items,
    height: resolvedHeight,
    itemHeight,
    overscan,
    onRangeChange,
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        const node = containerRef.current;
        if (!node) return;
        const clamped = Math.max(0, Math.min(items.length - 1, index));
        node.scrollTo({
          top: clamped * itemHeight,
          behavior: 'smooth',
        });
      },
      scrollToTop: () => {
        const node = containerRef.current;
        node?.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [itemHeight, items.length],
  );

  useEffect(() => {
    if (
      autoFocusIndex === undefined ||
      autoFocusIndex < 0 ||
      autoFocusIndex >= items.length
    ) {
      return;
    }

    const node = containerRef.current;
    if (node) {
      node.scrollTo({ top: autoFocusIndex * itemHeight });
    }
  }, [autoFocusIndex, itemHeight, items.length]);

  const totalHeight = items.length * itemHeight;

  const visibleItems = useMemo(() => {
    const slice: Array<{ item: Item | undefined; index: number; top: number }> =
      [];
    for (let index = startIndex; index <= endIndex; index += 1) {
      const item = items[index];
      if (item === undefined) continue;
      const top = index * itemHeight;
      slice.push({
        item,
        index,
        top,
      });
    }
    return slice;
  }, [endIndex, itemHeight, items, startIndex]);

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    updateRange(event.currentTarget.scrollTop);
    onScrollPositionChange?.({
      scrollTop: event.currentTarget.scrollTop,
      height: resolvedHeight,
    });
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    if (!observeResize) {
      if (height === undefined) {
        setDynamicHeight(node.clientHeight);
      }
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextHeight = entry.contentRect.height;
      setDynamicHeight(nextHeight);
      onResize?.(nextHeight);
    });

    observer.observe(node);
    resizeObserverRef.current = observer;

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;
    };
  }, [height, observeResize, onResize]);

  useEffect(() => {
    if (!lazy) return;
    const node = containerRef.current;
    if (!node) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
        }
      },
      { root: null, threshold: 0.1 },
    );

    intersectionObserver.observe(node);

    return () => intersectionObserver.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!isInView) return;
    if (!items.length) return;

    if (endIndex >= items.length - 1 - endReachedThreshold) {
      if (onEndReached && lastEndRef.current !== endIndex) {
        onEndReached({ startIndex, endIndex });
      }

      if (
        loadMore &&
        hasMore &&
        !isLoading &&
        lastEndRef.current !== endIndex
      ) {
        loadMore();
      }

      lastEndRef.current = endIndex;
    }
  }, [
    endIndex,
    endReachedThreshold,
    hasMore,
    isInView,
    isLoading,
    items.length,
    loadMore,
    onEndReached,
    startIndex,
  ]);

  const showEmpty = !isLoading && items.length === 0 && emptyElement;

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-auto', className)}
      style={{ height: resolvedHeight }}
      onScroll={handleScroll}
    >
      {showEmpty ? (
        <div className='flex h-full w-full items-center justify-center'>
          {emptyElement}
        </div>
      ) : null}

      <div
        className={cn('relative min-h-full w-full', innerClassName)}
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index, top }) => {
          const key = getKey?.(item as Item, index) ?? index;
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top,
                height: itemHeight,
                left: 0,
                right: 0,
              }}
            >
              {renderItem({
                item: item as Item,
                index,
                style: { height: itemHeight },
                isVisible: index >= startIndex && index <= endIndex,
              })}
            </div>
          );
        })}
      </div>
      {isLoading ? (
        <div className='flex w-full items-center justify-center py-3 text-sm text-muted-foreground'>
          {loader ?? 'Loading…'}
        </div>
      ) : null}
    </div>
  );
}

// Generic helper to preserve type inference
type TRVirtualScrollComponent = {
  <Item>(
    props: TRVirtualScrollProps<Item> & { ref?: Ref<TRVirtualScrollHandle> },
  ): ReturnType<typeof RVirtualScrollInner>;
};

const RVirtualScrollBase = forwardRef<
  TRVirtualScrollHandle,
  TRVirtualScrollProps<unknown>
>(RVirtualScrollInner);

export const RVirtualScroll =
  RVirtualScrollBase as unknown as TRVirtualScrollComponent;

export default RVirtualScroll;

// eslint-disable-next-line react-refresh/only-export-components
export function buildPaginationParams(
  range: { startIndex: number; endIndex: number },
  pageSize: number,
) {
  const offset = range.startIndex;
  const limit = Math.min(pageSize, range.endIndex - range.startIndex + 1);
  const page = Math.floor(range.startIndex / pageSize) + 1;

  return {
    page,
    pageSize,
    offset,
    limit,
  };
}

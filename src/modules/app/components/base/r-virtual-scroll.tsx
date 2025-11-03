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
  Key,
  ReactNode,
  Ref,
  UIEvent,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/modules/app/libs/utils';
import type { PaginationRange } from '@/modules/app/libs/paginate-utils';

export type TRVirtualScrollHandle = {
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
};

export type TRVirtualRange = PaginationRange;

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
  getKey?: (item: Item, index: number) => Key;
  onRangeChange?: (range: TRVirtualRange) => void;
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

  const estimateSize = useCallback(() => itemHeight, [itemHeight]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  const rangeStart = virtualItems[0]?.index ?? 0;
  const rangeEnd = virtualItems[virtualItems.length - 1]?.index ?? -1;

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        if (!items.length) return;
        const clamped = Math.max(0, Math.min(items.length - 1, index));
        virtualizer.scrollToIndex(clamped, {
          align: 'start',
          behavior: 'smooth',
        });
      },
      scrollToTop: () => {
        if (!items.length) {
          containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        virtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
      },
    }),
    [items.length, virtualizer],
  );

  useEffect(() => {
    if (
      autoFocusIndex === undefined ||
      autoFocusIndex < 0 ||
      autoFocusIndex >= items.length
    ) {
      return;
    }

    virtualizer.scrollToIndex(autoFocusIndex, { align: 'start' });
  }, [autoFocusIndex, items.length, virtualizer]);

  useEffect(() => {
    if (!onRangeChange) return;

    if (virtualItems.length === 0) {
      onRangeChange({
        startIndex: 0,
        endIndex: items.length ? items.length - 1 : -1,
      });
      return;
    }

    onRangeChange({ startIndex: rangeStart, endIndex: rangeEnd });
  }, [items.length, onRangeChange, rangeEnd, rangeStart, virtualItems.length]);

  const handleScroll = (event: UIEvent<HTMLElement>) => {
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
      virtualizer.measure();
    });

    observer.observe(node);
    resizeObserverRef.current = observer;

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;
    };
  }, [height, observeResize, onResize, virtualizer]);

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
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= items.length - 1 - endReachedThreshold) {
      if (onEndReached && lastEndRef.current !== lastItem.index) {
        onEndReached({ startIndex: rangeStart, endIndex: lastItem.index });
      }

      if (
        loadMore &&
        hasMore &&
        !isLoading &&
        lastEndRef.current !== lastItem.index
      ) {
        void loadMore();
      }

      lastEndRef.current = lastItem.index;
    }
  }, [
    endReachedThreshold,
    hasMore,
    isInView,
    isLoading,
    items.length,
    loadMore,
    onEndReached,
    rangeStart,
    virtualItems,
  ]);

  useEffect(() => {
    if (items.length === 0) {
      lastEndRef.current = -1;
    }
  }, [items.length]);

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
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (item === undefined) return null;
          const key =
            getKey?.(item, virtualItem.index) ??
            virtualItem.key ??
            virtualItem.index;
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                height: virtualItem.size,
              }}
            >
              {renderItem({
                item,
                index: virtualItem.index,
                style: { height: virtualItem.size },
                isVisible: true,
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

import { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, Ref } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  RVirtualScroll,
  type TRVirtualScrollProps,
  type TRVirtualScrollHandle,
} from '@/modules/app/components/base/r-virtual-scroll';

type RenderItemOptions = {
  index: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
};

export type TRListVirtualProps<Item> = Pick<
  TRVirtualScrollProps<Item>,
  'height' | 'itemHeight' | 'overscan'
> & {
  enabled?: boolean;
};

export type TRListProps<Item extends Record<string, unknown>> = {
  items: readonly Item[];
  renderItem: (item: Item, options: RenderItemOptions) => ReactNode;
  getKey?: (item: Item, index: number) => React.Key;
  className?: string;
  listClassName?: string;
  emptyContent?: ReactNode | ((info: { count: number }) => ReactNode);
  role?: string;
  as?: keyof JSX.IntrinsicElements;
  virtual?: TRListVirtualProps<Item>;
  itemClassName?: string | ((item: Item, index: number) => string | undefined);
};

function resolveEmptyContent<Item extends Record<string, unknown>>(
  emptyContent: TRListProps<Item>['emptyContent'],
  count: number,
) {
  if (typeof emptyContent === 'function') {
    return emptyContent({ count });
  }
  return (
    emptyContent ?? (
      <div className='flex items-center justify-center rounded-md border border-dashed border-border/60 px-4 py-8 text-sm text-muted-foreground'>
        No items to display.
      </div>
    )
  );
}

function RListInnerComponent<Item extends Record<string, unknown>>(
  {
    items,
    renderItem,
    getKey,
    className,
    listClassName,
    emptyContent,
    role = 'list',
    as: As = 'div',
    virtual,
    itemClassName,
  }: TRListProps<Item>,
  ref: ForwardedRef<TRVirtualScrollHandle>,
) {
  if (!items || items.length === 0) {
    return (
      <As className={cn('w-full', className)}>
        {resolveEmptyContent<Item>(emptyContent, 0)}
      </As>
    );
  }

  const commonListProps = {
    role,
    className: cn('w-full space-y-2', listClassName),
  };

  if (virtual?.enabled) {
    return (
      <RVirtualScroll<Item>
        ref={ref}
        items={items}
        itemHeight={virtual.itemHeight}
        height={virtual.height}
        overscan={virtual.overscan}
        className={cn('w-full rounded-lg border border-border/60', className)}
        renderItem={({ item, index }) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const content = renderItem(item, {
            index,
            count: items.length,
            isFirst,
            isLast,
          });

          const resolvedItemClass =
            typeof itemClassName === 'function'
              ? itemClassName(item, index)
              : itemClassName;

          return (
            <div
              role='listitem'
              className={cn(
                'h-full border-border/40 bg-background/80 px-4 py-3',
                !isLast && 'border-b',
                isLast && 'border-b-0',
                resolvedItemClass,
              )}
            >
              {content}
            </div>
          );
        }}
        getKey={getKey}
      />
    );
  }

  return (
    <As className={cn('w-full', className)}>
      <div {...commonListProps}>
        {items.map((item, index) => {
          const key = getKey?.(item, index) ?? index;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const resolvedItemClass =
            typeof itemClassName === 'function'
              ? itemClassName(item, index)
              : itemClassName;

          return (
            <div
              key={key}
              role='listitem'
              className={cn(
                'rounded-lg border border-border/60 bg-background/80 px-4 py-3 shadow-sm',
                resolvedItemClass,
              )}
            >
              {renderItem(item, {
                index,
                count: items.length,
                isFirst,
                isLast,
              })}
            </div>
          );
        })}
      </div>
    </As>
  );
}

export const RList = forwardRef(RListInnerComponent) as <
  Item extends Record<string, unknown>,
>(
  props: TRListProps<Item> & { ref?: Ref<TRVirtualScrollHandle> },
) => ReturnType<typeof RListInnerComponent>;

export default RList;
export type { TRListProps, TRListVirtualProps };

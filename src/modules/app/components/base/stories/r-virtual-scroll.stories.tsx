import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';
import {
  RVirtualScroll,
  type TRVirtualScrollProps,
  buildPaginationParams,
} from '../r-virtual-scroll';
import RBtn from '@/modules/app/components/base/r-btn';

type Activity = {
  id: number;
  user: string;
  action: string;
};

const meta: Meta<typeof RVirtualScroll<Activity>> = {
  title: 'Base/Data Display/RVirtualScroll',
  component: RVirtualScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    itemHeight: 64,
    overscan: 4,
  },
  argTypes: {
    renderItem: { control: false },
    items: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof RVirtualScroll<Activity>>;

const generateActivities = (page: number, pageSize: number): Activity[] =>
  Array.from({ length: pageSize }, (_, index) => {
    const id = page * pageSize + index + 1;
    return {
      id,
      user: `User ${id}`,
      action: id % 2 === 0 ? 'updated documentation' : 'deployed new version',
    };
  });

export const Playground: Story = {
  render: (args) => {
    const pageSize = 15;
    const [items, setItems] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [range, setRange] = useState<{
      startIndex: number;
      endIndex: number;
    }>({
      startIndex: 0,
      endIndex: 0,
    });

    const loadMore = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const nextPage = page + 1;
      const nextItems = generateActivities(nextPage, pageSize);
      setItems((prev) => [...prev, ...nextItems]);
      setPage(nextPage);
      setIsLoading(false);
      if (nextPage >= 6) {
        setHasMore(false);
      }
    };

    useEffect(() => {
      loadMore();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pagination = useMemo(
      () => buildPaginationParams(range, pageSize),
      [range, pageSize],
    );

    const renderItem: TRVirtualScrollProps<Activity>['renderItem'] = ({
      item,
      index,
    }) => (
      <div className='flex h-full items-center justify-between rounded-md border border-transparent px-4 py-2 transition hover:border-border/60 hover:bg-muted/40'>
        <div className='flex flex-col'>
          <span className='font-medium text-foreground'>{item.user}</span>
          <span className='text-sm text-muted-foreground'>{item.action}</span>
        </div>
        <span className='text-xs text-muted-foreground'>Row #{index + 1}</span>
      </div>
    );

    return (
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-border/60 bg-background p-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-lg font-semibold'>Virtualized activity feed</h2>
            <p className='text-sm text-muted-foreground'>
              Resize, lazy load, and auto pagination helpers.
            </p>
          </div>
          <div className='rounded-lg border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground'>
            Page {pagination.page} • Offset {pagination.offset} • Limit{' '}
            {pagination.limit}
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-[1fr_280px]'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between text-xs text-muted-foreground'>
              <span>
                {items.length
                  ? `Showing rows ${Math.min(range.startIndex + 1, items.length)} - ${Math.min(range.endIndex + 1, items.length)} of ${items.length}`
                  : 'No rows loaded yet'}
              </span>
              <span>
                {hasMore ? 'Auto loads remaining rows' : 'All data loaded'}
              </span>
            </div>

            <div className='max-h-[420px] min-h-80 rounded-xl border border-border/60 bg-background/80'>
              <RVirtualScroll<Activity>
                {...args}
                items={items}
                loadMore={loadMore}
                hasMore={hasMore}
                isLoading={isLoading}
                onRangeChange={(range) =>
                  setRange({ startIndex: range.start, endIndex: range.end })
                }
                onScrollPositionChange={(info) => {
                  // eslint-disable-next-line no-console
                  console.debug('Scroll position', info);
                }}
                endReachedThreshold={3}
                loader={<span>Loading additional items…</span>}
                emptyElement={
                  <span className='text-sm text-muted-foreground'>
                    No activity yet.
                  </span>
                }
                renderItem={renderItem}
                height={360}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm'>
            <p className='font-semibold text-foreground'>Try it out</p>
            <p className='text-muted-foreground'>
              Adjust the height or simulate pagination.
            </p>
            <RBtn
              variant='outline'
              onClick={() => {
                setItems([]);
                setPage(0);
                setHasMore(true);
                setRange({ startIndex: 0, endIndex: 0 });
                loadMore();
              }}
            >
              Reset data
            </RBtn>
          </div>
        </div>
      </div>
    );
  },
};

export const LazyAutoHeight: Story = {
  render: (args) => {
    const [items, setItems] = useState<Activity[]>([]);
    const [height, setHeight] = useState(240);

    useEffect(() => {
      setItems(generateActivities(0, 40));
    }, []);

    return (
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-border/60 bg-background p-6'>
        <label className='flex items-center justify-between text-sm'>
          Container height
          <input
            type='range'
            min={200}
            max={480}
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
          />
        </label>
        <p className='text-xs text-muted-foreground'>
          Resize the slider to watch the virtual list adapt.
        </p>

        <div
          className='overflow-hidden rounded-xl border border-border/60 bg-background/80'
          style={{ height }}
        >
          <RVirtualScroll<Activity>
            {...args}
            items={items}
            renderItem={({ item }) => (
              <div className='flex h-full items-center gap-3 px-4'>
                <span className='font-medium'>{item.user}</span>
                <span className='text-xs text-muted-foreground'>
                  {item.action}
                </span>
              </div>
            )}
            observeResize
            height={height}
          />
        </div>
      </div>
    );
  },
};

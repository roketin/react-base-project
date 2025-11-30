import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import RInfiniteScroll from '../r-infinite-scroll';
import RBtn from '@/modules/app/components/base/r-btn';

type Item = {
  id: number;
  title: string;
  body: string;
};

const meta: Meta<typeof RInfiniteScroll<Item>> = {
  title: 'Components/Other/RInfiniteScroll',
  component: RInfiniteScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RInfiniteScroll<Item>>;

export const Playground: Story = {
  render: () => {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const nextPage = page + 1;
      const nextItems = Array.from({ length: 10 }, (_, index) => {
        const id = nextPage * 10 + index + 1;
        return {
          id,
          title: `Activity #${id}`,
          body: 'User triggered an event that generated a new log entry in the admin console.',
        };
      });
      setItems((prev) => [...prev, ...nextItems]);
      setPage(nextPage);
      setIsLoading(false);
      if (nextPage >= 4) {
        setHasMore(false);
      }
    };

    useEffect(() => {
      loadMore();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className='mx-auto flex  w-full max-w-3xl flex-col rounded-2xl border border-border/60 bg-background p-6'>
        <h2 className='text-lg font-semibold'>Recent activity</h2>
        <p className='text-sm text-muted-foreground'>
          Scroll to load more entries. Data is simulated locally.
        </p>

        <div className='mt-4 flex-1 overflow-y-auto rounded-xl border border-border/60 bg-background/80 p-4'>
          <RInfiniteScroll<Item>
            items={items}
            loadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            height={360}
            itemHeight={96}
            itemClassName='px-1 py-1'
            renderItem={(item) => (
              <div className='flex h-full w-full flex-col justify-center space-y-1 rounded-lg border border-transparent px-3 py-3 transition hover:border-border/60 hover:bg-muted/30'>
                <p className='font-medium leading-tight'>{item.title}</p>
                <p className='text-sm text-muted-foreground'>{item.body}</p>
              </div>
            )}
          />
        </div>
      </div>
    );
  },
};

export const ManualTrigger: Story = {
  render: () => {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
      if (isLoading) return;
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const nextPage = page + 1;
      const nextItems = Array.from({ length: 5 }, (_, index) => {
        const id = nextPage * 5 + index + 1;
        return {
          id,
          title: `Manual item ${id}`,
          body: 'Loaded using the manual trigger mode.',
        };
      });
      setItems((prev) => [...prev, ...nextItems]);
      setPage(nextPage);
      setIsLoading(false);
      if (nextPage >= 3) {
        setHasMore(false);
      }
    };

    useEffect(() => {
      loadMore();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className='mx-auto flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border/60 bg-background p-6'>
        <RInfiniteScroll<Item>
          items={items}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          manual
          height={320}
          itemHeight={88}
          itemClassName='px-1 py-1'
          renderItem={(item) => (
            <div className='flex h-full w-full flex-col justify-center rounded-lg border border-border/60 bg-background/80 px-4 py-3'>
              <p className='font-medium leading-tight'>{item.title}</p>
              <p className='text-xs text-muted-foreground'>{item.body}</p>
            </div>
          )}
        />
        {hasMore ? (
          <RBtn onClick={loadMore} disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Load more'}
          </RBtn>
        ) : (
          <span className='text-center text-xs text-muted-foreground'>
            All items loaded.
          </span>
        )}
      </div>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RDataList } from '@/modules/app/components/base/r-data-list';
import type { TApiResponsePaginateMeta } from '@/modules/app/types/api.type';
import type { TRMenuItem } from '@/modules/app/components/base/r-menu';
import {
  ArrowUpAZ,
  ArrowDownAZ,
  ArrowUpDown,
  Pencil,
  Trash,
} from 'lucide-react';
import RBtn from '@/modules/app/components/base/r-btn';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';

const meta = {
  title: 'Components/Data Display/RDataList',
  component: RDataList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RDataList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data types
type MockItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  deletable?: boolean;
};

// Mock data
const mockItems: MockItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  description: `This is a description for item ${i + 1}`,
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  deletable: i % 3 !== 0, // Every 3rd item is not deletable
}));

// Mock pagination meta
const createMockMeta = (
  page: number,
  perPage: number,
  total: number,
): TApiResponsePaginateMeta => ({
  current_page: page,
  per_page: perPage,
  total,
  last_page: Math.ceil(total / perPage),
  from: (page - 1) * perPage + 1,
  to: Math.min(page * perPage, total),
});

// Simple render function
const renderSimpleItem = (item: MockItem, { index }: { index: number }) => (
  <div className='flex items-start gap-3'>
    <span className='mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground'>
      {index + 1}
    </span>
    <div className='flex-1 space-y-1'>
      <div className='font-semibold text-primary'>{item.name}</div>
      <p className='text-sm text-muted-foreground'>{item.description}</p>
      <p className='text-xs text-muted-foreground'>
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

// Render with actions
const renderItemWithActions = (
  item: MockItem,
  { index }: { index: number },
) => (
  <div className='flex flex-row justify-between gap-2'>
    <div className='flex items-start gap-3'>
      <span className='mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground'>
        {index + 1}
      </span>
      <div className='space-y-1'>
        <div className='font-semibold text-primary'>{item.name}</div>
        <p className='text-sm text-muted-foreground'>{item.description}</p>
        <p className='text-xs text-muted-foreground'>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className='flex items-center gap-2 self-start sm:self-center'>
      <RTooltip content='Edit'>
        <RBtn variant='outline' iconStart={<Pencil />} size='iconSm' />
      </RTooltip>
      {item.deletable && (
        <RTooltip content='Delete'>
          <RBtn
            iconStart={<Trash />}
            variant='soft-destructive'
            size='iconSm'
          />
        </RTooltip>
      )}
    </div>
  </div>
);

// Sort menu items
const sortMenuItems: TRMenuItem[] = [
  {
    id: 'name-asc',
    label: 'Name (A-Z)',
    icon: <ArrowUpAZ className='size-4' />,
    onSelect: () => console.log('Sort by name ascending'),
  },
  {
    id: 'name-desc',
    label: 'Name (Z-A)',
    icon: <ArrowDownAZ className='size-4' />,
    onSelect: () => console.log('Sort by name descending'),
  },
  {
    id: 'reset',
    label: 'Reset Sort',
    icon: <ArrowUpDown className='size-4' />,
    dividerAbove: true,
    onSelect: () => console.log('Reset sort'),
  },
];

// Basic story
export const Basic: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    allowSearch: false,
    allowSort: false,
    pagination: false,
  },
};

// With search
export const WithSearch: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    allowSearch: true,
    searchPlaceholder: 'Search items...',
    allowSort: false,
    pagination: false,
  },
};

// With sorting
export const WithSort: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    allowSearch: false,
    allowSort: true,
    sortItems: sortMenuItems,
    activeSortLabel: 'Sort',
    pagination: false,
  },
};

// With search and sort
export const WithSearchAndSort: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    allowSearch: true,
    searchPlaceholder: 'Search items...',
    allowSort: true,
    sortItems: sortMenuItems,
    activeSortLabel: 'Name (A-Z)',
    pagination: false,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    items: [],
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    loading: true,
    loadingRows: 5,
    allowSearch: true,
    allowSort: true,
    sortItems: sortMenuItems,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    items: [],
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    allowSearch: true,
    allowSort: true,
    sortItems: sortMenuItems,
  },
};

// With pagination
export const WithPagination: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderSimpleItem,
    meta: createMockMeta(1, 10, 50),
    pagination: true,
    allowSearch: true,
    allowSort: true,
    sortItems: sortMenuItems,
  },
};

// With actions
export const WithActions: Story = {
  args: {
    items: mockItems.slice(0, 10),
    getKey: (item: MockItem) => item.id,
    renderItem: renderItemWithActions,
    meta: createMockMeta(1, 10, 50),
    pagination: true,
    allowSearch: true,
    searchPlaceholder: 'Search items...',
    allowSort: true,
    sortItems: sortMenuItems,
    activeSortLabel: 'Sort',
  },
};

// Interactive story with state management
export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string | undefined>();

    const perPage = 10;

    // Filter items based on search
    const filteredItems = mockItems.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    );

    // Sort items
    let sortedItems = [...filteredItems];
    if (sortBy === 'name-asc') {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Paginate items
    const paginatedItems = sortedItems.slice(
      (page - 1) * perPage,
      page * perPage,
    );
    const meta = createMockMeta(page, perPage, sortedItems.length);

    const handleChange = (params: Record<string, unknown>) => {
      if (params.page !== undefined) {
        setPage(params.page as number);
      }
      if (params.search !== undefined) {
        setSearch(params.search as string);
        setPage(1); // Reset to page 1 on search
      }
    };

    const sortItems: TRMenuItem[] = [
      {
        id: 'name-asc',
        label: 'Name (A-Z)',
        icon: <ArrowUpAZ className='size-4' />,
        onSelect: () => {
          setSortBy('name-asc');
          setPage(1);
        },
      },
      {
        id: 'name-desc',
        label: 'Name (Z-A)',
        icon: <ArrowDownAZ className='size-4' />,
        onSelect: () => {
          setSortBy('name-desc');
          setPage(1);
        },
      },
      {
        id: 'reset',
        label: 'Reset Sort',
        icon: <ArrowUpDown className='size-4' />,
        dividerAbove: true,
        onSelect: () => {
          setSortBy(undefined);
          setPage(1);
        },
      },
    ];

    const activeSortLabel =
      sortBy === 'name-asc'
        ? 'Name (A-Z)'
        : sortBy === 'name-desc'
          ? 'Name (Z-A)'
          : 'Sort';

    return (
      <RDataList
        items={paginatedItems}
        getKey={(item) => item.id}
        renderItem={renderItemWithActions}
        meta={meta}
        onChange={handleChange}
        allowSearch
        searchPlaceholder='Search items...'
        initialSearch={search}
        allowSort
        sortItems={sortItems}
        activeSortLabel={activeSortLabel}
        pagination
      />
    );
  },
};

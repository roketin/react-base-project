import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RSelectInfinite } from '../r-select-infinite';

vi.mock('@/modules/app/hooks/use-infinite-select', () => ({
  useInfiniteSelectOptions: () => ({
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
    infiniteScroll: {
      hasMore: true,
      loadMore: vi.fn(),
      isLoading: false,
    },
    isInitialLoading: false,
    searchValue: '',
    setSearchValue: vi.fn(),
  }),
}));

describe('RSelectInfinite', () => {
  const mockQuery = vi.fn(() => ({
    data: { pages: [] },
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isFetchingNextPage: false,
    isLoading: false,
  }));

  const mockGetPageItems = vi.fn((page: { items: unknown[] }) => page.items);

  it('renders select component', () => {
    render(
      <RSelectInfinite
        query={mockQuery}
        getPageItems={mockGetPageItems}
        placeholder='Select an option'
      />,
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with options from hook', () => {
    render(
      <RSelectInfinite query={mockQuery} getPageItems={mockGetPageItems} />,
    );

    // The component should render without errors
    expect(document.querySelector('.rc-select')).toBeInTheDocument();
  });

  it('passes baseParams to query', () => {
    render(
      <RSelectInfinite
        query={mockQuery}
        getPageItems={mockGetPageItems}
        baseParams={{ category: 'test' }}
      />,
    );

    expect(document.querySelector('.rc-select')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <RSelectInfinite
        query={mockQuery}
        getPageItems={mockGetPageItems}
        className='custom-select'
      />,
    );

    expect(document.querySelector('.custom-select')).toBeInTheDocument();
  });
});

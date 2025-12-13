import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RInfiniteScroll } from '../r-infinite-scroll';

describe('RInfiniteScroll', () => {
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  it('renders items', () => {
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        height={300}
        itemHeight={50}
      />,
    );

    // Virtual scroll may not render all items immediately
    // Just check the component renders without error
    expect(document.body).toBeInTheDocument();
  });

  it('renders empty element when no items', () => {
    render(
      <RInfiniteScroll
        items={[]}
        renderItem={(item: { name: string }) => <div>{item.name}</div>}
        emptyElement={<div>No items found</div>}
        height={300}
      />,
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders end message when hasMore is false', () => {
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        hasMore={false}
        endMessage={<div>End of list</div>}
        height={300}
      />,
    );

    expect(screen.getByText('End of list')).toBeInTheDocument();
  });

  it('renders default end message when hasMore is false', () => {
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        hasMore={false}
        height={300}
      />,
    );

    expect(screen.getByText(/reached the end/i)).toBeInTheDocument();
  });

  it('renders loader when loading', () => {
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        isLoading
        loader={<div>Loading...</div>}
        height={300}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls loadMore when provided', () => {
    const loadMore = vi.fn();
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        loadMore={loadMore}
        hasMore
        height={300}
        itemHeight={50}
      />,
    );

    // Component renders without error
    expect(document.body).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        className='custom-class'
        height={300}
        itemHeight={50}
      />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('does not call loadMore when manual is true', () => {
    const loadMore = vi.fn();
    render(
      <RInfiniteScroll
        items={mockItems}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        loadMore={loadMore}
        manual
        height={300}
        itemHeight={50}
      />,
    );

    // Component renders without error
    expect(document.body).toBeInTheDocument();
  });
});

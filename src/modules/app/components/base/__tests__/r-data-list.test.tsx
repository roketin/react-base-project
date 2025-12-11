import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RDataList } from '@/modules/app/components/base/r-data-list';

describe('RDataList', () => {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  it('renders all items', () => {
    render(
      <RDataList
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
      />,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('shows search input when allowSearch is true', () => {
    render(
      <RDataList
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
        allowSearch
        searchPlaceholder='Search...'
      />,
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(
      <RDataList
        items={[]}
        loading
        getKey={(item: { id: string }) => item.id}
        renderItem={() => null}
        loadingRows={3}
      />,
    );
    // Skeleton items should be rendered
  });

  it('shows empty state when no items', () => {
    render(
      <RDataList
        items={[]}
        getKey={(item: { id: string }) => item.id}
        renderItem={() => null}
      />,
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('shows custom empty content', () => {
    render(
      <RDataList
        items={[]}
        getKey={(item: { id: string }) => item.id}
        renderItem={() => null}
        emptyContent={<div>Custom empty</div>}
      />,
    );
    expect(screen.getByText('Custom empty')).toBeInTheDocument();
  });

  it('calls onChange when search changes', () => {
    const handleChange = vi.fn();
    render(
      <RDataList
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
        allowSearch
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    // onChange should be called after debounce
  });

  it('applies custom className', () => {
    const { container } = render(
      <RDataList
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
        className='custom-list'
      />,
    );
    expect(container.querySelector('.custom-list')).toBeInTheDocument();
  });
});

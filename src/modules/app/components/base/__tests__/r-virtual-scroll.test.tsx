import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RVirtualScroll } from '@/modules/app/components/base/r-virtual-scroll';

describe('RVirtualScroll', () => {
  const items = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  it('renders virtual scroll container', () => {
    const { container } = render(
      <RVirtualScroll
        items={items}
        itemHeight={50}
        height={300}
        renderItem={({ item }) => <div>{item.name}</div>}
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RVirtualScroll
        items={items}
        itemHeight={50}
        height={300}
        className='custom-scroll'
        renderItem={({ item }) => <div>{item.name}</div>}
      />,
    );
    expect(container.querySelector('.custom-scroll')).toBeInTheDocument();
  });

  it('renders container with items', () => {
    const { container } = render(
      <RVirtualScroll
        items={items}
        itemHeight={50}
        height={200}
        renderItem={({ item }) => <div>{item.name}</div>}
      />,
    );
    // Container should render
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows empty element when no items', () => {
    render(
      <RVirtualScroll
        items={[]}
        itemHeight={50}
        height={300}
        emptyElement={<div data-testid='empty'>No items</div>}
        renderItem={() => null}
      />,
    );
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    render(
      <RVirtualScroll
        items={items}
        itemHeight={50}
        height={300}
        isLoading
        loader={<div data-testid='loader'>Loading...</div>}
        renderItem={({ item }) => <div>{item.name}</div>}
      />,
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('accepts overscan prop', () => {
    const { container } = render(
      <RVirtualScroll
        items={items}
        itemHeight={50}
        height={300}
        overscan={5}
        renderItem={({ item }) => <div>{item.name}</div>}
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

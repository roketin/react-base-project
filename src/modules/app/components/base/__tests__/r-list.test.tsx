import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RList } from '@/modules/app/components/base/r-list';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      role,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} role={role} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('RList', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  it('renders all items', () => {
    render(
      <RList items={items} renderItem={(item) => <span>{item.name}</span>} />,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders list role', () => {
    render(
      <RList items={items} renderItem={(item) => <span>{item.name}</span>} />,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders listitem roles', () => {
    render(
      <RList items={items} renderItem={(item) => <span>{item.name}</span>} />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows empty content when no items', () => {
    render(
      <RList
        items={[]}
        renderItem={(item: { name: string }) => <span>{item.name}</span>}
      />,
    );
    expect(screen.getByText('No items to display.')).toBeInTheDocument();
  });

  it('shows custom empty content', () => {
    render(
      <RList
        items={[]}
        renderItem={(item: { name: string }) => <span>{item.name}</span>}
        emptyContent='Nothing here'
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('shows custom empty content as function', () => {
    render(
      <RList
        items={[]}
        renderItem={(item: { name: string }) => <span>{item.name}</span>}
        emptyContent={({ count }) => <span>Count: {count}</span>}
      />,
    );
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('passes options to renderItem', () => {
    render(
      <RList
        items={items}
        renderItem={(item, options) => (
          <span>
            {item.name} - {options.index} - {options.isFirst ? 'first' : ''} -{' '}
            {options.isLast ? 'last' : ''}
          </span>
        )}
      />,
    );
    expect(screen.getByText(/Item 1 - 0 - first/)).toBeInTheDocument();
    expect(screen.getByText(/Item 3 - 2.*last/)).toBeInTheDocument();
  });

  it('uses getKey for unique keys', () => {
    render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        getKey={(item) => `key-${item.id}`}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('applies custom className', () => {
    const { container } = render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        className='custom-list'
      />,
    );
    expect(container.querySelector('.custom-list')).toBeInTheDocument();
  });

  it('applies custom listClassName', () => {
    const { container } = render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        listClassName='custom-list-class'
      />,
    );
    expect(container.querySelector('.custom-list-class')).toBeInTheDocument();
  });

  it('renders with custom role', () => {
    render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        role='menu'
      />,
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders with custom as element', () => {
    const { container } = render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        as='section'
      />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies itemClassName as string', () => {
    const { container } = render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        itemClassName='custom-item'
      />,
    );
    expect(container.querySelectorAll('.custom-item')).toHaveLength(3);
  });

  it('applies itemClassName as function', () => {
    const { container } = render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        itemClassName={(item, index) => `item-${index}`}
      />,
    );
    expect(container.querySelector('.item-0')).toBeInTheDocument();
    expect(container.querySelector('.item-1')).toBeInTheDocument();
    expect(container.querySelector('.item-2')).toBeInTheDocument();
  });

  it('renders without animation when animate is false', () => {
    render(
      <RList
        items={items}
        renderItem={(item) => <span>{item.name}</span>}
        animate={false}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders with virtual scroll when enabled', async () => {
    const manyItems = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const { container } = render(
      <RList
        items={manyItems}
        renderItem={(item) => <span>{item.name}</span>}
        virtual={{
          enabled: true,
          height: 400,
          itemHeight: 40,
          overscan: 5,
        }}
      />,
    );

    // Virtual scroll container should be rendered
    // Note: In jsdom, virtual scroll may not render items due to missing layout calculations
    await waitFor(() => {
      const scrollContainer = container.querySelector('.overflow-auto');
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  it('renders empty state with custom as element', () => {
    const { container } = render(
      <RList
        items={[]}
        renderItem={(item: { name: string }) => <span>{item.name}</span>}
        as='section'
      />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('passes count in options', () => {
    render(
      <RList
        items={items}
        renderItem={(item, options) => (
          <span>
            {item.name} - count: {options.count}
          </span>
        )}
      />,
    );
    expect(screen.getByText('Item 1 - count: 3')).toBeInTheDocument();
  });
});

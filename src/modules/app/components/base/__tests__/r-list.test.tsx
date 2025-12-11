import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RList } from '@/modules/app/components/base/r-list';

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
});

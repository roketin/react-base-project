import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RMenu, type TRMenuItem } from '@/modules/app/components/base/r-menu';

describe('RMenu', () => {
  const items: TRMenuItem[] = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];

  it('renders trigger element', () => {
    render(<RMenu trigger={<button>Open Menu</button>} items={items} />);
    expect(
      screen.getByRole('button', { name: /open menu/i }),
    ).toBeInTheDocument();
  });

  it('renders with custom className on trigger', () => {
    render(
      <RMenu
        trigger={<button>Open</button>}
        items={items}
        className='custom-trigger-class'
      />,
    );
    expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
  });

  it('renders trigger with disabled item in items list', () => {
    const itemsWithDisabled: TRMenuItem[] = [
      { id: '1', label: 'Visible' },
      { id: '2', label: 'Disabled', disabled: true },
    ];

    render(<RMenu trigger={<button>Menu</button>} items={itemsWithDisabled} />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('renders trigger with item containing icon', () => {
    const itemsWithIcon: TRMenuItem[] = [
      { id: '1', label: 'With Icon', icon: <span data-testid='icon'>🎯</span> },
    ];

    render(<RMenu trigger={<button>Menu</button>} items={itemsWithIcon} />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('renders trigger with nested items', () => {
    const nestedItems: TRMenuItem[] = [
      {
        id: '1',
        label: 'Parent',
        items: [{ id: '1-1', label: 'Child' }],
      },
    ];

    render(<RMenu trigger={<button>Menu</button>} items={nestedItems} />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});

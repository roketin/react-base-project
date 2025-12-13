import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../r-command';

// Mock scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('Command', () => {
  it('renders command component', () => {
    render(
      <Command>
        <CommandInput placeholder='Search...' />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>,
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('filters items based on search', () => {
    render(
      <Command>
        <CommandInput placeholder='Search...' />
        <CommandList>
          <CommandItem value='apple'>Apple</CommandItem>
          <CommandItem value='banana'>Banana</CommandItem>
        </CommandList>
      </Command>,
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'apple' } });

    expect(screen.getByText('Apple')).toBeVisible();
  });

  it('shows empty state when no results', async () => {
    render(
      <Command>
        <CommandInput placeholder='Search...' />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          <CommandItem value='apple'>Apple</CommandItem>
        </CommandList>
      </Command>,
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'xyz' } });

    // Wait for filter to apply - the item should be hidden
    const appleItem = screen
      .getByText('Apple')
      .closest('[data-slot="command-item"]');
    expect(appleItem).toHaveAttribute('data-hidden', 'true');
  });

  it('renders command group with heading', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading='Fruits'>
            <CommandItem>Apple</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(screen.getByText('Fruits')).toBeInTheDocument();
  });

  it('renders separator', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandSeparator data-testid='separator' />
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>,
    );

    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });

  it('renders shortcut', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            Open <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>,
    );

    expect(screen.getByText('⌘O')).toBeInTheDocument();
  });

  it('calls onSelect when item clicked', () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandList>
          <CommandItem value='test' onSelect={onSelect}>
            Test Item
          </CommandItem>
        </CommandList>
      </Command>,
    );

    fireEvent.click(screen.getByText('Test Item'));
    expect(onSelect).toHaveBeenCalledWith('test');
  });

  it('navigates with keyboard', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem value='item1'>Item 1</CommandItem>
          <CommandItem value='item2'>Item 2</CommandItem>
        </CommandList>
      </Command>,
    );

    const command = screen.getByText('Item 1').closest('[data-slot="command"]');
    fireEvent.keyDown(command!, { key: 'ArrowDown' });

    const item2 = screen
      .getByText('Item 2')
      .closest('[data-slot="command-item"]');
    expect(item2).toHaveAttribute('data-selected', 'true');
  });

  it('disables item when disabled prop is true', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem disabled>Disabled Item</CommandItem>
        </CommandList>
      </Command>,
    );

    const item = screen
      .getByText('Disabled Item')
      .closest('[data-slot="command-item"]');
    expect(item).toHaveAttribute('data-disabled', 'true');
  });
});

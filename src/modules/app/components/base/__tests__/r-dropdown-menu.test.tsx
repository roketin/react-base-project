import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '../r-dropdown-menu';

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  it('closes menu on item click', async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Item 1'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('renders menu label', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('My Account')).toBeInTheDocument();
    });
  });

  it('renders separator', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid='separator' />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  it('renders checkbox item', async () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Show Status
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Show Status')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Show Status'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders radio group', async () => {
    const onValueChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value='a' onValueChange={onValueChange}>
            <DropdownMenuRadioItem value='a'>Option A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='b'>Option B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Option B'));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders group', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  it('renders shortcut', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('⌘S')).toBeInTheDocument();
    });
  });

  it('disables item when disabled prop is true', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      const item = screen
        .getByText('Disabled Item')
        .closest('[data-slot="dropdown-menu-item"]');
      expect(item).toHaveAttribute('data-disabled', 'true');
    });
  });
});

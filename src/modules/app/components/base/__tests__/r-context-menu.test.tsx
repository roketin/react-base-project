import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/modules/app/components/base/r-context-menu';

describe('ContextMenu', () => {
  it('renders trigger correctly', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Right click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('opens context menu on right click', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Right click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('calls onOpenChange when menu opens', () => {
    const onOpenChange = vi.fn();
    render(
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Right click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe('ContextMenuItem', () => {
  it('renders menu item correctly', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Click me</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Click me</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByText('Click me'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled onSelect={onSelect}>
            Click me
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByText('Click me'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('ContextMenuSeparator', () => {
  it('renders separator', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Item 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });
});

describe('ContextMenuLabel', () => {
  it('renders label', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>My Label</ContextMenuLabel>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });
});

describe('ContextMenuCheckboxItem', () => {
  it('renders checkbox item', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={false}>
            Checkbox
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Checkbox
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByRole('menuitemcheckbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('ContextMenuRadioGroup', () => {
  it('renders radio items', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value='1'>
            <ContextMenuRadioItem value='1'>Option 1</ContextMenuRadioItem>
            <ContextMenuRadioItem value='2'>Option 2</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(2);
  });
});

describe('ContextMenuSub', () => {
  it('renders sub menu trigger', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid='trigger'>Trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Sub Item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByText('More options')).toBeInTheDocument();
  });
});

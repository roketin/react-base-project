import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
} from '@/modules/app/components/base/r-menubar';

describe('Menubar', () => {
  it('renders menubar correctly', () => {
    render(
      <Menubar data-testid='menubar'>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByTestId('menubar')).toBeInTheDocument();
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('renders menu trigger', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByText('File')).toBeInTheDocument();
  });

  it('opens menu on click', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('closes menu on click outside', async () => {
    render(
      <div>
        <div data-testid='outside'>Outside</div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    await vi.waitFor(() => {
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });
});

describe('MenubarItem', () => {
  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onSelect}>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('New'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled onSelect={onSelect}>
              New
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('New'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('MenubarSeparator', () => {
  it('renders separator', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});

describe('MenubarLabel', () => {
  it('renders label', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Actions</MenubarLabel>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});

describe('MenubarShortcut', () => {
  it('renders shortcut', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('⌘N')).toBeInTheDocument();
  });
});

describe('MenubarCheckboxItem', () => {
  it('renders checkbox item', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={true}>
              Show Toolbar
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('View'));
    expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={false}
              onCheckedChange={onCheckedChange}
            >
              Show Toolbar
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('View'));
    fireEvent.click(screen.getByRole('menuitemcheckbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('MenubarRadioGroup', () => {
  it('renders radio items', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value='compact'>
              <MenubarRadioItem value='compact'>Compact</MenubarRadioItem>
              <MenubarRadioItem value='normal'>Normal</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('View'));
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(2);
  });
});

describe('MenubarSub', () => {
  it('renders sub menu trigger', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Share')).toBeInTheDocument();
  });
});

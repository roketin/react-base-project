import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../r-sheet';

describe('Sheet', () => {
  it('renders trigger button', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
  });

  it('opens sheet on trigger click', async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    fireEvent.click(screen.getByText('Open Sheet'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('renders sheet content with title', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });
  });

  it('renders sheet description', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description text</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  it('renders sheet footer', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetFooter>
            <button>Save</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  it('closes on close button click', async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet defaultOpen onOpenChange={onOpenChange}>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on escape key', async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet defaultOpen onOpenChange={onOpenChange}>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders with different sides', async () => {
    const { rerender } = render(
      <Sheet defaultOpen>
        <SheetContent side='left'>Left Content</SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    rerender(
      <Sheet defaultOpen>
        <SheetContent side='top'>Top Content</SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByText('Top Content')).toBeInTheDocument();
    });
  });

  it('supports controlled open state', async () => {
    const { rerender } = render(
      <Sheet open={false}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Sheet open={true}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('renders SheetClose with asChild', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetClose asChild>
            <button>Custom Close</button>
          </SheetClose>
        </SheetContent>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByText('Custom Close')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from '@/modules/app/components/base/r-dialog-primitives';

describe('Dialog', () => {
  it('renders trigger correctly', () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens dialog on trigger click', async () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange when dialog opens', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  it('respects controlled open state', () => {
    render(
      <Dialog open={true}>
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
  });

  it('respects defaultOpen', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Default Open Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Default Open Dialog')).toBeInTheDocument();
  });
});

describe('DialogContent', () => {
  it('renders content with header', async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders content with footer', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('shows close button by default', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    // No close button should be rendered inside DialogContent
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });
});

describe('DialogClose', () => {
  it('closes dialog when clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose>
            <button>Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('DialogHeader', () => {
  it('renders with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader className='custom-header'>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Title').parentElement).toHaveClass(
      'custom-header',
    );
  });
});

describe('DialogFooter', () => {
  it('renders with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogFooter className='custom-footer'>
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Action').parentElement).toHaveClass(
      'custom-footer',
    );
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverArrow,
} from '@/modules/app/components/base/r-popover-primitives';

describe('Popover', () => {
  it('renders trigger correctly', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <button>Open Popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('opens popover on trigger click', async () => {
    render(
      <Popover>
        <PopoverTrigger>
          <button>Open Popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  it('closes popover on second click', async () => {
    render(
      <Popover>
        <PopoverTrigger>
          <button>Toggle</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Content</div>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByText('Toggle');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange when popover state changes', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Content</div>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  it('respects controlled open state', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Controlled content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Controlled content')).toBeInTheDocument();
  });

  it('respects defaultOpen', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Default open content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Default open content')).toBeInTheDocument();
  });
});

describe('PopoverContent', () => {
  it('renders with custom className', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent className='custom-popover'>
          <div data-testid='content'>Content</div>
        </PopoverContent>
      </Popover>,
    );

    const content = screen.getByTestId('content').parentElement;
    expect(content).toHaveClass('custom-popover');
  });

  it('renders on different sides', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent side='top'>
          <div>Top content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Top content')).toBeInTheDocument();
  });
});

describe('PopoverTrigger', () => {
  it('renders as child element when asChild is true', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button data-testid='custom-trigger'>Custom Button</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
  });
});

describe('PopoverAnchor', () => {
  it('renders anchor element', () => {
    render(
      <Popover defaultOpen>
        <PopoverAnchor>
          <div data-testid='anchor'>Anchor</div>
        </PopoverAnchor>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByTestId('anchor')).toBeInTheDocument();
  });
});

describe('PopoverArrow', () => {
  it('renders arrow in content', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow className='arrow-test' />
          <div>Content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

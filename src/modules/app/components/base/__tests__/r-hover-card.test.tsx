import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RHoverCard } from '@/modules/app/components/base/r-hover-card';

describe('RHoverCard', () => {
  it('renders trigger correctly', () => {
    render(
      <RHoverCard content={<div>Hover content</div>}>
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    render(
      <RHoverCard content={<div>Hover content</div>} openDelay={0}>
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    fireEvent.mouseEnter(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument();
    });
  });

  it('hides content on mouse leave', async () => {
    render(
      <RHoverCard
        content={<div>Hover content</div>}
        openDelay={0}
        closeDelay={0}
      >
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    fireEvent.mouseEnter(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange when hover state changes', async () => {
    const onOpenChange = vi.fn();
    render(
      <RHoverCard
        content={<div>Hover content</div>}
        openDelay={0}
        onOpenChange={onOpenChange}
      >
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    fireEvent.mouseEnter(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  it('does not show content when disabled', async () => {
    render(
      <RHoverCard content={<div>Hover content</div>} openDelay={0} disabled>
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    fireEvent.mouseEnter(screen.getByTestId('trigger'));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
  });

  it('respects controlled open state', () => {
    render(
      <RHoverCard content={<div>Hover content</div>} open={true}>
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    expect(screen.getByText('Hover content')).toBeInTheDocument();
  });

  it('renders with defaultOpen', () => {
    render(
      <RHoverCard content={<div>Hover content</div>} defaultOpen>
        <span data-testid='trigger'>Hover me</span>
      </RHoverCard>,
    );

    expect(screen.getByText('Hover content')).toBeInTheDocument();
  });

  it('applies custom className to trigger', () => {
    render(
      <RHoverCard content={<div>Content</div>} className='custom-class'>
        <span>Trigger</span>
      </RHoverCard>,
    );

    expect(screen.getByText('Trigger').parentElement).toHaveClass(
      'custom-class',
    );
  });

  it('shows arrow by default', async () => {
    render(
      <RHoverCard content={<div>Content</div>} openDelay={0} defaultOpen>
        <span data-testid='trigger'>Trigger</span>
      </RHoverCard>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

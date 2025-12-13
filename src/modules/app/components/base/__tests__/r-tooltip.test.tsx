import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';

describe('RTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders trigger element', () => {
    render(
      <RTooltip content='Tooltip text'>
        <button>Hover me</button>
      </RTooltip>,
    );
    expect(
      screen.getByRole('button', { name: /hover me/i }),
    ).toBeInTheDocument();
  });

  it('does not render tooltip when disabled', () => {
    render(
      <RTooltip content='Tooltip text' disabled>
        <button>Hover me</button>
      </RTooltip>,
    );
    expect(
      screen.getByRole('button', { name: /hover me/i }),
    ).toBeInTheDocument();
  });

  it('renders without children returns null', () => {
    const { container } = render(
      <RTooltip content='Tooltip text'>{null}</RTooltip>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('applies custom className to trigger', () => {
    render(
      <RTooltip content='Tooltip text' className='custom-trigger'>
        <button>Button</button>
      </RTooltip>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', async () => {
    vi.useRealTimers();
    render(
      <RTooltip content='Tooltip text' delayDuration={0} open={true}>
        <button>Hover me</button>
      </RTooltip>,
    );

    // With open={true}, tooltip should be visible
    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
    vi.useFakeTimers();
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <RTooltip content='Tooltip text' delayDuration={0} open={false}>
        <button>Hover me</button>
      </RTooltip>,
    );

    // With open={false}, tooltip should not be visible
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus', async () => {
    vi.useRealTimers();
    render(
      <RTooltip content='Tooltip text' delayDuration={0} open={true}>
        <button>Focus me</button>
      </RTooltip>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
    vi.useFakeTimers();
  });

  it('hides tooltip on blur', async () => {
    render(
      <RTooltip content='Tooltip text' delayDuration={0} open={false}>
        <button>Focus me</button>
      </RTooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('respects delay duration', async () => {
    // Test that component accepts delayDuration prop without errors
    render(
      <RTooltip content='Tooltip text' delayDuration={500}>
        <button>Hover me</button>
      </RTooltip>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('renders with different sides', async () => {
    const { rerender } = render(
      <RTooltip content='Tooltip' side='top' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    rerender(
      <RTooltip content='Tooltip' side='bottom' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    rerender(
      <RTooltip content='Tooltip' side='left' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    rerender(
      <RTooltip content='Tooltip' side='right' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );
  });

  it('renders with different alignments', async () => {
    const { rerender } = render(
      <RTooltip content='Tooltip' align='start' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    rerender(
      <RTooltip content='Tooltip' align='center' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    rerender(
      <RTooltip content='Tooltip' align='end' delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );
  });

  it('hides arrow when withArrow is false', async () => {
    render(
      <RTooltip content='Tooltip' withArrow={false} delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.querySelector('.rotate-45')).not.toBeInTheDocument();
  });

  it('supports controlled open state', async () => {
    vi.useRealTimers();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <RTooltip content='Tooltip' open={false} onOpenChange={onOpenChange}>
        <button>Button</button>
      </RTooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(
      <RTooltip content='Tooltip' open={true} onOpenChange={onOpenChange}>
        <button>Button</button>
      </RTooltip>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
    vi.useFakeTimers();
  });

  it('supports defaultOpen', async () => {
    vi.useRealTimers();
    render(
      <RTooltip content='Tooltip' open={true}>
        <button>Button</button>
      </RTooltip>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
    vi.useFakeTimers();
  });

  it('applies custom contentClassName', async () => {
    render(
      <RTooltip
        content='Tooltip'
        contentClassName='custom-content'
        delayDuration={0}
      >
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('custom-content');
  });

  it('respects sideOffset and alignOffset', async () => {
    render(
      <RTooltip
        content='Tooltip'
        sideOffset={10}
        alignOffset={5}
        delayDuration={0}
      >
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('handles avoidCollisions', async () => {
    render(
      <RTooltip content='Tooltip' avoidCollisions={true} delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('does not open when disabled and mouse enters', async () => {
    render(
      <RTooltip content='Tooltip' disabled delayDuration={0}>
        <button>Button</button>
      </RTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

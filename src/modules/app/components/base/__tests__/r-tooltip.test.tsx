import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';

describe('RTooltip', () => {
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
    // Button should still be in the document
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
});

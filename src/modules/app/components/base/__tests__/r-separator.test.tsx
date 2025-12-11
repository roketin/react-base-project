import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RSeparator } from '@/modules/app/components/base/r-separator';

describe('RSeparator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<RSeparator />);
    expect(container.firstChild).toHaveClass('h-px', 'w-full');
  });

  it('renders vertical separator', () => {
    const { container } = render(<RSeparator orientation='vertical' />);
    expect(container.firstChild).toHaveClass('h-full', 'w-px');
  });

  it('has decorative role by default', () => {
    render(<RSeparator />);
    const separator = screen.getByRole('none');
    expect(separator).toBeInTheDocument();
  });

  it('has separator role when not decorative', () => {
    render(<RSeparator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('sets aria-orientation when not decorative', () => {
    render(<RSeparator decorative={false} orientation='vertical' />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies custom className', () => {
    const { container } = render(<RSeparator className='my-separator' />);
    expect(container.firstChild).toHaveClass('my-separator');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RSeparator ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

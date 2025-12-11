import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RSkeleton } from '@/modules/app/components/base/r-skeleton';

describe('RSkeleton', () => {
  it('renders with default variant', () => {
    const { container } = render(<RSkeleton />);
    expect(container.firstChild).toHaveClass('bg-muted', 'rounded-md');
  });

  it('renders with circular variant', () => {
    const { container } = render(<RSkeleton variant='circular' />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('renders with rectangular variant', () => {
    const { container } = render(<RSkeleton variant='rectangular' />);
    expect(container.firstChild).toHaveClass('rounded-md');
  });

  it('renders with text variant', () => {
    const { container } = render(<RSkeleton variant='text' />);
    expect(container.firstChild).toHaveClass('rounded', 'h-4');
  });

  it('applies pulse animation by default', () => {
    const { container } = render(<RSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('applies wave animation', () => {
    const { container } = render(<RSkeleton animation='wave' />);
    expect(container.firstChild).toHaveClass('animate-shimmer');
  });

  it('disables animation when animation is none', () => {
    const { container } = render(<RSkeleton animation='none' />);
    expect(container.firstChild).not.toHaveClass('animate-pulse');
    expect(container.firstChild).not.toHaveClass('animate-shimmer');
  });

  it('applies custom className', () => {
    const { container } = render(<RSkeleton className='w-48 h-12' />);
    expect(container.firstChild).toHaveClass('w-48', 'h-12');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RSkeleton ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

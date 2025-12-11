import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RBadge } from '@/modules/app/components/base/r-badge';

describe('RBadge', () => {
  it('renders children correctly', () => {
    render(<RBadge>New</RBadge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    const { container } = render(<RBadge>Default</RBadge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    render(<RBadge variant='success'>Success</RBadge>);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders with destructive variant', () => {
    render(<RBadge variant='destructive'>Error</RBadge>);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    render(<RBadge variant='warning'>Warning</RBadge>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders with outline variant', () => {
    render(<RBadge variant='outline'>Outline</RBadge>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('shows dot when dot prop is true', () => {
    const { container } = render(<RBadge dot>With Dot</RBadge>);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('shows remove button when removable is true', () => {
    render(<RBadge removable>Removable</RBadge>);
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<RBadge onRemove={handleRemove}>Remove Me</RBadge>);

    fireEvent.click(screen.getByLabelText('Remove'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('shows remove button when onRemove is provided', () => {
    render(<RBadge onRemove={() => {}}>With Handler</RBadge>);
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<RBadge size='sm'>Small</RBadge>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<RBadge size='lg'>Large</RBadge>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RBadge className='custom-badge'>Custom</RBadge>,
    );
    expect(container.firstChild).toHaveClass('custom-badge');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RBadge ref={ref}>Ref Badge</RBadge>);
    expect(ref).toHaveBeenCalled();
  });
});

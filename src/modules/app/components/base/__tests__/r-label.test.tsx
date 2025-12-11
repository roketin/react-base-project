import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RLabel } from '@/modules/app/components/base/r-label';

describe('RLabel', () => {
  it('renders children correctly', () => {
    render(<RLabel>Username</RLabel>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    const { container } = render(<RLabel>Default</RLabel>);
    expect(container.querySelector('label')).toBeInTheDocument();
  });

  it('renders with error variant', () => {
    render(<RLabel variant='error'>Error Label</RLabel>);
    expect(screen.getByText('Error Label')).toHaveClass('text-destructive');
  });

  it('renders with success variant', () => {
    render(<RLabel variant='success'>Success Label</RLabel>);
    expect(screen.getByText('Success Label')).toHaveClass('text-success');
  });

  it('renders with muted variant', () => {
    render(<RLabel variant='muted'>Muted Label</RLabel>);
    expect(screen.getByText('Muted Label')).toHaveClass(
      'text-muted-foreground',
    );
  });

  it('shows asterisk when required is true', () => {
    const { container } = render(<RLabel required>Required Field</RLabel>);
    const label = container.querySelector('label');
    // Check for the after pseudo-element via computed styles or class
    expect(label).toHaveClass("after:content-['*']");
  });

  it('renders with small size', () => {
    render(<RLabel size='sm'>Small Label</RLabel>);
    expect(screen.getByText('Small Label')).toHaveClass('text-xs');
  });

  it('renders with large size', () => {
    render(<RLabel size='lg'>Large Label</RLabel>);
    expect(screen.getByText('Large Label')).toHaveClass('text-base');
  });

  it('applies custom className', () => {
    render(<RLabel className='custom-label'>Custom</RLabel>);
    expect(screen.getByText('Custom')).toHaveClass('custom-label');
  });

  it('sets htmlFor attribute', () => {
    render(<RLabel htmlFor='my-input'>Label</RLabel>);
    expect(screen.getByText('Label')).toHaveAttribute('for', 'my-input');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RLabel ref={ref}>Ref Label</RLabel>);
    expect(ref).toHaveBeenCalled();
  });
});

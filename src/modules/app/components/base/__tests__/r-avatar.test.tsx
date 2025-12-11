import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RAvatar } from '@/modules/app/components/base/r-avatar';

describe('RAvatar', () => {
  it('renders with image src', () => {
    render(<RAvatar src='https://example.com/avatar.jpg' alt='User Avatar' />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders initials when no image', () => {
    render(<RAvatar name='John Doe' />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single word name initials', () => {
    render(<RAvatar name='John' />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders fallback when no image or name', () => {
    render(<RAvatar fallback={<span data-testid='fallback'>👤</span>} />);
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders question mark when no image, name, or fallback', () => {
    render(<RAvatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { container, rerender } = render(<RAvatar name='Test' size='sm' />);
    expect(container.firstChild).toHaveClass('size-10');

    rerender(<RAvatar name='Test' size='lg' />);
    expect(container.firstChild).toHaveClass('size-16');

    rerender(<RAvatar name='Test' size='xl' />);
    expect(container.firstChild).toHaveClass('size-20');
  });

  it('applies different shapes', () => {
    const { container, rerender } = render(
      <RAvatar name='Test' shape='circle' />,
    );
    expect(container.firstChild).toHaveClass('rounded-full');

    rerender(<RAvatar name='Test' shape='rounded' />);
    expect(container.firstChild).toHaveClass('rounded-xl');

    rerender(<RAvatar name='Test' shape='square' />);
    expect(container.firstChild).toHaveClass('rounded-lg');
  });

  it('shows online presence indicator', () => {
    const { container } = render(<RAvatar name='Test' presence='online' />);
    expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
  });

  it('shows offline presence indicator', () => {
    const { container } = render(<RAvatar name='Test' presence='offline' />);
    expect(
      container.querySelector('[class*="bg-muted-foreground"]'),
    ).toBeInTheDocument();
  });

  it('shows busy presence indicator', () => {
    const { container } = render(<RAvatar name='Test' presence='busy' />);
    expect(container.querySelector('.bg-destructive')).toBeInTheDocument();
  });

  it('shows away presence indicator', () => {
    const { container } = render(<RAvatar name='Test' presence='away' />);
    expect(container.querySelector('.bg-amber-400')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<RAvatar name='Test' badge={<span data-testid='badge'>5</span>} />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RAvatar name='Test' className='custom-avatar' />,
    );
    expect(container.firstChild).toHaveClass('custom-avatar');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RAvatar name='Test' ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

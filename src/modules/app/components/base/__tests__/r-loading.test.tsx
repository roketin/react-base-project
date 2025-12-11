import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RLoading } from '@/modules/app/components/base/r-loading';

describe('RLoading', () => {
  it('renders with default label', () => {
    render(<RLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<RLoading label='Please wait' />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('hides label when hideLabel is true', () => {
    render(<RLoading hideLabel />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders spinner icon', () => {
    const { container } = render(<RLoading />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies fullScreen class when fullScreen is true', () => {
    const { container } = render(<RLoading fullScreen />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('does not apply fullScreen class by default', () => {
    const { container } = render(<RLoading />);
    expect(container.firstChild).not.toHaveClass('min-h-screen');
  });

  it('applies custom className', () => {
    const { container } = render(<RLoading className='my-custom-class' />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('applies custom iconClassName', () => {
    const { container } = render(
      <RLoading iconClassName='custom-icon-class' />,
    );
    expect(container.querySelector('svg')).toHaveClass('custom-icon-class');
  });

  it('applies custom labelClassName', () => {
    render(<RLoading labelClassName='custom-label-class' />);
    expect(screen.getByText('Loading...')).toHaveClass('custom-label-class');
  });

  it('renders ReactNode as label', () => {
    render(<RLoading label={<span data-testid='custom-label'>Custom</span>} />);
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });
});

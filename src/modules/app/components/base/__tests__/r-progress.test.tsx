import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RProgress,
  RProgressCircular,
} from '@/modules/app/components/base/r-progress';

describe('RProgress', () => {
  it('renders progressbar', () => {
    render(<RProgress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria attributes correctly', () => {
    render(<RProgress value={30} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuenow', '30');
  });

  it('shows percentage value when showValue is true', () => {
    render(<RProgress value={75} showValue />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('hides percentage value by default', () => {
    render(<RProgress value={75} />);
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<RProgress value={150} showValue />);
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<RProgress value={-50} showValue />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { container, rerender } = render(<RProgress value={50} size='sm' />);
    expect(container.querySelector('.h-1')).toBeInTheDocument();

    rerender(<RProgress value={50} size='default' />);
    expect(container.querySelector('.h-2')).toBeInTheDocument();

    rerender(<RProgress value={50} size='lg' />);
    expect(container.querySelector('.h-3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<RProgress value={50} className='custom-progress' />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-progress');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RProgress value={50} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('RProgressCircular', () => {
  it('renders circular progressbar', () => {
    render(<RProgressCircular value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria attributes correctly', () => {
    render(<RProgressCircular value={60} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuenow', '60');
  });

  it('shows percentage value when showValue is true', () => {
    render(<RProgressCircular value={45} showValue />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('hides value when indeterminate', () => {
    render(<RProgressCircular value={45} showValue indeterminate />);
    expect(screen.queryByText('45%')).not.toBeInTheDocument();
  });

  it('applies indeterminate animation', () => {
    const { container } = render(<RProgressCircular indeterminate />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<RProgressCircular value={50} size={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('applies custom className', () => {
    render(<RProgressCircular value={50} className='custom-circular' />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-circular');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RProgressCircular value={50} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

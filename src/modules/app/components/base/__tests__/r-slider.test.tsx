import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RSlider } from '@/modules/app/components/base/r-slider';

describe('RSlider', () => {
  it('renders slider', () => {
    render(<RSlider />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RSlider label='Volume' />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<RSlider defaultValue={75} />);
    expect(screen.getByRole('slider')).toHaveValue('75');
  });

  it('renders controlled value', () => {
    render(<RSlider value={30} />);
    expect(screen.getByRole('slider')).toHaveValue('30');
  });

  it('calls onValueChange when value changes', () => {
    const handleChange = vi.fn();
    render(<RSlider onValueChange={handleChange} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '60' } });
    expect(handleChange).toHaveBeenCalledWith(60);
  });

  it('shows value when showValue is true', () => {
    render(<RSlider label='Value' value={50} showValue />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('shows min max when showMinMax is true', () => {
    render(<RSlider min={0} max={100} showMinMax />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('formats value with custom formatter', () => {
    render(
      <RSlider
        label='Percentage'
        value={50}
        showValue
        formatValue={(val) => `${val}%`}
      />,
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<RSlider error='Value is required' />);
    expect(screen.getByText('Value is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RSlider helperText='Adjust the slider' />);
    expect(screen.getByText('Adjust the slider')).toBeInTheDocument();
  });

  it('disables slider when disabled prop is true', () => {
    render(<RSlider disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('applies custom min and max', () => {
    render(<RSlider min={10} max={50} defaultValue={30} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '50');
  });

  it('applies custom step', () => {
    render(<RSlider step={5} />);
    expect(screen.getByRole('slider')).toHaveAttribute('step', '5');
  });

  it('applies custom wrapperClassName', () => {
    const { container } = render(<RSlider wrapperClassName='custom-wrapper' />);
    expect(container.firstChild).toHaveClass('custom-wrapper');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RSlider ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

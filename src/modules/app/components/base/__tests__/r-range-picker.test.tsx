import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RRangePicker, RFormRangePicker } from '../r-range-picker';

describe('RRangePicker', () => {
  it('renders range picker', () => {
    render(<RRangePicker />);
    // rc-picker renders two inputs for range
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders with placeholder', () => {
    render(<RRangePicker placeholder={['Start', 'End']} />);
    expect(screen.getByPlaceholderText('Start')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End')).toBeInTheDocument();
  });

  it('renders with custom format', () => {
    render(<RRangePicker format='YYYY-MM-DD' />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('applies invalid class when aria-invalid', () => {
    const { container } = render(<RRangePicker aria-invalid />);
    expect(container.querySelector('.rc-invalid')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<RRangePicker className='custom-class' />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('RFormRangePicker', () => {
  it('renders form range picker', () => {
    render(<RFormRangePicker />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('handles value prop with from/to format', () => {
    const value = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    };
    render(<RFormRangePicker value={value} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('handles null value', () => {
    render(<RFormRangePicker value={null} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });
});

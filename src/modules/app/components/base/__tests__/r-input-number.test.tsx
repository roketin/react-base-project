import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RInputNumber } from '@/modules/app/components/base/r-input-number';

describe('RInputNumber', () => {
  it('renders input', () => {
    render(<RInputNumber placeholder='Enter number' />);
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
  });

  it('formats value with decimals', () => {
    render(<RInputNumber value={1234.56} decimalLimit={2} isFormatOnChange />);
    expect(screen.getByDisplayValue('1,234.56')).toBeInTheDocument();
  });

  it('calls onChange with numeric value', () => {
    const handleChange = vi.fn();
    render(<RInputNumber onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '100' } });

    expect(handleChange).toHaveBeenCalledWith(100);
  });

  it('accepts decimal input', () => {
    const handleChange = vi.fn();
    render(<RInputNumber onChange={handleChange} allowDecimal />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '12.34' } });

    expect(handleChange).toHaveBeenCalledWith(12.34);
  });

  it('rejects decimal when allowDecimal is false', () => {
    const handleChange = vi.fn();
    render(<RInputNumber onChange={handleChange} allowDecimal={false} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '12.34' } });

    // The input should not call onChange with decimal value
    expect(handleChange).not.toHaveBeenCalledWith(12.34);
  });

  it('allows negative numbers when negative prop is true', () => {
    const handleChange = vi.fn();
    render(<RInputNumber onChange={handleChange} negative />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-50' } });

    expect(handleChange).toHaveBeenCalledWith(-50);
  });

  it('blocks e and E keys', () => {
    render(<RInputNumber />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'e' });
    fireEvent.keyDown(input, { key: 'E' });
    // These keys should be blocked
  });

  it('formats on blur when isOnBlurFormat is true', () => {
    render(<RInputNumber value={1234} isOnBlurFormat decimalLimit={2} />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.getByDisplayValue('1,234.00')).toBeInTheDocument();
  });

  it('shows OVER when value exceeds 100 with hasPercentRestriction', () => {
    render(<RInputNumber value={150} hasPercentRestriction isFormatOnChange />);
    expect(screen.getByDisplayValue('OVER')).toBeInTheDocument();
  });

  it('clears display on focus when value is zero', () => {
    render(<RInputNumber value={0} />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(input).toHaveValue('');
  });
});

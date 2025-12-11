import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RCheckbox } from '@/modules/app/components/base/r-checkbox';

describe('RCheckbox', () => {
  it('renders checkbox', () => {
    render(<RCheckbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RCheckbox label='Accept terms' />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<RCheckbox checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('handles unchecked state', () => {
    render(<RCheckbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<RCheckbox onChange={handleChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onCheckedChange with new checked state', () => {
    const handleCheckedChange = vi.fn();
    render(<RCheckbox onCheckedChange={handleCheckedChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('disables checkbox when disabled prop is true', () => {
    render(<RCheckbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('shows error message', () => {
    render(<RCheckbox error='This field is required' />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RCheckbox helperText='Optional field' />);
    expect(screen.getByText('Optional field')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(<RCheckbox error='Error message' helperText='Helper text' />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('shows indeterminate state', () => {
    render(<RCheckbox indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(<RCheckbox wrapperClassName='my-wrapper' />);
    expect(container.firstChild).toHaveClass('my-wrapper');
  });

  it('can toggle checkbox by clicking label', () => {
    const handleChange = vi.fn();
    render(<RCheckbox label='Click me' onChange={handleChange} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleChange).toHaveBeenCalled();
  });
});

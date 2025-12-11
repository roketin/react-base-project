import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RSwitch } from '@/modules/app/components/base/r-switch';

describe('RSwitch', () => {
  it('renders switch', () => {
    render(<RSwitch />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RSwitch label='Enable notifications' />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<RSwitch label='Dark mode' description='Enable dark theme' />);
    expect(screen.getByText('Enable dark theme')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<RSwitch checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('handles unchecked state', () => {
    render(<RSwitch checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onCheckedChange when toggled', () => {
    const handleCheckedChange = vi.fn();
    render(<RSwitch onCheckedChange={handleCheckedChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange with trueValue when toggled on', () => {
    const handleValueChange = vi.fn();
    render(<RSwitch onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleValueChange).toHaveBeenCalledWith(true);
  });

  it('disables switch when disabled prop is true', () => {
    render(<RSwitch disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('shows error message', () => {
    render(<RSwitch error='This field is required' />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RSwitch helperText='Optional setting' />);
    expect(screen.getByText('Optional setting')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(<RSwitch error='Error message' helperText='Helper text' />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('applies custom wrapperClassName', () => {
    const { container } = render(<RSwitch wrapperClassName='my-wrapper' />);
    expect(container.firstChild).toHaveClass('my-wrapper');
  });

  it('can toggle by clicking label', () => {
    const handleChange = vi.fn();
    render(<RSwitch label='Toggle me' onCheckedChange={handleChange} />);

    fireEvent.click(screen.getByText('Toggle me'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('determines checked state from value prop', () => {
    render(<RSwitch value={true} trueValue={true} falseValue={false} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

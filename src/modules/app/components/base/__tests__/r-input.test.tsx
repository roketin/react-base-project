import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RInput } from '@/modules/app/components/base/r-input';

describe('RInput', () => {
  it('renders input element', () => {
    render(<RInput placeholder='Enter text' />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RInput label='Username' />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<RInput onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<RInput error='This field is required' />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RInput helperText='Enter at least 8 characters' />);
    expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(<RInput error='Error message' helperText='Helper text' />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<RInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders left icon', () => {
    render(<RInput leftIcon={<span data-testid='left-icon'>🔍</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<RInput rightIcon={<span data-testid='right-icon'>✓</span>} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('shows clear button when clearable and has value', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState('test value');
      return (
        <RInput
          clearable
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
      );
    };
    render(<TestComponent />);

    // Find the clear button (X icon button)
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('calls onClear when clear button clicked', async () => {
    const handleClear = vi.fn();
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = React.useState('test');
      return (
        <RInput
          clearable
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => {
            setValue('');
            handleClear();
          }}
        />
      );
    };
    render(<TestComponent />);

    await user.click(screen.getByRole('button'));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(<RInput fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('sets aria-invalid when error is present', () => {
    render(<RInput error='Error' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(<RInput className='my-wrapper-class' />);
    expect(container.firstChild).toHaveClass('my-wrapper-class');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<RInput size='sm' />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<RInput size='lg' />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

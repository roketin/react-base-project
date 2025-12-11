import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';

describe('RInputPassword', () => {
  it('renders password input', () => {
    render(<RInputPassword placeholder='Enter password' />);
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('has toggle button', () => {
    render(<RInputPassword placeholder='Password' />);
    // Should have at least one button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows eye icon', () => {
    const { container } = render(<RInputPassword />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RInputPassword label='Password' />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<RInputPassword error='Password is required' />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RInputPassword helperText='Minimum 8 characters' />);
    expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<RInputPassword disabled placeholder='Password' />);
    expect(screen.getByPlaceholderText('Password')).toBeDisabled();
  });
});

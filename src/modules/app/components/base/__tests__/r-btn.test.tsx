import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RBtn from '@/modules/app/components/base/r-btn';

describe('RBtn', () => {
  it('renders children correctly', () => {
    render(<RBtn>Click me</RBtn>);
    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<RBtn onClick={handleClick}>Click me</RBtn>);

    fireEvent.click(screen.getByRole('button'));

    // Due to debounce, we need to wait a bit
    await vi.waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state', () => {
    render(
      <RBtn loading loadingLabel='Please wait...'>
        Submit
      </RBtn>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('disables button when disabled prop is true', () => {
    render(<RBtn disabled>Disabled</RBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with iconStart', () => {
    render(
      <RBtn iconStart={<span data-testid='start-icon'>★</span>}>
        With Icon
      </RBtn>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders with iconEnd', () => {
    render(
      <RBtn iconEnd={<span data-testid='end-icon'>→</span>}>With Icon</RBtn>,
    );

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<RBtn className='custom-class'>Button</RBtn>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('has type button by default', () => {
    render(<RBtn>Button</RBtn>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('can be set to type submit', () => {
    render(<RBtn type='submit'>Submit</RBtn>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('does not trigger click when loading', async () => {
    const handleClick = vi.fn();
    render(
      <RBtn loading onClick={handleClick}>
        Loading
      </RBtn>,
    );

    fireEvent.click(screen.getByRole('button'));

    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

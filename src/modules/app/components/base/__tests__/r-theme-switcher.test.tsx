import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RThemeSwitcher } from '../r-theme-switcher';

const mockSetTheme = vi.fn();

vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
    effectiveTheme: 'light',
  }),
}));

describe('RThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropdown variant by default', () => {
    render(<RThemeSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders inline variant', () => {
    render(<RThemeSwitcher variant='inline' />);
    // Should have 3 buttons for light, dark, system
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('opens dropdown on click', async () => {
    render(<RThemeSwitcher />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });
  });

  it('calls setTheme when option selected in dropdown', async () => {
    render(<RThemeSwitcher />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Dark'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme when inline button clicked', () => {
    render(<RThemeSwitcher variant='inline' />);

    const buttons = screen.getAllByRole('button');
    // Click the dark theme button (second one)
    fireEvent.click(buttons[1]);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('applies custom className', () => {
    render(<RThemeSwitcher className='custom-class' />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with small size', () => {
    render(<RThemeSwitcher size='sm' />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows screen reader text', () => {
    render(<RThemeSwitcher />);
    expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
  });
});

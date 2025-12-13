import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppNotFound from '@/modules/app/components/pages/app-not-found';

// Mock useTheme hook
vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('AppNotFound', () => {
  it('renders page not found title', () => {
    render(<AppNotFound />);
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<AppNotFound />);
    expect(
      screen.getByText(/the page you're looking for could not be found/i),
    ).toBeInTheDocument();
  });

  it('renders back to home button', () => {
    render(<AppNotFound />);
    expect(
      screen.getByRole('button', { name: /back to home/i }),
    ).toBeInTheDocument();
  });

  it('navigates to home when button is clicked', () => {
    // Mock window.location
    const originalLocation = window.location;
    const mockLocation = { ...originalLocation, href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    render(<AppNotFound />);
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));

    expect(mockLocation.href).toBe('/');

    // Restore
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });
});

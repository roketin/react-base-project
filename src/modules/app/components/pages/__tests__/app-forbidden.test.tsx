import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppForbidden from '@/modules/app/components/pages/app-forbidden';

// Mock useTheme hook
vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('AppForbidden', () => {
  it('renders 403 status code', () => {
    render(<AppForbidden />);
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('renders access denied title', () => {
    render(<AppForbidden />);
    expect(screen.getByText('Access denied')).toBeInTheDocument();
  });

  it('renders permission description', () => {
    render(<AppForbidden />);
    expect(
      screen.getByText(/you do not have permission to view this page/i),
    ).toBeInTheDocument();
  });

  it('renders go back button', () => {
    render(<AppForbidden />);
    expect(
      screen.getByRole('button', { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it('calls window.history.back when go back button is clicked', () => {
    const historyBackSpy = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    render(<AppForbidden />);
    fireEvent.click(screen.getByRole('button', { name: /go back/i }));

    expect(historyBackSpy).toHaveBeenCalled();
    historyBackSpy.mockRestore();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AppEntryPoint from '@/modules/app/components/pages/app-entry-point';

// Mock hooks
const mockNavigate = vi.fn();
const mockIsLoggedIn = vi.fn();

vi.mock('@/modules/app/hooks/use-named-route', () => ({
  useNamedRoute: () => ({ navigate: mockNavigate }),
}));

vi.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: () => ({ isLoggedIn: mockIsLoggedIn }),
}));

vi.mock('@/modules/app/components/base/app-bootstrap-loading', () => ({
  AppBootstrapLoading: () => (
    <div data-testid='bootstrap-loading'>Loading...</div>
  ),
}));

describe('AppEntryPoint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
    mockIsLoggedIn.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading component', () => {
    mockIsLoggedIn.mockReturnValue(false);
    const { getByTestId } = render(<AppEntryPoint />);
    expect(getByTestId('bootstrap-loading')).toBeInTheDocument();
  });

  it('navigates to dashboard when logged in', async () => {
    mockIsLoggedIn.mockReturnValue(true);
    render(<AppEntryPoint />);

    await vi.advanceTimersByTimeAsync(200);

    expect(mockNavigate).toHaveBeenCalledWith('DashboardIndex');
  });

  it('navigates to login when not logged in', async () => {
    mockIsLoggedIn.mockReturnValue(false);
    render(<AppEntryPoint />);

    await vi.advanceTimersByTimeAsync(200);

    expect(mockNavigate).toHaveBeenCalledWith('AuthLogin');
  });

  it('clears timeout on unmount', () => {
    mockIsLoggedIn.mockReturnValue(false);
    const { unmount } = render(<AppEntryPoint />);

    unmount();
    vi.advanceTimersByTime(200);

    // Navigate should not be called after unmount
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

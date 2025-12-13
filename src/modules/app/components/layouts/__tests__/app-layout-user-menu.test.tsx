import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppUserMenu } from '@/modules/app/components/layouts/app-layout-user-menu';

// Mock hooks
const mockUser = { name: 'John Doe', email: 'john@example.com', role: 'Admin' };
const mockLogout = vi.fn();
const mockNavigate = vi.fn();
const mockSetTheme = vi.fn();
const mockSetIsProfileOpen = vi.fn();

vi.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

vi.mock('@/modules/app/hooks/use-named-route', () => ({
  useNamedRoute: () => ({ navigate: mockNavigate }),
}));

vi.mock('@/modules/app/contexts/sidebar-context', () => ({
  useSidebar: () => ({ isCollapsed: false }),
  useDelayedExpanded: () => true,
}));

vi.mock('@/modules/auth/stores/profile-dialog.store', () => ({
  useProfileDialogStore: () => ({
    isOpen: false,
    setOpen: mockSetIsProfileOpen,
  }),
}));

vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

// Mock components
vi.mock('@/modules/app/components/base/r-popover-primitives', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid='popover-trigger'>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='popover-content'>{children}</div>
  ),
}));

vi.mock('@/modules/app/components/base/r-avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid='avatar'>{name}</div>
  ),
}));

vi.mock('@/modules/app/components/base/r-btn', () => ({
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('@/modules/auth/components/elements/auth-profile-dialog', () => ({
  default: () => <div data-testid='profile-dialog'>Profile Dialog</div>,
}));

vi.mock('@/modules/app/components/base/show-alert', () => ({
  default: vi.fn((_, callback) => {
    callback({ ok: true, setLoading: vi.fn(), close: vi.fn() });
  }),
}));

describe('AppUserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user avatar', () => {
    render(<AppUserMenu />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('renders user name and role', () => {
    render(<AppUserMenu />);
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders user email in popover', () => {
    render(<AppUserMenu />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders theme switcher buttons', () => {
    render(<AppUserMenu />);
    expect(screen.getByTitle('Light')).toBeInTheDocument();
    expect(screen.getByTitle('Dark')).toBeInTheDocument();
    expect(screen.getByTitle('System')).toBeInTheDocument();
  });

  it('changes theme when theme button is clicked', () => {
    render(<AppUserMenu />);
    fireEvent.click(screen.getByTitle('Dark'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('opens profile dialog when profile button is clicked', () => {
    render(<AppUserMenu />);
    fireEvent.click(screen.getByText('Profile'));
    expect(mockSetIsProfileOpen).toHaveBeenCalledWith(true);
  });

  it('handles logout', async () => {
    render(<AppUserMenu />);
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(
      () => {
        expect(mockLogout).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });
});

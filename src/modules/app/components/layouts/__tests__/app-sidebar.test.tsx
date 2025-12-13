import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '@/modules/app/components/layouts/app-sidebar';
import { MemoryRouter } from 'react-router-dom';

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock hooks
vi.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    isCan: () => true,
  }),
}));

vi.mock('@/modules/app/contexts/sidebar-context', () => ({
  useSidebar: () => ({
    isCollapsed: false,
    toggleSidebar: vi.fn(),
  }),
  useDelayedExpanded: () => true,
}));

vi.mock('@/modules/app/hooks/use-named-route', () => ({
  nameToPath: (name: string) => `/${name.toLowerCase()}`,
  useNamedRoute: () => ({
    linkTo: (name: string) => `/${name.toLowerCase()}`,
    navigate: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock sidebar menus
vi.mock('@/modules/app/libs/sidebar-menu.lib', () => ({
  APP_SIDEBAR_MENUS: [
    {
      name: 'DashboardIndex',
      title: 'Dashboard',
      icon: () => <span>Icon</span>,
    },
    {
      title: 'Settings',
      icon: () => <span>Icon</span>,
      children: [
        { name: 'SettingsProfile', title: 'Profile' },
        { name: 'SettingsAccount', title: 'Account' },
      ],
    },
  ],
}));

// Mock components
vi.mock('@/modules/app/components/base/r-popover-primitives', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('./app-layout-user-menu', () => ({
  AppUserMenu: () => <div data-testid='user-menu'>User Menu</div>,
}));

vi.mock('./app-sidebar-header', () => ({
  default: () => <div data-testid='sidebar-header'>Sidebar Header</div>,
}));

vi.mock('@/modules/app/components/base/r-sidebar', () => ({
  RSidebar: ({ children }: { children: React.ReactNode }) => (
    <aside data-testid='sidebar'>{children}</aside>
  ),
  RSidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RSidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RSidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RSidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RSidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RSidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  RSidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  RSidebarMenuButton: ({
    children,
    onClick,
    tooltip,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    tooltip?: string;
  }) => (
    <button onClick={onClick} title={tooltip}>
      {children}
    </button>
  ),
  RSidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  RSidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
}));

describe('AppSidebar', () => {
  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('renders sidebar', () => {
    renderWithRouter(<AppSidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders menu items', () => {
    renderWithRouter(<AppSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders parent menu with children', () => {
    renderWithRouter(<AppSidebar />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders collapse/expand button', () => {
    renderWithRouter(<AppSidebar />);
    expect(screen.getByTitle('Collapse Menu')).toBeInTheDocument();
  });

  it('toggles submenu when parent is clicked', () => {
    renderWithRouter(<AppSidebar />);
    const settingsButton = screen.getByText('Settings').closest('button');
    if (settingsButton) {
      fireEvent.click(settingsButton);
    }
    // Children should be visible (use getAllByText since Profile appears in user menu too)
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});

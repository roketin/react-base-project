import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppLayout from '@/modules/app/components/layouts/app-layout';
import { MemoryRouter } from 'react-router-dom';

// Mock hooks
const mockIsBootstrapping = vi.fn();
vi.mock('@/modules/auth/hooks/use-auth-bootstrap', () => ({
  useAuthBootstrap: () => ({ isBootstrapping: mockIsBootstrapping() }),
}));

// Mock components
vi.mock('@/modules/app/components/base/app-bootstrap-loading', () => ({
  AppBootstrapLoading: () => (
    <div data-testid='bootstrap-loading'>Loading...</div>
  ),
}));

vi.mock('@/modules/app/components/layouts/app-sidebar', () => ({
  AppSidebar: () => <div data-testid='app-sidebar'>Sidebar</div>,
}));

vi.mock('@/modules/app/components/layouts/app-layout-header', () => ({
  AppLayoutHeader: () => <div data-testid='app-layout-header'>Header</div>,
}));

vi.mock('@/modules/adaptive-search', () => ({
  RAdaptiveSearch: () => <div data-testid='adaptive-search'>Search</div>,
  RAdaptiveSearchTrigger: () => (
    <div data-testid='search-trigger'>Search Trigger</div>
  ),
}));

vi.mock('@/modules/app/components/base/r-sidebar', () => ({
  RSidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='sidebar-provider'>{children}</div>
  ),
  RSidebarInset: ({ children }: { children: React.ReactNode }) => (
    <main data-testid='sidebar-inset'>{children}</main>
  ),
}));

describe('AppLayout', () => {
  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('renders loading when bootstrapping', () => {
    mockIsBootstrapping.mockReturnValue(true);
    renderWithRouter(<AppLayout />);
    expect(screen.getByTestId('bootstrap-loading')).toBeInTheDocument();
  });

  it('renders layout when not bootstrapping', () => {
    mockIsBootstrapping.mockReturnValue(false);
    renderWithRouter(<AppLayout />);
    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('app-layout-header')).toBeInTheDocument();
  });

  it('renders search trigger', () => {
    mockIsBootstrapping.mockReturnValue(false);
    renderWithRouter(<AppLayout />);
    expect(screen.getByTestId('search-trigger')).toBeInTheDocument();
  });

  it('renders adaptive search', () => {
    mockIsBootstrapping.mockReturnValue(false);
    renderWithRouter(<AppLayout />);
    expect(screen.getByTestId('adaptive-search')).toBeInTheDocument();
  });
});

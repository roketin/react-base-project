import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppSidebarHeader from '@/modules/app/components/layouts/app-sidebar-header';
import { MemoryRouter } from 'react-router-dom';

// Mock hooks
const mockIsCollapsed = vi.fn();
vi.mock('@/modules/app/contexts/sidebar-context', () => ({
  useSidebar: () => ({ isCollapsed: mockIsCollapsed() }),
}));

vi.mock('@/modules/app/hooks/use-named-route', () => ({
  useNamedRoute: () => ({ linkTo: () => '/dashboard' }),
}));

// Mock components
vi.mock('@/modules/app/components/base/r-brand', () => ({
  RBrand: () => <div data-testid='brand'>Brand</div>,
}));

vi.mock('@/modules/app/components/base/r-sidebar', () => ({
  RSidebarHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='sidebar-header' className={className}>
      {children}
    </div>
  ),
}));

describe('AppSidebarHeader', () => {
  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('renders brand when not collapsed', () => {
    mockIsCollapsed.mockReturnValue(false);
    renderWithRouter(<AppSidebarHeader />);
    expect(screen.getByTestId('brand')).toBeInTheDocument();
  });

  it('returns null when collapsed', () => {
    mockIsCollapsed.mockReturnValue(true);
    const { container } = renderWithRouter(<AppSidebarHeader />);
    expect(container.firstChild).toBeNull();
  });

  it('renders link to dashboard', () => {
    mockIsCollapsed.mockReturnValue(false);
    renderWithRouter(<AppSidebarHeader />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});

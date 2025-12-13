import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppLayoutHeader } from '@/modules/app/components/layouts/app-layout-header';
import { MemoryRouter } from 'react-router-dom';

// Mock components
vi.mock('@/modules/app/components/base/r-lang-switcher', () => ({
  default: () => <div data-testid='lang-switcher'>Lang Switcher</div>,
}));

vi.mock('@/modules/app/components/base/r-breadcrumbs', () => ({
  RBreadcrumbs: () => <div data-testid='breadcrumbs'>Breadcrumbs</div>,
}));

vi.mock('@/modules/app/components/base/r-sidebar', () => ({
  RSidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid='sidebar-trigger' className={className}>
      Toggle
    </button>
  ),
}));

describe('AppLayoutHeader', () => {
  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('renders header element', () => {
    renderWithRouter(<AppLayoutHeader />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithRouter(<AppLayoutHeader />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders language switcher', () => {
    renderWithRouter(<AppLayoutHeader />);
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
  });

  it('renders sidebar trigger for mobile', () => {
    renderWithRouter(<AppLayoutHeader />);
    const trigger = screen.getByTestId('sidebar-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass('md:hidden');
  });
});

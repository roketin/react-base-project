import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RSidebar,
  RSidebarProvider,
  RSidebarHeader,
  RSidebarContent,
  RSidebarFooter,
  RSidebarMenu,
  RSidebarMenuItem,
  RSidebarMenuButton,
} from '@/modules/app/components/base/r-sidebar';

// Mock hooks
vi.mock('@/modules/app/hooks/use-viewport', () => ({
  useViewport: () => ({ isMobile: false }),
}));

describe('RSidebar', () => {
  const renderWithProvider = (children: React.ReactNode) => {
    return render(<RSidebarProvider>{children}</RSidebarProvider>);
  };

  it('renders sidebar', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>Sidebar Content</RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('renders header', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarHeader>Header</RSidebarHeader>
      </RSidebar>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarFooter>Footer</RSidebarFooter>
      </RSidebar>,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders menu items', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton>Dashboard</RSidebarMenuButton>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('applies custom className to sidebar', () => {
    const { container } = renderWithProvider(
      <RSidebar className='custom-sidebar'>
        <RSidebarContent>Content</RSidebarContent>
      </RSidebar>,
    );
    expect(container.querySelector('.custom-sidebar')).toBeInTheDocument();
  });
});

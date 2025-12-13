import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RSidebar,
  RSidebarProvider,
  RSidebarHeader,
  RSidebarContent,
  RSidebarFooter,
  RSidebarMenu,
  RSidebarMenuItem,
  RSidebarMenuButton,
  RSidebarMenuSub,
  RSidebarMenuSubItem,
  RSidebarGroup,
  RSidebarGroupContent,
  RSidebarInset,
  RSidebarTrigger,
} from '@/modules/app/components/base/r-sidebar';

// Mock hooks
const mockIsMobile = vi.fn();
vi.mock('@/modules/app/hooks/use-viewport', () => ({
  useViewport: () => ({ isMobile: mockIsMobile() }),
}));

// Mock config
vi.mock('@config', () => ({
  default: {
    sidebar: {
      settings: {
        widthMobile: '280px',
      },
    },
  },
}));

describe('RSidebar', () => {
  beforeEach(() => {
    mockIsMobile.mockReturnValue(false);
    localStorage.clear();
  });

  const renderWithProvider = (children: React.ReactNode, props = {}) => {
    return render(<RSidebarProvider {...props}>{children}</RSidebarProvider>);
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

  it('renders RSidebarGroup and RSidebarGroupContent', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarGroup>
            <RSidebarGroupContent>Group Content</RSidebarGroupContent>
          </RSidebarGroup>
        </RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Group Content')).toBeInTheDocument();
  });

  it('renders RSidebarMenuSub and RSidebarMenuSubItem', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton>Parent</RSidebarMenuButton>
              <RSidebarMenuSub>
                <RSidebarMenuSubItem>
                  <RSidebarMenuButton size='sub'>Child</RSidebarMenuButton>
                </RSidebarMenuSubItem>
              </RSidebarMenuSub>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('renders RSidebarInset', () => {
    renderWithProvider(
      <>
        <RSidebar>
          <RSidebarContent>Sidebar</RSidebarContent>
        </RSidebar>
        <RSidebarInset>Main Content</RSidebarInset>
      </>,
    );
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders RSidebarTrigger and toggles sidebar', () => {
    renderWithProvider(
      <>
        <RSidebar>
          <RSidebarContent>Sidebar</RSidebarContent>
        </RSidebar>
        <RSidebarTrigger />
      </>,
    );
    const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
  });

  it('handles menu button click', () => {
    const onClick = vi.fn();
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton onClick={onClick}>
                Click Me
              </RSidebarMenuButton>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders menu button with asChild', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton asChild>
                <a href='/dashboard'>Dashboard Link</a>
              </RSidebarMenuButton>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Dashboard Link')).toBeInTheDocument();
  });

  it('renders active menu button', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton isActive>Active Item</RSidebarMenuButton>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    const button = screen.getByText('Active Item');
    expect(button).toHaveClass('bg-primary/15');
  });

  it('renders menu button with different sizes', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>
          <RSidebarMenu>
            <RSidebarMenuItem>
              <RSidebarMenuButton size='sm'>Small</RSidebarMenuButton>
            </RSidebarMenuItem>
            <RSidebarMenuItem>
              <RSidebarMenuButton size='md'>Medium</RSidebarMenuButton>
            </RSidebarMenuItem>
            <RSidebarMenuItem>
              <RSidebarMenuButton size='lg'>Large</RSidebarMenuButton>
            </RSidebarMenuItem>
          </RSidebarMenu>
        </RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>Content</RSidebarContent>
      </RSidebar>,
      { open: true, onOpenChange },
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('supports defaultOpen prop', () => {
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>Content</RSidebarContent>
      </RSidebar>,
      { defaultOpen: false },
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders mobile sheet when isMobile is true', () => {
    mockIsMobile.mockReturnValue(true);
    renderWithProvider(
      <RSidebar>
        <RSidebarContent>Mobile Content</RSidebarContent>
      </RSidebar>,
    );
    // Sheet is rendered but content may not be visible until opened
    expect(screen.queryByText('Mobile Content')).not.toBeInTheDocument();
  });

  it('applies custom className to header', () => {
    const { container } = renderWithProvider(
      <RSidebar>
        <RSidebarHeader className='custom-header'>Header</RSidebarHeader>
      </RSidebar>,
    );
    expect(container.querySelector('.custom-header')).toBeInTheDocument();
  });

  it('applies custom className to content', () => {
    const { container } = renderWithProvider(
      <RSidebar>
        <RSidebarContent className='custom-content'>Content</RSidebarContent>
      </RSidebar>,
    );
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });

  it('applies custom className to footer', () => {
    const { container } = renderWithProvider(
      <RSidebar>
        <RSidebarFooter className='custom-footer'>Footer</RSidebarFooter>
      </RSidebar>,
    );
    expect(container.querySelector('.custom-footer')).toBeInTheDocument();
  });

  it('renders sidebar on right side', () => {
    renderWithProvider(
      <RSidebar side='right'>
        <RSidebarContent>Right Sidebar</RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Right Sidebar')).toBeInTheDocument();
  });

  it('renders non-resizable sidebar', () => {
    renderWithProvider(
      <RSidebar resizable={false}>
        <RSidebarContent>Non-resizable</RSidebarContent>
      </RSidebar>,
    );
    expect(screen.getByText('Non-resizable')).toBeInTheDocument();
  });
});

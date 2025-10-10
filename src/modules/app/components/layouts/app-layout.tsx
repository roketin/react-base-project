import { AppBootstrapLoading } from '@/modules/app/components/base/app-bootstrap-loading';
import { AppSidebar } from '@/modules/app/components/layouts/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
} from '@/modules/app/components/ui/sidebar';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { Suspense, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import showAlert from '@/modules/app/components/base/show-alert';
import { useAuthBootstrap } from '@/modules/auth/hooks/use-auth-bootstrap';
import { AppLayoutHeader } from './app-layout-header';

/**
 * Main layout component for the application.
 * It manages sidebar state, header with navigation, user profile popover,
 * and language toggling. Displays a loading screen during authentication bootstrap.
 *
 * @returns JSX.Element representing the app layout.
 */
export default function AppLayout() {
  const { user, logout } = useAuth();
  const { navigate } = useNamedRoute();
  const { isBootstrapping } = useAuthBootstrap();
  /**
   * Computes and memoizes the user's initials based on their name.
   * Returns up to two uppercase initials or a default string if no name is present.
   *
   * @returns {string} User initials or default abbreviation.
   */
  const initials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return 'RKT';
  }, [user?.name]);

  /**
   * Handles user logout with a confirmation prompt.
   * Shows a modal alert to confirm logout, and upon confirmation,
   * triggers logout, closes the alert, and navigates to the login page.
   *
   * @returns {void}
   */
  const handleLogout = useCallback(() => {
    showAlert(
      {
        title: 'Logout confirmation',
        description: 'Are you sure you want to logout from the dashboard?',
        type: 'confirm',
      },
      ({ ok, setLoading, close }) => {
        if (!ok) return;
        setLoading(true);
        setTimeout(() => {
          logout();
          close();
          navigate('AuthLogin', {}, { replace: true });
        }, 400);
      },
    );
  }, [logout, navigate]);

  // Render a bootstrap loading screen while authentication state is initializing.
  if (isBootstrapping) {
    return <AppBootstrapLoading />;
  }

  return (
    /**
     * SidebarProvider supplies context for sidebar state management.
     * The layout includes the sidebar, a header with navigation breadcrumbs,
     * language toggle, user profile popover, and main content outlet.
     */
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-muted/10'>
        <AppLayoutHeader
          initials={initials}
          userName={user?.name}
          userEmail={user?.email}
          userRole={user?.role}
          onLogout={handleLogout}
        />
        <div className='relative flex-1 overflow-y-auto'>
          <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.primary/12),transparent_55%)]' />
          <div className='relative z-10 p-6'>
            <Suspense
              fallback={
                <div className='min-h-[200px] rounded-xl border border-border/60 bg-background/80 p-10'>
                  <div className='flex h-full w-full flex-col gap-8 animate-pulse'>
                    <div className='h-6 w-2/5 rounded bg-muted/60' />
                    <div className='space-y-4'>
                      <div className='h-3 w-full rounded bg-muted/50' />
                      <div className='h-3 w-11/12 rounded bg-muted/40' />
                      <div className='h-3 w-10/12 rounded bg-muted/40' />
                      <div className='h-3 w-9/12 rounded bg-muted/30' />
                    </div>
                    <div className='space-y-3'>
                      <div className='h-3 w-full rounded bg-muted/40' />
                      <div className='h-3 w-10/12 rounded bg-muted/30' />
                      <div className='h-3 w-9/12 rounded bg-muted/30' />
                      <div className='h-3 w-7/12 rounded bg-muted/20' />
                    </div>
                  </div>
                </div>
              }
            >
              <div className=''>
                <Outlet />
              </div>
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

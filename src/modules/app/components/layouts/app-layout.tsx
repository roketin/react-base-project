import { RBreadcrumbs } from '@/modules/app/components/base/r-breadcrumbs';
import { AppBootstrapLoading } from '@/modules/app/components/base/app-bootstrap-loading';
import { RLoading } from '@/modules/app/components/base/r-loading';
import { AppSidebar } from '@/modules/app/components/layouts/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/modules/app/components/ui/sidebar';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import Button from '@/modules/app/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { Separator } from '@radix-ui/react-separator';
import { LogOut, UserRound } from 'lucide-react';
import { Suspense, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import showAlert from '@/modules/app/components/base/show-alert';
import { useAuthBootstrap } from '@/modules/auth/hooks/use-auth-bootstrap';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { navigate } = useNamedRoute();
  const { isBootstrapping } = useAuthBootstrap();

  /**
   * Memoize the computation of user initials to avoid unnecessary recalculations
   * on every render unless the user name changes.
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
    return 'AD';
  }, [user?.name]);

  /**
   * useCallback memoizes the logout handler to prevent recreation of the function
   * on every render, which can improve performance especially when passed down as props.
   * This function triggers a confirmation alert before logging out the user.
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

  // Display a dedicated bootstrap screen while authentication state is prepared
  if (isBootstrapping) {
    return <AppBootstrapLoading />;
  }

  return (
    /**
     * SidebarProvider wraps the layout to provide context for sidebar state management.
     * The layout includes the sidebar, header with navigation breadcrumbs, and user profile popover.
     */
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-muted/10'>
        <header className='sticky top-0 z-20 flex shrink-0 items-center gap-4 border-b border-border/60 bg-background/80 py-2 px-5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm justify-between'>
          <div className='flex items-center gap-3'>
            <SidebarTrigger className='-ml-2 rounded-lg border border-border/60 bg-background/80 hover:bg-primary/10 hover:text-primary' />
            <Separator
              orientation='vertical'
              className='h-8 border-l border-border/60'
            />
            <div className='flex flex-col gap-1'>
              <span className='text-xs uppercase tracking-widest text-muted-foreground'>
                Navigation
              </span>
              <RBreadcrumbs />
            </div>
          </div>

          {/* User profile and logout popover */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button className='group flex items-center gap-3 px-3 py-2 text-left  transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'>
                  <div className='text-right leading-tight'>
                    <p className='text-sm font-medium group-hover:text-primary'>
                      {user?.name ?? 'Administrator'}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {user?.email ?? 'admin@roketin.dev'}
                    </p>
                  </div>
                  <span className='grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-foreground shadow'>
                    {initials}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align='end'
                className='w-56 border-border/70 p-0 shadow-lg'
              >
                <div className='border-b border-border/60 px-4 py-3'>
                  <p className='text-sm font-semibold'>
                    {user?.name ?? 'Administrator'}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {user?.email ?? 'admin@roketin.dev'}
                  </p>
                </div>
                <div className='flex flex-col gap-1 p-2'>
                  <Button
                    variant='ghost'
                    className='justify-start gap-2 text-sm'
                    disabled
                  >
                    <UserRound className='size-4' />
                    Profile (coming soon)
                  </Button>
                  <Button
                    variant='ghost'
                    className='justify-start gap-2 text-sm text-destructive hover:text-destructive'
                    onClick={handleLogout}
                  >
                    <LogOut className='size-4' />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <div className='relative flex-1 overflow-y-auto'>
          <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.primary/12),transparent_55%)]' />
          <div className='relative z-10 mx-auto w-full max-w-6xl px-6 py-10'>
            <Suspense
              fallback={
                <div className='min-h-[200px] rounded-3xl border border-border/60 bg-background/80 p-10 shadow-sm'>
                  <RLoading
                    label='Please wait...'
                    iconClassName='size-6'
                    className='h-full w-full'
                  />
                </div>
              }
            >
              <div className='rounded-lg border border-border/60 bg-background/90 p-6 shadow-lg backdrop-blur-sm'>
                <Outlet />
              </div>
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

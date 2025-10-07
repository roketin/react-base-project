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
import { LogOut, UserRound, Languages } from 'lucide-react';
import { Suspense, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import showAlert from '@/modules/app/components/base/show-alert';
import { useAuthBootstrap } from '@/modules/auth/hooks/use-auth-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation('app');

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

  /**
   * Toggles the application language between English ('en') and Indonesian ('id').
   * Uses i18n instance to change the language asynchronously.
   *
   * @returns {void}
   */
  const toggleLanguage = useCallback(() => {
    const nextLang = i18n.language === 'en' ? 'id' : 'en';
    void i18n.changeLanguage(nextLang);
  }, [i18n]);

  /**
   * Memoizes the label for the language toggle button.
   * Displays 'ID' when current language is English and 'EN' otherwise.
   *
   * @returns {string} Language toggle label.
   */
  const languageLabel = useMemo(
    () => (i18n.language === 'en' ? 'ID' : 'EN'),
    [i18n.language],
  );

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

          {/* Language toggle and user profile section */}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
              onClick={toggleLanguage}
            >
              <Languages className='size-4' />
              <span className='text-xs font-semibold'>{languageLabel}</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <button className='group flex items-center gap-3 px-3 py-2 transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:rounded-md'>
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

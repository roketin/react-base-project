import { AppBootstrapLoading } from '@/modules/app/components/base/app-bootstrap-loading';
import { AppSidebar } from '@/modules/app/components/layouts/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
} from '@/modules/app/components/ui/sidebar';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
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
  const { isBootstrapping } = useAuthBootstrap();

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
      <SidebarInset className='bg-pattern'>
        <AppLayoutHeader />
        <div id='app-container' className='p-3'>
          <div className='p-5 bg-white rounded-lg shadow-xl shadow-gray-100'>
            <Suspense
              fallback={
                <div className='min-h-[200px] bg-background/80 p-10'>
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
              <Outlet />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

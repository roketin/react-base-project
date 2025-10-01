import { RBreadcrumbs } from '@/modules/app/components/base/r-breadcrumbs';
import { AppSidebar } from '@/modules/app/components/layouts/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/modules/app/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <RBreadcrumbs />
        </header>
        <div className='p-3'>
          <Suspense
            fallback={
              <div className='flex items-center justify-center gap-4 p-6'>
                <Loader2 className='animate-spin' />
                <h3>Please wait....</h3>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

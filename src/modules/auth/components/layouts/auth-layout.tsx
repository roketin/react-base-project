import FileInfo from '@/modules/app/components/base/file-info';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RLoading } from '@/modules/app/components/base/r-loading';
import { RBrand } from '@/modules/app/components/base/r-brand';
import RLangSwitcher from '@/modules/app/components/base/r-lang-switcher';

const AuthLayout = () => {
  // Check current session
  const { isLoggedIn } = useAuth();

  // When is logged in try to redirect to dashboard index
  if (isLoggedIn()) {
    return <RNavigate name='DashboardIndex' />;
  }

  return (
    <div className='h-full flex flex-col md:flex-row bg-slate-50'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Suspense
          fallback={
            <RLoading label='Please wait....' className='h-full w-full' />
          }
        >
          <Outlet />
        </Suspense>
      </div>

      <div className='flex-1 bg-slate-100 flex flex-col items-center justify-center gap-4 px-6 text-center md:px-10 md:text-left'>
        <div className='md:w-[400px] inline-flex flex-col gap-4'>
          <RBrand
            align='center'
            className='md:items-start md:text-left'
            subtitleClassName='text-sm text-muted-foreground'
          />

          {/* Language dropdown */}
          <div>
            <RLangSwitcher />
          </div>

          <FileInfo src='src/modules/auth/components/layouts/auth-layout.tsx' />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

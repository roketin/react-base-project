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
    <div className='h-full flex items-center justify-center bg-pattern p-5'>
      <div className='flex w-full md:w-auto flex-col md:flex-row gap-4 bg-background/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm p-3 rounded-lg shadow-xl shadow-gray-100 relative z-10'>
        <div className='flex-1 order-1 md:order-0'>
          <div className='w-full md:w-[350px] p-5'>
            <Suspense
              fallback={
                <RLoading label='Please wait....' className='h-[300px]' />
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
        <div className='p-3 md:p-10 bg-primary/10 rounded-lg flex flex-col justify-between flex-none order-0 md:order-1'>
          <RBrand align='center' className='mb-4' />

          {/* Language dropdown */}
          <RLangSwitcher />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

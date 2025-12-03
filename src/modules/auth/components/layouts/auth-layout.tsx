import { RNavigate } from '@/modules/app/components/base/r-navigate';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RBrand } from '@/modules/app/components/base/r-brand';
import { useTheme } from '@/modules/app/hooks/use-theme';
import { useTranslation } from 'react-i18next';
import { RSkeleton } from '@/modules/app/components/base/r-skeleton';

const AuthLayout = () => {
  const { t } = useTranslation('auth');

  // Initialize theme
  useTheme();

  // Check current session
  const { isLoggedIn } = useAuth();

  // When is logged in try to redirect to dashboard index
  if (isLoggedIn()) {
    return <RNavigate name='DashboardIndex' />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-primary/10 p-4 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl' />
      </div>

      {/* Main card */}
      <div className='relative z-10'>
        <div className='flex flex-col md:flex-row gap-0 bg-card rounded-2xl shadow-sm overflow-hidden border border-border/50'>
          {/* Right side - Branding (shown first on mobile) */}
          <div className='md:w-[400px] bg-linear-to-br from-primary to-primary/80 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden order-first md:order-last'>
            {/* Decorative pattern */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2' />
              <div className='absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2' />
            </div>

            <div className='relative z-10'>
              {/* Brand with better contrast */}
              <div className='mb-8 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20'>
                <RBrand
                  align='start'
                  subtitleClassName='text-white'
                  titleClassName='text-white'
                />
              </div>

              <div className='space-y-4'>
                <h2 className='text-3xl font-bold drop-shadow-sm'>
                  {t('layout.welcomeTitle')}
                </h2>
                <p className='text-white/95 leading-relaxed text-base'>
                  {t('layout.welcomeDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Left side - Form (shown second on mobile) */}
          <div className='md:w-[400px] p-8 md:p-8 order-last md:order-first'>
            <Suspense
              fallback={
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <RSkeleton className='h-8 w-32' />
                    <RSkeleton className='h-4 w-full' />
                  </div>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <RSkeleton className='h-4 w-20' />
                      <RSkeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <RSkeleton className='h-4 w-20' />
                      <RSkeleton className='h-10 w-full' />
                    </div>
                    <RSkeleton className='h-10 w-full' />
                  </div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

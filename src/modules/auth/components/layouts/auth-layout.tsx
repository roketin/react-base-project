import FileInfo from '@/modules/app/components/base/file-info';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import Button from '@/modules/app/components/ui/button';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { RLoading } from '@/modules/app/components/base/r-loading';
import { RBrand } from '@/modules/app/components/base/r-brand';
import { Languages } from 'lucide-react';

const AuthLayout = () => {
  // locale
  const { i18n } = useTranslation('app');

  // Check current session
  const { isLoggedIn } = useAuth();

  // Toggle language EN <-> ID
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(nextLang);
  };

  // Language label
  const languageLabel = useMemo(
    () => (i18n.language === 'en' ? 'ID' : 'EN'),
    [i18n.language],
  );

  // When is logged in try to redirect to dashboard index
  if (isLoggedIn()) {
    return <RNavigate name='DashboardIndex' />;
  }

  return (
    <div className='h-full flex flex-col md:flex-row'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Suspense
          fallback={
            <RLoading label='Please wait....' className='h-full w-full' />
          }
        >
          <Outlet />
        </Suspense>
      </div>

      <div className='flex-1 bg-slate-50 flex flex-col items-center justify-center gap-4 px-6 text-center md:px-10 md:text-left'>
        <RBrand
          align='center'
          className='md:items-start md:text-left'
          subtitleClassName='text-sm text-muted-foreground'
        />
        <FileInfo src='src/modules/auth/components/layouts/auth-layout.tsx' />

        {/* Language toggle button */}
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
          onClick={toggleLanguage}
        >
          <Languages className='size-4' />
          <span className='text-xs font-semibold'>{languageLabel}</span>
        </Button>
      </div>
    </div>
  );
};

export default AuthLayout;

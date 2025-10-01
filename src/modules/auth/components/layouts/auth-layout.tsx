import FileInfo from '@/modules/app/components/base/file-info';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import Button from '@/modules/app/components/ui/button';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  // locale
  const { t, i18n } = useTranslation('app');

  // Check current session
  const { isLoggedIn } = useAuth();

  // Toggle language EN <-> ID
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(nextLang);
  };

  // When is logged in try to redirect to dashboard index
  if (isLoggedIn()) {
    return <RNavigate name='DashboardIndex' />;
  }

  return (
    <div className='h-full flex flex-col md:flex-row'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Suspense
          fallback={
            <div className='h-full w-full flex items-center justify-center gap-4'>
              <Loader2 className='animate-spin' />
              <h3>Please wait....</h3>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>

      <div className='flex-1 bg-slate-50 flex flex-col items-center justify-center gap-4'>
        <div className=''>
          <h2 className='text-2xl'>{t('title')} </h2>
          <p>{t('subTitle')}</p>
          <FileInfo src='src/modules/auth/components/layouts/auth-layout.tsx' />
        </div>

        {/* Language toggle button */}
        <Button onClick={toggleLanguage} size='sm'>
          {i18n.language === 'en' ? 'Switch to ID' : 'Switch to EN'}
        </Button>
      </div>
    </div>
  );
};

export default AuthLayout;

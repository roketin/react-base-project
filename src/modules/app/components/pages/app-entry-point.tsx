import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useEffect } from 'react';
import { RLoading } from '@/modules/app/components/base/r-loading';

const AppEntryPoint = () => {
  // Hooks
  const { navigate } = useNamedRoute();
  const { isLoggedIn } = useAuth();

  // Show loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(isLoggedIn() ? 'DashboardIndex' : 'AuthLogin');
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoggedIn, navigate]);

  return (
    <RLoading
      label='App Skeleton'
      className='h-full w-full'
      labelClassName='text-lg font-semibold'
    />
  );
};
export default AppEntryPoint;

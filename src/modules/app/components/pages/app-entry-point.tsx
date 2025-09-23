import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { LoaderPinwheel } from 'lucide-react';
import { useEffect } from 'react';

const AppEntryPoint = () => {
  // Hooks
  const { navigate } = useNamedRoute();
  const { isLoggedIn } = useAuth();

  // Show loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(isLoggedIn() ? '/admin' : '/auth/login');
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoggedIn, navigate]);

  return (
    <div className='h-full w-full flex items-center justify-center gap-4'>
      <LoaderPinwheel className='animate-spin' />
      <h3>App Skeleton</h3>
    </div>
  );
};
export default AppEntryPoint;

import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

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
    <div className='h-full w-full flex items-center justify-center gap-4'>
      <Loader2 className='animate-spin' />
      <h3>App Skeleton</h3>
    </div>
  );
};
export default AppEntryPoint;

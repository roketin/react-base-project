import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useEffect } from 'react';
import { AppBootstrapLoading } from '@/modules/app/components/base/app-bootstrap-loading';

const AppEntryPoint = () => {
  // Hooks
  const { navigate } = useNamedRoute();
  const { isLoggedIn } = useAuth();

  // Show loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(isLoggedIn() ? 'DashboardIndex' : 'AuthLogin');
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoggedIn, navigate]);

  return <AppBootstrapLoading />;
};
export default AppEntryPoint;

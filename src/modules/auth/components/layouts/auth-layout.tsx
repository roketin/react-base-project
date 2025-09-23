import FileInfo from '@/modules/app/components/base/file-info';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const { isLoggedIn } = useAuth();

  // When is logged in try to redirect to dashboard index
  if (isLoggedIn()) {
    return <RNavigate name='DashboardIndex' />;
  }

  return (
    <div className='h-full flex flex-col md:flex-row'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Outlet />
      </div>
      <div className='flex-1 bg-slate-50 flex items-center justify-center'>
        <div className=''>
          <h2 className='text-2xl'>Auth Layout</h2>
          <FileInfo src='src/modules/auth/components/layouts/auth-layout.tsx' />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;

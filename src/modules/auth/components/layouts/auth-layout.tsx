import { Badge } from '@/modules/app/components/ui/badge';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='h-full flex flex-col md:flex-row'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Outlet />
      </div>
      <div className='flex-1 bg-slate-50 flex items-center justify-center'>
        <div className=''>
          <h2 className='text-4xl mb-3'>Auth Layout</h2>
          <i className='block text-sm leading-relaxed'>
            File Location:
            <Badge variant='success' className='block mt-1'>
              src/modules/auth/components/layouts/auth-layout.tsx
            </Badge>
          </i>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;

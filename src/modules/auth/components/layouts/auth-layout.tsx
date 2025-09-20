import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='h-full flex flex-col md:flex-row'>
      <div className='md:flex-1 flex items-center justify-center'>
        <Outlet />
      </div>
      <div className='flex-1 bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl mb-3'>Auth Layout</h2>
          <i>
            File location: src/modules/auth/components/layouts/auth-layout.tsx
          </i>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;

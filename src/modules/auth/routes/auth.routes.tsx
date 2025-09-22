import { Navigate } from 'react-router-dom';
import AuthLayout from '@/modules/auth/components/layouts/auth-layout';
import AuthForgot from '@/modules/auth/components/pages/auth-forgot';
import AuthLogin from '@/modules/auth/components/pages/auth-login';
import AuthReset from '@/modules/auth/components/pages/auth-reset';
import { createAppRoutes } from '@/modules/app/libs/routes-utils';

export const authRoutes = createAppRoutes([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to='login' replace /> },
      { name: 'AuthLogin', path: 'login', element: <AuthLogin /> },
      { name: 'AuthForgot', path: 'forgot', element: <AuthForgot /> },
      { name: 'AuthReset', path: 'reset', element: <AuthReset /> },
    ],
  },
]);

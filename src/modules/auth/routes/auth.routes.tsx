import { Navigate, type RouteObject } from 'react-router-dom';
import AuthLayout from '@/modules/auth/components/layouts/auth-layout';
import AuthForgot from '@/modules/auth/components/pages/auth-forgot';
import AuthLogin from '@/modules/auth/components/pages/auth-login';
import AuthReset from '@/modules/auth/components/pages/auth-reset';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to='login' replace /> },
      { path: 'login', element: <AuthLogin /> },
      { path: 'forgot', element: <AuthForgot /> },
      { path: 'reset', element: <AuthReset /> },
    ],
  },
];

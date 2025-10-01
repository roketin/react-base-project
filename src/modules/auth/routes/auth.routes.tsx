import { Navigate } from 'react-router-dom';
import AuthLayout from '@/modules/auth/components/layouts/auth-layout';
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { lazy } from 'react';

const AuthForgot = lazy(
  () => import('@/modules/auth/components/pages/auth-forgot'),
);

const AuthLogin = lazy(
  () => import('@/modules/auth/components/pages/auth-login'),
);

const AuthReset = lazy(
  () => import('@/modules/auth/components/pages/auth-reset'),
);

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

// app-routes.ts
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import AppGlobalError from '@/modules/app/components/pages/app-global-error';
import AppEntryPoint from '@/modules/app/components/pages/app-entry-point';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import AppLayout from '@/modules/app/components/layouts/app-layout';
import AuthProtectedRoute from '@/modules/auth/hoc/auth-protected-route';

import { Outlet } from 'react-router-dom';
import { authRoutes } from '@/modules/auth/routes/auth.routes';
import { dashboardRoutes } from '@/modules/dashboard/routes/dashboard.routes';

export const appRoutesConfig = [
  {
    path: '/',
    element: <Outlet />,
    errorElement: <AppGlobalError />,
    children: [
      { index: true, element: <AppEntryPoint /> },
      ...authRoutes,
      {
        path: '/admin',
        element: <AuthProtectedRoute element={<AppLayout />} />,
        children: [...dashboardRoutes],
      },
      { path: '*', element: <AppNotFound /> },
    ],
  },
];

export const routes = createAppRoutes(appRoutesConfig);

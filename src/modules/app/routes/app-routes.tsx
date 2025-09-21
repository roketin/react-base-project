// app-routes.ts
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import AppGlobalError from '@/modules/app/components/pages/app-global-error';
import AppEntryPoint from '@/modules/app/components/pages/app-entry-point';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import AppLayout from '@/modules/app/components/layouts/app-layout';
import AuthProtectedRoute from '@/modules/auth/hoc/auth-protected-route';
import { homeRoutes } from '@/modules/home/routes/home.routes';
import { Outlet } from 'react-router-dom';
import { authRoutes } from '@/modules/auth/routes/auth.routes';

export const routes = createAppRoutes([
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
        children: [...homeRoutes],
      },
      { path: '*', element: <AppNotFound /> },
    ],
  },
]);

import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { lazy } from 'react';

const Home = lazy(() => import('@/modules/home/components/home'));

export const homeRoutes = createAppRoutes([
  { path: '', element: <Home />, name: 'DashboardIndex' },
]);

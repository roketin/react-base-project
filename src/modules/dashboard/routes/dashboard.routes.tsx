import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { lazy } from 'react';

const Dashboard = lazy(
  () => import('@/modules/dashboard/components/pages/dashboard'),
);

export const dashboardRoutes = createAppRoutes([
  {
    name: 'DashboardIndex',
    index: true,
    element: <Dashboard />,
    handle: {
      title: 'dashboard:title',
    },
  },
]);

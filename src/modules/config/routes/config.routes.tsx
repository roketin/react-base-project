import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { Outlet } from 'react-router-dom';
import { userChildRoutes } from '../modules/user/routes/user.routes.child';
import { roleChildRoutes } from '../modules/role/routes/role.routes.child';

export const configRoutes = createAppRoutes([
  {
    path: 'config', // Standalone route path uses the full segment path for flat registration: "config".
    element: <Outlet />,
    handle: {
      breadcrumb: 'Config',
      breadcrumbOptions: {
        disabled: true,
      },
    },
    children: [
      ...userChildRoutes,
      ...roleChildRoutes,
      // Add other child routes here if needed
    ],
  },
]);

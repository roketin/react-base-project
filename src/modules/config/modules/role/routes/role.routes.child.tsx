import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import RoleIndex from '../components/pages/role';
import { Outlet } from 'react-router-dom';

// This is a CHILD ROUTE.
// The generator tries to link it into the parent route automatically.
// Please double-check ../../config/routes/config.routes.tsx if the parent structure is customized.

export const roleChildRoutes = createAppRoutes([
  {
    path: 'role', // Child route path uses only the segment name, as it is nested within a parent route.
    element: <Outlet />,
    handle: {
      breadcrumb: 'Role',
      breadcrumbOptions: {
        disabled: false,
      },
    },
    children: [
      {
        index: true,
        name: 'RoleIndex',
        element: <RoleIndex />,
      },
      // Add other child routes here if needed
    ],
  },
]);

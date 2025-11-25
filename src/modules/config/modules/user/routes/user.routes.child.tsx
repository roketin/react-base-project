import { Outlet } from 'react-router-dom';
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import UserIndex from '../components/pages/user';
import UserAdd from '../components/pages/user-add';

export const userChildRoutes = createAppRoutes([
  {
    path: 'user', // Child route path uses only the segment name, as it is nested within a parent route.
    element: <Outlet />,
    handle: {
      breadcrumb: 'User',
      breadcrumbOptions: {
        disabled: false,
      },
      featureFlag: 'CONFIG_USER',
    },
    children: [
      {
        index: true,
        name: 'UserIndex',
        element: <UserIndex />,
      },
      {
        name: 'UserAdd',
        path: 'add',
        element: <UserAdd />,
        handle: {
          breadcrumb: 'Create',
        },
      },
    ],
  },
]);

import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const SampleForm = lazy(
  () => import('@/modules/sample-form/components/pages/sample-form'),
);

const SampleFormSave = lazy(
  () => import('@/modules/sample-form/components/pages/sample-form-save'),
);

export const sampleFormRoutes = createAppRoutes([
  {
    path: 'sample-form',
    element: <Outlet />,
    handle: {
      breadcrumb: 'Sample List',
    },
    children: [
      {
        name: 'SampleFormIndex',
        index: true,
        element: <SampleForm />,
      },
      {
        name: 'SampleFormAdd',
        path: 'add',
        element: <SampleFormSave />,
        handle: {
          breadcrumb: 'Add Todo',
        },
      },
      {
        name: 'SampleFormEdit',
        path: ':id/edit',
        element: <SampleFormSave />,
        handle: {
          breadcrumb: 'Edit Todo',
        },
      },
      {
        name: 'SampleFormDetail',
        path: ':id/detail',
        element: <SampleFormSave />,
        handle: {
          breadcrumb: 'Detail Todo',
        },
      },
    ],
  },
]);

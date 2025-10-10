import { PERMISSIONS } from '@/modules/app/constants/permission.constant';
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
      breadcrumb: 'sampleForm:title',
      permissions: [PERMISSIONS.SAMPLE_FORM_VIEW],
    },
    children: [
      {
        name: 'SampleFormIndex',
        index: true,
        element: <SampleForm />,
        handle: {
          title: 'sampleForm:menu.allEntries',
        },
      },
      {
        name: 'SampleFormAdd',
        path: 'add',
        element: <SampleFormSave />,
        handle: {
          title: 'sampleForm:menu.createNew',
          breadcrumb: 'sampleForm:menu.createNew',
        },
      },
      {
        name: 'SampleFormEdit',
        path: ':id/edit',
        element: <SampleFormSave />,
        handle: {},
      },
      {
        name: 'SampleFormDetail',
        path: ':id/detail',
        element: <SampleFormSave />,
        handle: {},
      },
    ],
  },
]);

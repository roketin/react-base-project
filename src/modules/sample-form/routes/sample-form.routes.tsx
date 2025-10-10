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
      breadcrumb: 'app:menu.sampleForm',
      permissions: [PERMISSIONS.SAMPLE_FORM_VIEW],
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
          breadcrumb: 'sampleForm:breadcrumbs.add',
        },
      },
      {
        name: 'SampleFormEdit',
        path: ':id/edit',
        element: <SampleFormSave />,
        handle: {
          breadcrumb: 'sampleForm:breadcrumbs.edit',
        },
      },
      {
        name: 'SampleFormDetail',
        path: ':id/detail',
        element: <SampleFormSave />,
        handle: {
          breadcrumb: 'sampleForm:breadcrumbs.detail',
        },
      },
    ],
  },
]);

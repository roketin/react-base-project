import { PERMISSIONS } from '@/modules/app/constants/permission.constant';
import {
  House,
  ListCheck,
  PlusCircle,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import type { TPermission } from '@/modules/app/constants/permission.constant';

export type TMenu = {
  title: string;
  icon?: LucideIcon;
  name?: string;
  permission?: TPermission | TPermission[];
  children?: TMenu[];
};

export const APP_MENUS: TMenu[] = [
  {
    title: 'Dashboard',
    icon: House,
    name: 'DashboardIndex',
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: 'Sample Form',
    icon: ListCheck,
    name: '',
    permission: PERMISSIONS.SAMPLE_FORM_VIEW,
    children: [
      {
        title: 'All Entries',
        name: 'SampleFormIndex',
        icon: Table2,
        permission: PERMISSIONS.SAMPLE_FORM_VIEW,
      },
      {
        title: 'Create New',
        icon: PlusCircle,
        name: 'SampleFormAdd',
        permission: PERMISSIONS.SAMPLE_FORM_CREATE,
      },
    ],
  },
];

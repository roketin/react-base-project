import {
  House,
  ListCheck,
  PlusCircle,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import { PERMISSIONS } from '@/modules/app/constants/permission.constant';
import type { TPermission } from '@/modules/app/constants/permission.constant';

export type TSidebarMenu = {
  title: string;
  translationKey?: string;
  icon?: LucideIcon;
  name?: string;
  permission?: TPermission | TPermission[];
  children?: TSidebarMenu[];
};

export const APP_SIDEBAR_MENUS: TSidebarMenu[] = [
  {
    title: 'Dashboard',
    translationKey: 'menu.dashboard',
    icon: House,
    name: 'DashboardIndex',
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: 'Sample Form',
    translationKey: 'menu.sampleForm',
    icon: ListCheck,
    name: '',
    permission: PERMISSIONS.SAMPLE_FORM_VIEW,
    children: [
      {
        title: 'All Entries',
        translationKey: 'menu.sampleFormAllEntries',
        name: 'SampleFormIndex',
        icon: Table2,
        permission: PERMISSIONS.SAMPLE_FORM_VIEW,
      },
      {
        title: 'Create New',
        translationKey: 'menu.sampleFormCreateNew',
        icon: PlusCircle,
        name: 'SampleFormAdd',
        permission: PERMISSIONS.SAMPLE_FORM_CREATE,
      },
    ],
  },
];

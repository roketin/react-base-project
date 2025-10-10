import {
  House,
  ListCheck,
  PlusCircle,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import { PERMISSIONS } from '@/modules/app/constants/permission.constant';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import type { TLocale } from '@/modules/app/types/locale.type';

export type TSidebarMenu = {
  title: TLocale;
  icon?: LucideIcon;
  name?: string;
  permission?: TPermission | TPermission[];
  children?: TSidebarMenu[];
};

export const APP_SIDEBAR_MENUS: TSidebarMenu[] = [
  {
    title: 'dashboard:title',
    icon: House,
    name: 'DashboardIndex',
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: 'sampleForm:title',
    icon: ListCheck,
    name: '',
    permission: PERMISSIONS.SAMPLE_FORM_VIEW,
    children: [
      {
        title: 'sampleForm:menu.allEntries',
        name: 'SampleFormIndex',
        icon: Table2,
        permission: PERMISSIONS.SAMPLE_FORM_VIEW,
      },
      {
        title: 'sampleForm:menu.createNew',
        icon: PlusCircle,
        name: 'SampleFormAdd',
        permission: PERMISSIONS.SAMPLE_FORM_CREATE,
      },
    ],
  },
];

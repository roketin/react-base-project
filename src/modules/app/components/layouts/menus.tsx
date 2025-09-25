import { House, ListCheck, type LucideIcon } from 'lucide-react';

export type TMenu = {
  title: string;
  icon?: LucideIcon;
  name: string;
  children?: TMenu[];
};

export const APP_MENUS: TMenu[] = [
  {
    title: 'Dashboard',
    icon: House,
    name: 'DashboardIndex',
  },
  {
    title: 'Sample Form',
    icon: ListCheck,
    name: 'SampleFormIndex',
  },
];

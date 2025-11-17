import type { LucideIcon } from 'lucide-react';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import type { TLocale } from '@/modules/app/types/locale.type';

export type TSidebarMenu = {
  title: TLocale;
  icon?: LucideIcon;
  name?: string;
  permission?: TPermission | TPermission[];
  order?: number;
  children?: TSidebarMenu[];
};

import { House } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const dashboardModuleConfig = defineModuleConfig({
  moduleId: 'dashboard',
  featureFlag: 'DASHBOARD',
  menu: {
    title: 'dashboard:title',
    icon: House,
    name: 'DashboardIndex',
    permission: 'DASHBOARD_VIEW',
    order: -9999,
  },
});

export default dashboardModuleConfig;

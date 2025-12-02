import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const UserModuleConfig = defineModuleConfig({
  moduleId: 'config-user',
  parentModuleId: 'config',
  featureFlag: 'CONFIG_USER',
  menu: {
    title: 'user:title',
    name: 'UserIndex',
    order: 2,
    // icon: SomeIcon,
    // permission: 'PERMISSION_KEY',
  },
  // Actions moved to user.config.search.ts (create if needed)
});

export default UserModuleConfig;

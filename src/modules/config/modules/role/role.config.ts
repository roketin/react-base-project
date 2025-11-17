import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const RoleModuleConfig = defineModuleConfig({
  moduleId: 'config-role',
  parentModuleId: 'config',
  featureFlag: 'CONFIG_ROLE',
  menu: {
    title: 'role:title',
    name: 'RoleIndex',
    order: 3,
    // icon: SomeIcon,
    // permission: 'PERMISSION_KEY',
  },
});

export default RoleModuleConfig;

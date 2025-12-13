import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { Cog } from 'lucide-react';

export const ConfigModuleConfig = defineModuleConfig({
  moduleId: 'config',
  featureFlag: 'CONFIG',
  // NOTE: Update translations, icon, permissions, and route names to fit your module.
  // Set menu to false if this module should stay hidden in the sidebar.
  menu: {
    title: 'Config',
    name: 'ConfigIndex',
    icon: Cog,
    // permission: 'PERMISSION_KEY',
  },
});

export default ConfigModuleConfig;

import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { Plus, Search } from 'lucide-react';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { navigateToRoute } from '@/modules/app/libs/navigation-helper';
import {
  KEYWORDS_CREATE,
  KEYWORDS_SEARCH,
} from '@/modules/app/constants/search-keywords.constant';

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
  actions: [
    {
      id: 'create-role',
      routeName: 'RoleAdd',
      titleKey: 'role:menu.createNew',
      badge: 'Create',
      icon: Plus,
      // permission: 'ROLE_CREATE',
      keywords: [...KEYWORDS_CREATE, 'role'],
    },
    {
      id: 'search-role',
      titleKey: 'role:commands.search',
      badge: 'Search',
      icon: Search,
      // permission: 'ROLE_VIEW',
      keywords: [...KEYWORDS_SEARCH, 'role'],
      onExecute: () => {
        const query = useGlobalSearchStore.getState().currentQuery;
        navigateToRoute('RoleIndex', { keyword: query });
      },
    },
  ],
});

export default RoleModuleConfig;

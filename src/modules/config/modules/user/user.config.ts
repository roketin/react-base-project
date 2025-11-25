import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { Plus, Search } from 'lucide-react';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { navigateToRoute } from '@/modules/app/libs/navigation-helper';
import {
  KEYWORDS_CREATE,
  KEYWORDS_SEARCH,
} from '@/modules/app/constants/search-keywords.constant';

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
  actions: [
    {
      id: 'create-user',
      routeName: 'UserAdd',
      titleKey: 'user:menu.createNew',
      badge: 'Create',
      icon: Plus,
      // permission: 'USER_CREATE',
      keywords: [...KEYWORDS_CREATE, 'user'],
    },
    {
      id: 'search-user',
      titleKey: 'user:commands.search',
      badge: 'Search',
      icon: Search,
      // permission: 'USER_VIEW',
      keywords: [...KEYWORDS_SEARCH, 'user'],
      onExecute: () => {
        const query = useGlobalSearchStore.getState().currentQuery;
        navigateToRoute('UserIndex', { keyword: query });
      },
    },
  ],
});

export default UserModuleConfig;

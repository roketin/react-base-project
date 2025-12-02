import { Plus, Search, Users } from 'lucide-react';
import type { TAdaptiveSearchConfig } from '@/modules/adaptive-search/types/adaptive-search.type';

/**
 * Adaptive Search Configuration for User Module
 */
export default {
  actions: [
    {
      id: 'search-user',
      moduleId: 'user',
      titleKey: 'Search User',
      badge: 'Search',
      icon: Search,
      keywords: ['search', 'cari', 'temukan', 'user', 'pengguna'],
      actionType: 'navigate-with-query',
      actionPayload: {
        routeName: 'UserIndex',
        queryParamKey: 'search',
      },
    },
    {
      id: 'create-user',
      moduleId: 'user',
      titleKey: 'Create User',
      badge: 'Create',
      icon: Plus,
      keywords: ['create', 'tambah', 'buat', 'user', 'pengguna'],
      actionType: 'navigate',
      actionPayload: {
        routeName: 'UserAdd',
      },
    },
    {
      id: 'list-user',
      moduleId: 'user',
      titleKey: 'User Management',
      badge: 'Menu',
      icon: Users,
      keywords: ['user', 'pengguna', 'management', 'kelola'],
      actionType: 'navigate',
      actionPayload: {
        routeName: 'UserIndex',
      },
    },
  ],
} satisfies TAdaptiveSearchConfig;

import { Plus, Search, Shield } from 'lucide-react';
import type { TAdaptiveSearchConfig } from '@/modules/adaptive-search/types/adaptive-search.type';

/**
 * Adaptive Search Configuration for Role Module
 */
export default {
  actions: [
    {
      id: 'search-role',
      moduleId: 'role',
      titleKey: 'Search Role',
      badge: 'Search',
      icon: Search,
      keywords: ['search', 'cari', 'temukan', 'role', 'peran', 'hak akses'],
      actionType: 'navigate-with-query',
      actionPayload: {
        routeName: 'RoleIndex',
        queryParamKey: 'search',
      },
    },
    {
      id: 'create-role',
      moduleId: 'role',
      titleKey: 'Create Role',
      badge: 'Create',
      icon: Plus,
      keywords: ['create', 'tambah', 'buat', 'role', 'peran'],
      actionType: 'navigate',
      actionPayload: {
        routeName: 'RoleAdd',
      },
    },
    {
      id: 'list-role',
      moduleId: 'role',
      titleKey: 'Role Management',
      badge: 'Menu',
      icon: Shield,
      keywords: [
        'role',
        'peran',
        'management',
        'kelola',
        'permission',
        'hak akses',
      ],
      actionType: 'navigate',
      actionPayload: {
        routeName: 'RoleIndex',
      },
    },
  ],
} satisfies TAdaptiveSearchConfig;

import { Plus, Search, FileText, Edit, Eye, Trash } from 'lucide-react';
import type { TAdaptiveSearchConfig } from '@/modules/adaptive-search/types/adaptive-search.type';

/**
 * Adaptive Search Configuration for Sample Form Module
 *
 * This config defines:
 * 1. Static actions (Create, Search, etc.)
 * 2. API mapping for dynamic data (FAC-001, TRX-002, etc.)
 */
export default {
  // ========================================
  // Static Actions (Local)
  // ========================================
  actions: [
    {
      id: 'create-sample-form',
      moduleId: 'sample-form',
      titleKey: 'Create Sample Form',
      badge: 'Create',
      icon: Plus,
      permission: 'SAMPLE_FORM_CREATE',
      keywords: ['create', 'tambah', 'buat', 'form', 'sample'],
      actionType: 'navigate',
      actionPayload: {
        routeName: 'SampleFormAdd',
      },
    },
    {
      id: 'search-sample-form',
      moduleId: 'sample-form',
      titleKey: 'Search Sample Form',
      badge: 'Search',
      icon: Search,
      permission: 'SAMPLE_FORM_VIEW',
      keywords: ['search', 'cari', 'temukan', 'form', 'sample'],
      actionType: 'navigate-with-query',
      actionPayload: {
        routeName: 'SampleFormIndex',
        queryParamKey: 'search',
      },
    },
  ],

  // ========================================
  // API Mapping (Dynamic Data)
  // ========================================
  apiMapping: {
    moduleId: 'sample-form',

    /**
     * Module-level permission (fallback if getPermission not defined)
     */
    permission: 'SAMPLE_FORM_VIEW',

    /**
     * Filter: Only process items for this module
     */
    filter: (apiItem) => apiItem.module === 'sample-form',

    /**
     * Transform: Convert API item to SearchableItem
     */
    transform: (apiItem) => ({
      id: `api-${apiItem.module}-${apiItem.id}`,
      type: 'data' as const,
      title: apiItem.label, // e.g., "FAC-001", "TRX-002"
      module: apiItem.module,
      moduleTitle: 'Sample Form', // Will be translated in adapter
      badge: apiItem.action,
      keywords: [apiItem.label, apiItem.action, 'sample', 'form'],
      keywordsText: `${apiItem.label} ${apiItem.action}`,
    }),

    /**
     * Icon mapping based on action type
     */
    getIcon: (apiItem) => {
      const iconMap: Record<string, typeof FileText> = {
        detail: FileText,
        edit: Edit,
        view: Eye,
        delete: Trash,
      };
      return iconMap[apiItem.action] || FileText;
    },

    /**
     * Badge mapping (capitalize action)
     */
    getBadge: (apiItem) => {
      const badgeMap: Record<string, string> = {
        detail: 'Detail',
        edit: 'Edit',
        view: 'View',
        delete: 'Delete',
      };
      return badgeMap[apiItem.action] || apiItem.action;
    },

    /**
     * Keywords for better search
     */
    getKeywords: (apiItem) => [
      apiItem.label,
      apiItem.action,
      'sample',
      'form',
      // Add more contextual keywords if needed
    ],

    /**
     * Permission mapping based on action type
     */
    getPermission: (apiItem) => {
      const permissionMap: Record<
        string,
        'SAMPLE_FORM_VIEW' | 'SAMPLE_FORM_UPDATE'
      > = {
        detail: 'SAMPLE_FORM_VIEW',
        view: 'SAMPLE_FORM_VIEW',
        edit: 'SAMPLE_FORM_UPDATE',
        delete: 'SAMPLE_FORM_UPDATE', // Use UPDATE permission for delete
      };
      return permissionMap[apiItem.action] || 'SAMPLE_FORM_VIEW';
    },

    /**
     * Handle item selection
     */
    onSelect: (apiItem, context) => {
      const { navigateByName } = context;

      switch (apiItem.action) {
        case 'detail':
        case 'view':
          navigateByName('SampleFormDetail', { id: apiItem.id });
          break;

        case 'edit':
          navigateByName('SampleFormEdit', { id: apiItem.id });
          break;

        case 'delete':
          // Open delete confirmation dialog
          if (context.openDialog) {
            context.openDialog('delete-confirmation', { id: apiItem.id });
          } else {
            console.warn('Delete action not supported');
          }
          break;

        default:
          console.warn(`[Sample Form] Unknown action: ${apiItem.action}`);
      }
    },
  },
} satisfies TAdaptiveSearchConfig;

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
  collectSearchActions,
  collectApiMappingConfigs,
} from './action-collector';
import http from '@/plugins/axios';
import type { TApiResponse } from '@/modules/app/types/api.type';
import type {
  TSearchableItem,
  TApiSearchResultItem,
} from '../types/adaptive-search.type';
import type { TPermission } from '@/modules/app/constants/permission.constant';

/**
 * Options for app search adapter
 */
type TUseAppSearchAdapterOptions = {
  query: string; // NOTE: Used when API is enabled
  apiEnabled?: boolean; // NOTE: Enable to fetch from API
};

/**
 * Adapter: Merge local static actions + API dynamic data
 *
 * This adapter:
 * 1. Collects static actions from *.config.search.ts files
 * 2. Fetches dynamic data from API (if enabled)
 * 3. Transforms API data using module-specific mappings
 * 4. Merges and filters by permissions
 *
 * @param options - Configuration options
 * @returns Searchable items with loading state
 */
export function useAppSearchAdapter(options: TUseAppSearchAdapterOptions) {
  const { query, apiEnabled = false } = options;
  const { isCan } = useAuth();

  // 1. Collect static actions from local files and transform to SearchableItem
  const staticActions = useMemo(() => {
    const actions = collectSearchActions();
    const transformed = actions.map(
      (action): TSearchableItem => ({
        id: action.id,
        type: 'action',
        title: action.titleKey, // Now titleKey is plain text
        titleKey: action.titleKey,
        module: action.moduleId,
        moduleTitle: action.moduleId,
        icon: action.icon,
        badge: action.badge,
        keywords: action.keywords,
        keywordsText: action.keywords?.join(' '),
        permission: action.permission,
        path: action.routeName ?? undefined,
        actionType: action.actionType,
        actionPayload: action.actionPayload,
      }),
    );
    return transformed;
  }, []);

  // 2. Get API mapping configs

  const apiMappings = useMemo(() => {
    return collectApiMappingConfigs();
  }, []);

  // 3. Fetch dynamic data from API (using @tanstack/react-query directly)
  const {
    data: apiData,
    isLoading: isLoadingApi,
    error: apiError,
  } = useQuery<TApiResponse<TApiSearchResultItem[]>>({
    queryKey: ['adaptive-search', query],
    queryFn: async () => {
      const resp = await http.get<TApiResponse<TApiSearchResultItem[]>>(
        '/v1/search',
        {
          params: { q: query },
        },
      );
      return resp.data;
    },
    enabled: apiEnabled && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });

  // 4. Transform API data using module mappings
  const dynamicItems = useMemo(() => {
    if (!apiData?.data) return [];

    const items: TSearchableItem[] = [];

    for (const apiItem of apiData.data) {
      // Find matching mapping config
      const mapping = apiMappings.find((m) =>
        m.filter ? m.filter(apiItem) : m.moduleId === apiItem.module,
      );

      if (mapping) {
        try {
          // Transform using module's mapping
          const transformed = mapping.transform(apiItem);

          // Enhance with mapping functions
          if (mapping.getIcon) {
            transformed.icon = mapping.getIcon(apiItem);
          }
          if (mapping.getBadge) {
            transformed.badge = mapping.getBadge(apiItem);
          }
          if (mapping.getKeywords) {
            transformed.keywords = mapping.getKeywords(apiItem);
            transformed.keywordsText = mapping.getKeywords(apiItem).join(' ');
          }

          // Set permission from mapping (item-specific or module-level)
          if (mapping.getPermission) {
            transformed.permission = mapping.getPermission(apiItem);
          } else if (mapping.permission) {
            transformed.permission = mapping.permission;
          }

          // Store original data for onSelect
          transformed._raw = apiItem;

          items.push(transformed);
        } catch (error) {
          console.error(
            `[Adaptive Search] Failed to transform API item:`,
            apiItem,
            error,
          );
        }
      } else {
        // Fallback: create default item for modules without specific mapping
        const defaultItem: TSearchableItem = {
          id: `api-${apiItem.module}-${apiItem.id}`,
          type: 'data',
          title: apiItem.label,
          module: apiItem.module,
          moduleTitle:
            apiItem.module.charAt(0).toUpperCase() +
            apiItem.module.slice(1).replace(/-/g, ' '),
          badge:
            apiItem.action.charAt(0).toUpperCase() + apiItem.action.slice(1),
          keywords: [apiItem.label, apiItem.action, apiItem.module],
          keywordsText: `${apiItem.label} ${apiItem.action} ${apiItem.module}`,
          _raw: apiItem,
        };
        items.push(defaultItem);
      }
    }

    return items;
  }, [apiData, apiMappings]);

  // 5. Merge static + dynamic items, dedupe by id, and filter by permission
  const items = useMemo(() => {
    const merged = [...staticActions, ...dynamicItems];

    // Dedupe by id - static actions take priority
    const seen = new Set<string>();
    const deduped = merged.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // Filter by permission
    const filtered = deduped.filter((item) => {
      // If no permission required, allow access
      if (!item.permission) return true;

      // Check permission using isCan
      return isCan(item.permission as TPermission | TPermission[]);
    });

    return filtered;
  }, [staticActions, dynamicItems, isCan]);

  // Log API errors
  if (apiError) {
    console.error('[Adaptive Search] API error:', apiError);
  }

  return {
    items,
    isLoading: isLoadingApi,
    error: apiError,
  };
}

import { useMemo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { APP_SIDEBAR_MENUS } from '@/modules/app/libs/sidebar-menu.lib';
import { APP_MODULE_CONFIGS } from '@/modules/app/libs/module-config.lib';
import { nameToPath } from '@/modules/app/hooks/use-named-route';
import { generateSearchActions } from '@/modules/app/libs/search-actions.lib';
import type {
  SearchableMenuItem,
  SearchableItem,
  ModuleOption,
} from '@/modules/app/types/global-search.type';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';
import { useTranslation } from 'react-i18next';

/**
 * Recursively flatten sidebar menus into searchable items
 */
function flattenMenus(
  menus: TSidebarMenu[],
  moduleMap: Map<string, { id: string; title: string }>,
  getTitle: (menu: TSidebarMenu) => string,
  currentModule: { id: string; title: string } | null = null,
  parentPath: string[] = [],
): SearchableMenuItem[] {
  const items: SearchableMenuItem[] = [];

  for (const menu of menus) {
    const title = getTitle(menu);
    const currentPath = [...parentPath, title];

    // Determine module for this menu item
    let menuModule = currentModule;
    if (!menuModule) {
      // Try to find module from menu name
      for (const [id, info] of moduleMap.entries()) {
        if (menu.name && menu.name.toLowerCase().includes(id.toLowerCase())) {
          menuModule = info;
          break;
        }
      }
      // Fallback to 'app' module
      if (!menuModule) {
        menuModule = { id: 'app', title: 'App' };
      }
    }

    // Only add if menu has a route name
    if (menu.name) {
      try {
        const path = nameToPath(menu.name);

        items.push({
          type: 'menu',
          id: menu.name,
          title,
          path,
          module: menuModule.id,
          moduleTitle: menuModule.title,
          icon: menu.icon,
          keywords: currentPath,
          keywordsText: currentPath.join(' '), // Join keywords for better search
          permission: menu.permission,
        });
      } catch {
        // Skip if route name cannot be resolved
      }
    }

    // Recursively process children with same module context
    if (menu.children && menu.children.length > 0) {
      items.push(
        ...flattenMenus(
          menu.children,
          moduleMap,
          getTitle,
          menuModule,
          currentPath,
        ),
      );
    }
  }

  return items;
}

/**
 * Hook to get all searchable items from sidebar menus and actions
 */
export function useSearchableItems() {
  const { isCan } = useAuth();
  const { t } = useTranslation();

  const items = useMemo(() => {
    // Build module map for quick lookup
    const moduleMap = new Map<string, { id: string; title: string }>();
    for (const config of APP_MODULE_CONFIGS) {
      const menus = Array.isArray(config.menu)
        ? config.menu
        : config.menu
          ? [config.menu]
          : [];
      if (menus.length > 0 && menus[0].title) {
        moduleMap.set(config.moduleId, {
          id: config.moduleId,
          title: String(t(menus[0].title as never)),
        });
      }
    }

    // Flatten all menus
    const getTitle = (menu: TSidebarMenu) => String(t(menu.title as never));
    const menuItems = flattenMenus(APP_SIDEBAR_MENUS, moduleMap, getTitle);

    // Generate action items (includes both navigation and command actions)
    const actionItems = generateSearchActions((key: string) =>
      String(t(key as never)),
    );

    // Combine menu items and action items
    const allItems: SearchableItem[] = [...menuItems, ...actionItems];

    // Filter by permission
    return allItems.filter((item) => {
      if (!item.permission) return true;

      const permissions = Array.isArray(item.permission)
        ? item.permission
        : [item.permission];

      return permissions.some((p) => isCan(p));
    });
  }, [isCan, t]);

  return items;
}

/**
 * Hook to get module options for filter dropdown
 */
export function useModuleOptions(): ModuleOption[] {
  const items = useSearchableItems();
  const { t } = useTranslation();

  return useMemo(() => {
    const moduleSet = new Map<string, string>();

    for (const item of items) {
      if (!moduleSet.has(item.module)) {
        moduleSet.set(item.module, item.moduleTitle);
      }
    }

    const options: ModuleOption[] = [
      { value: 'all', label: t('search.allModules') },
    ];

    for (const [value, label] of moduleSet.entries()) {
      options.push({ value, label });
    }

    return options;
  }, [items, t]);
}

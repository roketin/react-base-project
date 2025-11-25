import type { SearchableActionItem } from '@/modules/app/types/global-search.type';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import { APP_MODULE_CONFIGS } from '@/modules/app/libs/module-config.lib';
import { nameToPath } from '@/modules/app/hooks/use-named-route';

/**
 * Generate searchable action items from module configs
 * Actions are now defined in each module's config file
 * Supports both navigation (routeName) and custom execution (onExecute)
 */
export function generateSearchActions(
  t: (key: string) => string,
): SearchableActionItem[] {
  const actions: SearchableActionItem[] = [];

  // Build module map
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
        title: t(String(menus[0].title)),
      });
    }
  }

  // Generate actions from each module config
  for (const config of APP_MODULE_CONFIGS) {
    const moduleInfo = moduleMap.get(config.moduleId) || {
      id: config.moduleId,
      title: config.moduleId.charAt(0).toUpperCase() + config.moduleId.slice(1),
    };

    // Process both actions and commands (commands is deprecated)
    const allActions = [...(config.actions || []), ...(config.commands || [])];

    if (allActions.length === 0) {
      continue;
    }

    for (const actionDef of allActions) {
      const title = t(actionDef.titleKey);
      const keywords = actionDef.keywords || [];

      // If has routeName, it's a navigation action
      if (actionDef.routeName) {
        try {
          const path = nameToPath(actionDef.routeName);
          const url = actionDef.queryParams
            ? `${path}?${new URLSearchParams(actionDef.queryParams).toString()}`
            : path;

          actions.push({
            type: 'action',
            id: `action-${config.moduleId}-${actionDef.id}`,
            title,
            path: url,
            module: moduleInfo.id,
            moduleTitle: moduleInfo.title,
            icon: actionDef.icon,
            keywords,
            keywordsText: keywords.join(' '),
            permission: actionDef.permission as TPermission | undefined,
            badge: actionDef.badge,
          });
        } catch {
          // Skip if route cannot be resolved
        }
      }
      // If has onExecute, it's a command action
      else if (actionDef.onExecute) {
        actions.push({
          type: 'action',
          id: `action-${config.moduleId}-${actionDef.id}`,
          title,
          module: moduleInfo.id,
          moduleTitle: moduleInfo.title,
          icon: actionDef.icon,
          keywords,
          keywordsText: keywords.join(' '),
          permission: actionDef.permission as TPermission | undefined,
          badge: actionDef.badge,
          onExecute: actionDef.onExecute,
        });
      }
    }
  }

  return actions;
}

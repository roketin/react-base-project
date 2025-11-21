import { APP_MODULE_CONFIGS } from '@/modules/app/libs/module-config.lib';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';

type ModuleMenuEntry = {
  moduleId: string;
  parentModuleId?: string;
  menus: TSidebarMenu[];
  addedToRoot?: boolean;
};

function toArray(menu?: TSidebarMenu | TSidebarMenu[] | false): TSidebarMenu[] {
  if (!menu) return [];
  return Array.isArray(menu) ? menu : [menu];
}

function cloneMenus(menus: TSidebarMenu[]): TSidebarMenu[] {
  return menus.map((menu) => ({
    ...menu,
    children: menu.children ? cloneMenus(menu.children) : undefined,
  }));
}

function buildModuleMenuEntries(): ModuleMenuEntry[] {
  return APP_MODULE_CONFIGS.map((config) => ({
    moduleId: config.moduleId,
    parentModuleId: config.parentModuleId,
    menus: cloneMenus(toArray(config.menu)),
  }));
}

function buildSidebarMenus(entries: ModuleMenuEntry[]): TSidebarMenu[] {
  const entryMap = new Map(
    entries.map((entry) => [entry.moduleId, { ...entry }]),
  );
  const resolving = new Set<string>();
  const resolved = new Set<string>();
  const rootMenus: TSidebarMenu[] = [];

  const ensureRoot = (entry: ModuleMenuEntry) => {
    if (entry.addedToRoot || entry.menus.length === 0) {
      return;
    }
    rootMenus.push(...entry.menus);
    entry.addedToRoot = true;
  };

  const processEntry = (entry: ModuleMenuEntry | undefined) => {
    if (!entry || resolved.has(entry.moduleId)) {
      return;
    }

    if (resolving.has(entry.moduleId)) {
      ensureRoot(entry);
      resolved.add(entry.moduleId);
      return;
    }

    resolving.add(entry.moduleId);

    if (!entry.parentModuleId) {
      ensureRoot(entry);
    } else {
      const parentEntry = entryMap.get(entry.parentModuleId);
      if (!parentEntry || parentEntry.menus.length === 0) {
        // Strict mode: child menus are hidden when parent is missing or has no menu entries.
        resolving.delete(entry.moduleId);
        resolved.add(entry.moduleId);
        return;
      }

      processEntry(parentEntry);
      const parentMenu = parentEntry.menus[0];
      if (parentMenu) {
        parentMenu.children = parentMenu.children
          ? [...parentMenu.children, ...entry.menus]
          : [...entry.menus];
      }
    }

    resolving.delete(entry.moduleId);
    resolved.add(entry.moduleId);
  };

  entryMap.forEach((entry) => processEntry(entry));

  return pruneEmptyMenus(rootMenus);
}

function pruneEmptyMenus(menus: TSidebarMenu[]): TSidebarMenu[] {
  const withMeta = menus
    .map((menu, index) => {
      const children = menu.children
        ? pruneEmptyMenus(menu.children)
        : undefined;
      const hasChildren = Boolean(children && children.length > 0);
      const hasRoute = Boolean(menu.name);

      if (!hasChildren && !hasRoute) {
        return null;
      }

      return {
        menu: {
          ...menu,
          children,
        },
        index,
      };
    })
    .filter(
      (item): item is { menu: TSidebarMenu; index: number } => item !== null,
    );

  withMeta.sort((a, b) => {
    const orderA =
      typeof a.menu.order === 'number' ? a.menu.order : Number.MAX_SAFE_INTEGER;
    const orderB =
      typeof b.menu.order === 'number' ? b.menu.order : Number.MAX_SAFE_INTEGER;
    if (orderA === orderB) {
      return a.index - b.index;
    }
    return orderA - orderB;
  });

  return withMeta.map((item) => item.menu);
}

/**
 * Sidebar menus derived automatically from every module's configuration file.
 * Each module can contribute menus (or opt out by returning false/undefined).
 * When `parentModuleId` is provided, the module's menus become children of the parent menu.
 * Child menus are hidden automatically when their parent is disabled or missing.
 */
export const APP_SIDEBAR_MENUS: TSidebarMenu[] = buildSidebarMenus(
  buildModuleMenuEntries(),
);

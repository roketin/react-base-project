import { useAuth } from '@/modules/auth/hooks/use-auth';
import AppSidebarHeader from '@/modules/app/components/layouts/app-sidebar-header';
import {
  APP_SIDEBAR_MENUS,
  type TSidebarMenu,
} from '@/modules/app/constants/sidebar-menu.constant';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/modules/app/components/ui/sidebar';
import { nameToPath } from '@/modules/app/hooks/use-named-route';
import { cn } from '@/modules/app/libs/utils';
import { ChevronDown, Dot } from 'lucide-react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SidebarMenuItemWithChildren = TSidebarMenu & {
  children?: SidebarMenuItemWithChildren[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isCan } = useAuth();
  const location = useLocation();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const { t } = useTranslation('app');

  const getMenuTitle = useCallback(
    (menu: TSidebarMenu | SidebarMenuItemWithChildren) => {
      if (menu.title) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(menu.title as any);
      }
      return menu.title;
    },
    [t],
  );

  const accessibleMenus = useMemo(() => {
    const filter = (
      menus: ReadonlyArray<TSidebarMenu>,
    ): SidebarMenuItemWithChildren[] => {
      return menus.reduce<SidebarMenuItemWithChildren[]>((acc, item) => {
        const hasPermission = !item.permission || isCan(item.permission);
        if (!hasPermission) return acc;

        const children = item.children ? filter(item.children) : undefined;

        acc.push({ ...item, children });
        return acc;
      }, []);
    };

    return filter(APP_SIDEBAR_MENUS);
  }, [isCan]);

  const getMenuPath = (menu: TSidebarMenu) => {
    if (!menu.name) return undefined;
    try {
      return nameToPath(menu.name);
    } catch {
      return undefined;
    }
  };

  const isRouteActive = useCallback(
    (menu: TSidebarMenu, end = false) => {
      const pattern = getMenuPath(menu);
      if (!pattern) return false;
      const exactMatch = matchPath({ path: pattern, end }, location.pathname);
      if (exactMatch) return true;
      if (end) return false;
      return Boolean(
        matchPath({ path: `${pattern}/*`, end: false }, location.pathname),
      );
    },
    [location.pathname],
  );

  const isMenuActive = useCallback(
    (menu: SidebarMenuItemWithChildren): boolean => {
      if (menu.children && menu.children.length > 0) {
        if (isRouteActive(menu)) return true;
        return menu.children.some(isMenuActive);
      }

      return isRouteActive(menu, true);
    },
    [isRouteActive],
  );

  useEffect(() => {
    const activeKeys = new Set<string>();
    const collectActive = (menus: SidebarMenuItemWithChildren[]) => {
      for (const menu of menus) {
        const key = menu.name ?? menu.title;
        if ((menu.children && menu.children.length > 0) || !key) {
          if (isMenuActive(menu) && key) {
            activeKeys.add(key);
          }
          if (menu.children) {
            collectActive(menu.children);
          }
        }
      }
    };
    collectActive(accessibleMenus);

    setOpenMap((prev) => {
      const next: Record<string, boolean> = {};
      activeKeys.forEach((key) => {
        next[key] = true;
      });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);

      if (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => next[key] === prev[key])
      ) {
        return prev;
      }

      return next;
    });
  }, [accessibleMenus, isMenuActive, location.pathname]);

  const toggleMenu = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSubMenu = (
    items: SidebarMenuItemWithChildren[],
    depth = 0,
  ): React.ReactNode => {
    return items.map((child) => {
      const childKey = child.name ?? `${child.title}-${depth}`;
      const childPath = getMenuPath(child);
      const hasGrandChildren = Boolean(
        child.children && child.children.length > 0,
      );
      const childActive = isMenuActive(child);
      const expanded = openMap[childKey] ?? childActive;

      if (hasGrandChildren) {
        return (
          <SidebarMenuSubItem key={childKey}>
            <button
              type='button'
              onClick={() => toggleMenu(childKey)}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                childActive &&
                  'bg-sidebar-accent text-sidebar-accent-foreground',
              )}
            >
              <span className='flex items-center gap-2'>
                {child.icon ? (
                  <child.icon className='size-4' />
                ) : (
                  <Dot className='size-4' />
                )}
                {getMenuTitle(child)}
              </span>
              <ChevronDown
                className={cn(
                  'size-3.5 transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </button>
            <SidebarMenuSub
              className={cn(
                'ml-2 border-l border-border/40 pl-2',
                !expanded && 'hidden',
              )}
            >
              {renderSubMenu(child.children!, depth + 1)}
            </SidebarMenuSub>
          </SidebarMenuSubItem>
        );
      }

      if (!childPath) return null;

      return (
        <SidebarMenuSubItem key={childKey}>
          <SidebarMenuSubButton asChild isActive={childActive}>
            <Link to={childPath}>
              {child.icon ? (
                <child.icon className='size-4' />
              ) : (
                <Dot className='size-4' />
              )}
              <span>{getMenuTitle(child)}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    });
  };

  const renderMenu = (menu: SidebarMenuItemWithChildren) => {
    const key = menu.name ?? menu.title;
    const path = getMenuPath(menu);
    const hasChildren = Boolean(menu.children && menu.children.length > 0);
    const childActive = hasChildren ? menu.children!.some(isMenuActive) : false;
    const isActive = hasChildren
      ? childActive || isRouteActive(menu)
      : isRouteActive(menu, true);
    const canNavigate = menu.permission ? isCan(menu.permission) : true;

    return (
      <SidebarMenuItem key={key}>
        {path && canNavigate ? (
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip={getMenuTitle(menu)}
          >
            <Link to={path}>
              {menu.icon && <menu.icon />}
              <span>{getMenuTitle(menu)}</span>
            </Link>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton
            isActive={isActive}
            tooltip={getMenuTitle(menu)}
            aria-disabled={!canNavigate}
            onClick={hasChildren ? () => toggleMenu(key) : undefined}
          >
            {menu.icon && <menu.icon />}
            <span>{getMenuTitle(menu)}</span>
          </SidebarMenuButton>
        )}

        {hasChildren && (
          <>
            <SidebarMenuAction
              aria-label='Toggle submenu'
              onClick={() => toggleMenu(key)}
              className={cn(
                'transition-transform',
                (openMap[key] ?? childActive) && 'rotate-180',
              )}
            >
              <ChevronDown className='size-4' />
            </SidebarMenuAction>
            <SidebarMenuSub
              className={cn(!(openMap[key] ?? childActive) && 'hidden')}
            >
              {renderSubMenu(menu.children!)}
            </SidebarMenuSub>
          </>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{accessibleMenus.map(renderMenu)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

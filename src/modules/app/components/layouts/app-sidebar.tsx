import { useAuth } from '@/modules/auth/hooks/use-auth';
import AppSidebarHeader from '@/modules/app/components/layouts/app-sidebar-header';
import { APP_MENUS, type TMenu } from '@/modules/app/components/layouts/menus';
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

type SidebarMenuItemWithChildren = TMenu & {
  children?: SidebarMenuItemWithChildren[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isCan } = useAuth();
  const location = useLocation();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const accessibleMenus = useMemo(() => {
    const filter = (menus: TMenu[]): SidebarMenuItemWithChildren[] => {
      return menus.reduce<SidebarMenuItemWithChildren[]>((acc, item) => {
        const children = item.children ? filter(item.children) : undefined;
        const hasChildren = Boolean(children && children.length > 0);
        const hasPermission = !item.permission || isCan(item.permission);

        if (!hasPermission && !hasChildren) {
          return acc;
        }

        acc.push({ ...item, children });
        return acc;
      }, []);
    };

    return filter(APP_MENUS);
  }, [isCan]);

  const getMenuPath = (menu: TMenu) => {
    if (!menu.name) return undefined;
    try {
      return nameToPath(menu.name);
    } catch {
      return undefined;
    }
  };

  const isRouteActive = useCallback(
    (menu: TMenu, end = false) => {
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
          if (isMenuActive(menu)) {
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
      const next = { ...prev };
      let changed = false;
      activeKeys.forEach((key) => {
        if (next[key] === undefined) {
          next[key] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [accessibleMenus, isMenuActive]);

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
                {child.title}
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
              <span>{child.title}</span>
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
          <SidebarMenuButton asChild isActive={isActive} tooltip={menu.title}>
            <Link to={path}>
              {menu.icon && <menu.icon />}
              <span>{menu.title}</span>
            </Link>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton
            isActive={isActive}
            tooltip={menu.title}
            aria-disabled={!canNavigate}
            onClick={hasChildren ? () => toggleMenu(key) : undefined}
          >
            {menu.icon && <menu.icon />}
            <span>{menu.title}</span>
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

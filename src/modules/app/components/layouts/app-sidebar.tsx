import { useAuth } from '@/modules/auth/hooks/use-auth';
import { APP_SIDEBAR_MENUS } from '@/modules/app/libs/sidebar-menu.lib';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/modules/app/components/ui/sidebar';
import { useSidebar } from '@/modules/app/contexts/sidebar-context';
import { nameToPath } from '@/modules/app/hooks/use-named-route';
import { cn } from '@/modules/app/libs/utils';
import { ChevronDown, PanelLeft } from 'lucide-react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { AppUserMenu } from './app-layout-user-menu';
import AppSidebarHeader from './app-sidebar-header';

type SidebarMenuItemWithChildren = TSidebarMenu & {
  children?: SidebarMenuItemWithChildren[];
};

// Constants
const MENU_BUTTON_SIZE = 'default' as const;
const CHEVRON_SIZE = 4;
const POPOVER_WIDTH = 'w-64';

// Helper component for menu icon
const MenuIcon = ({
  icon: Icon,
}: {
  icon?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}) => {
  return Icon ? <Icon className='size-5' /> : null;
};

// ============================================================================
// SIDEBAR MENU CONTEXT
// ============================================================================

type SidebarMenuContextValue = {
  openMap: Record<string, boolean>;
  toggleMenu: (key: string) => void;
  isMenuActive: (menu: SidebarMenuItemWithChildren) => boolean;
  getMenuTitle: (menu: SidebarMenuItemWithChildren) => string;
  getMenuPath: (menu: TSidebarMenu) => string | undefined;
  popoverOpenMap: Record<string, boolean>;
  setPopoverOpenMap: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

const SidebarMenuContext = createContext<SidebarMenuContextValue | null>(null);

const useSidebarMenu = () => {
  const context = useContext(SidebarMenuContext);
  if (!context) {
    throw new Error('useSidebarMenu must be used within a SidebarMenuProvider');
  }
  return context;
};

// ============================================================================
// SIDEBAR ITEM COMPONENT (RECURSIVE)
// ============================================================================

const SidebarItem = ({
  item,
  depth = 0,
  subMenu = false,
}: {
  item: SidebarMenuItemWithChildren;
  depth?: number;
  subMenu?: boolean;
}) => {
  const { isCollapsed } = useSidebar();
  const {
    openMap,
    toggleMenu,
    isMenuActive,
    getMenuTitle,
    getMenuPath,
    popoverOpenMap,
    setPopoverOpenMap,
  } = useSidebarMenu();

  const key = item.name ?? item.title;
  const path = getMenuPath(item);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive = isMenuActive(item);
  const expanded = hasChildren && (openMap[key] || isActive);
  const isPopoverOpen = popoverOpenMap[key] || false;
  const ItemWrapper = depth > 0 ? SidebarMenuSubItem : SidebarMenuItem;

  // 1. Collapsed Mode with Popover (Only for top-level items with children)
  if (isCollapsed && hasChildren && depth === 0) {
    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          setPopoverOpenMap((prev) => ({ ...prev, [key]: open }));
        }}
      >
        <PopoverTrigger asChild>
          <ItemWrapper>
            <SidebarMenuButton isActive={isActive} tooltip={getMenuTitle(item)}>
              <MenuIcon icon={item.icon} />
              <span>{getMenuTitle(item)}</span>
            </SidebarMenuButton>
          </ItemWrapper>
        </PopoverTrigger>
        <PopoverContent
          side='right'
          align='start'
          className={`${POPOVER_WIDTH} p-2`}
        >
          <SidebarMenu className='space-y-1'>
            <li className='px-2 py-1.5 text-sm font-semibold list-none'>
              {getMenuTitle(item)}
            </li>
            {item.children!.map((child) => (
              <SidebarItem
                key={child.name ?? child.title}
                item={child}
                depth={depth + 1}
                subMenu
              />
            ))}
          </SidebarMenu>
        </PopoverContent>
      </Popover>
    );
  }

  // 2. Leaf Node (Link)
  if (!hasChildren) {
    if (!path) return null;

    // Use SidebarMenuButton for both top-level and sub-items
    // For sub-items (depth > 0), use 'sub' size or adjust styling
    const isSubItem = depth > 0;

    return (
      <ItemWrapper>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          size={isSubItem ? 'sub' : MENU_BUTTON_SIZE}
          tooltip={depth === 0 ? getMenuTitle(item) : undefined}
          className={cn(subMenu && 'justify-start', isSubItem && 'h-8 px-2')} // Ensure height matches sub variant
        >
          <Link
            to={path}
            onClick={() => {
              // Close popover if inside one
              if (depth > 0) {
                // We don't have direct access to parent key here easily without passing it down
                // But we can just close all popovers or rely on Popover's auto-close behavior
                // For now, let's just let the link navigation handle it
                setPopoverOpenMap({});
              }
            }}
          >
            <MenuIcon icon={item.icon} />
            <span className={cn({ 'sub-menu': subMenu }, 'whitespace-nowrap')}>
              {getMenuTitle(item)}
            </span>
          </Link>
        </SidebarMenuButton>
      </ItemWrapper>
    );
  }

  // 3. Parent Node (Accordion/Collapsible)
  return (
    <ItemWrapper>
      <SidebarMenuButton
        onClick={() => toggleMenu(key)}
        isActive={isActive}
        className='justify-between'
        tooltip={depth === 0 ? getMenuTitle(item) : undefined}
      >
        <span className='flex items-center gap-2'>
          <MenuIcon icon={item.icon} />
          <span className='whitespace-nowrap'>{getMenuTitle(item)}</span>
        </span>
        <ChevronDown
          className={cn(
            `size-${CHEVRON_SIZE} transition-transform`,
            expanded && 'rotate-180',
          )}
        />
      </SidebarMenuButton>
      {/* Submenu */}
      <SidebarMenuSub className={cn(!expanded && 'hidden')}>
        {item.children!.map((child) => (
          <SidebarItem
            key={child.name ?? child.title}
            item={child}
            depth={depth + 1}
          />
        ))}
      </SidebarMenuSub>
    </ItemWrapper>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AppSidebar() {
  const { isCan } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [popoverOpenMap, setPopoverOpenMap] = useState<Record<string, boolean>>(
    {},
  );
  const { t } = useTranslation();

  const getMenuTitle = useCallback(
    (menu: TSidebarMenu | SidebarMenuItemWithChildren): string => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return menu.title ? t(menu.title as any) : '';
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
        const hasSelfLink = Boolean(item.name);
        const hasVisibleChildren = Boolean(children && children.length > 0);

        if (!hasSelfLink && !hasVisibleChildren) return acc;

        acc.push({ ...item, children });
        return acc;
      }, []);
    };

    return filter(APP_SIDEBAR_MENUS);
  }, [isCan]);

  const getMenuPath = useCallback((menu: TSidebarMenu) => {
    if (!menu.name) return undefined;
    try {
      return nameToPath(menu.name);
    } catch {
      return undefined;
    }
  }, []);

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
    [location.pathname, getMenuPath],
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

  const contextValue = useMemo(
    () => ({
      openMap,
      toggleMenu,
      isMenuActive,
      getMenuTitle,
      getMenuPath,
      popoverOpenMap,
      setPopoverOpenMap,
    }),
    [
      openMap,
      isMenuActive,
      getMenuTitle,
      getMenuPath,
      popoverOpenMap,
      setPopoverOpenMap,
    ],
  );

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuContext.Provider value={contextValue}>
                {accessibleMenus.map((menu) => (
                  <SidebarItem
                    key={menu.name ?? menu.title}
                    item={menu}
                    depth={0}
                  />
                ))}
              </SidebarMenuContext.Provider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='pb-4'>
        <SidebarMenu className='mb-3'>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSidebar()}
              tooltip={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              <PanelLeft />
              <span className='whitespace-nowrap'>
                {isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <AppUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

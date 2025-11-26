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
import { Link, useLocation } from 'react-router-dom';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { AppUserMenu } from './app-layout-user-menu';
import AppSidebarHeader from './app-sidebar-header';

// ============================================================================
// TYPES
// ============================================================================

type MenuItemWithChildren = TSidebarMenu & {
  children?: MenuItemWithChildren[];
};

// ============================================================================
// UTILS
// ============================================================================

const getPathFromName = (name?: string): string | undefined => {
  if (!name) return undefined;
  try {
    return nameToPath(name);
  } catch {
    return undefined;
  }
};

const isPathActive = (
  menuPath: string,
  currentPath: string,
  hasChildren: boolean,
): boolean => {
  // Exact match
  if (currentPath === menuPath) return true;

  // For menus with sidebar children, don't check route children
  if (hasChildren) return false;

  // Check if current path is a child route
  const menuSegments = menuPath.split('/').filter(Boolean);
  const currentSegments = currentPath.split('/').filter(Boolean);

  if (currentSegments.length <= menuSegments.length) return false;

  // Check if all menu segments match
  const allMatch = menuSegments.every(
    (seg, idx) => seg === currentSegments[idx],
  );

  // Only match if menu has at least 2 segments (prevents base path matching)
  return allMatch && menuSegments.length >= 2;
};

// ============================================================================
// MENU ICON COMPONENT
// ============================================================================

const MenuIcon = memo(function MenuIcon({
  icon: Icon,
}: {
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return Icon ? <Icon className='size-5' /> : null;
});

// ============================================================================
// SIDEBAR ITEM COMPONENTS
// ============================================================================

type SidebarItemProps = {
  item: MenuItemWithChildren;
  depth?: number;
  currentPath: string;
  isCollapsed: boolean;
  openMenus: Set<string>;
  onToggleMenu: (key: string) => void;
  getTitle: (menu: MenuItemWithChildren) => string;
  inPopover?: boolean;
  onClosePopover?: () => void;
};

const SidebarLeafItem = memo(function SidebarLeafItem({
  item,
  depth = 0,
  currentPath,
  getTitle,
  inPopover = false,
  onClosePopover,
}: Omit<SidebarItemProps, 'isCollapsed' | 'openMenus' | 'onToggleMenu'>) {
  const path = getPathFromName(item.name);
  if (!path) return null;

  const isActive = isPathActive(path, currentPath, false);
  const isSubItem = depth > 0;
  const ItemWrapper = isSubItem ? SidebarMenuSubItem : SidebarMenuItem;

  return (
    <ItemWrapper>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        size={isSubItem ? 'sub' : 'default'}
        tooltip={depth === 0 && !inPopover ? getTitle(item) : undefined}
        className={cn(isSubItem && 'h-8 px-2', inPopover && 'justify-start')}
      >
        <Link to={path} onClick={onClosePopover}>
          <MenuIcon icon={item.icon} />
          <span className={cn('whitespace-nowrap', inPopover && 'sub-menu')}>
            {getTitle(item)}
          </span>
        </Link>
      </SidebarMenuButton>
    </ItemWrapper>
  );
});

const SidebarParentItem = memo(function SidebarParentItem({
  item,
  depth = 0,
  currentPath,
  isCollapsed,
  openMenus,
  onToggleMenu,
  getTitle,
}: SidebarItemProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const key = item.name ?? item.title;
  const path = getPathFromName(item.name);
  const children = item.children ?? [];

  // Check if this menu or any child is active
  const isActive = useMemo(() => {
    if (path && isPathActive(path, currentPath, true)) return true;
    const itemChildren = item.children ?? [];
    return itemChildren.some((child) => {
      const childPath = getPathFromName(child.name);
      return childPath && isPathActive(childPath, currentPath, false);
    });
  }, [path, currentPath, item.children]);

  const isExpanded = openMenus.has(key) || isActive;
  const ItemWrapper = depth > 0 ? SidebarMenuSubItem : SidebarMenuItem;

  // Collapsed mode with popover (top-level only)
  if (isCollapsed && depth === 0) {
    const closePopover = () => setPopoverOpen(false);

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <ItemWrapper>
            <SidebarMenuButton isActive={isActive} tooltip={getTitle(item)}>
              <MenuIcon icon={item.icon} />
              <span>{getTitle(item)}</span>
            </SidebarMenuButton>
          </ItemWrapper>
        </PopoverTrigger>
        <PopoverContent side='right' align='start' className='w-64 p-2'>
          <SidebarMenu className='space-y-1'>
            <li className='px-2 py-1.5 text-sm font-semibold list-none'>
              {getTitle(item)}
            </li>
            {children.map((child) => (
              <SidebarLeafItem
                key={child.name ?? child.title}
                item={child}
                depth={depth + 1}
                currentPath={currentPath}
                getTitle={getTitle}
                inPopover
                onClosePopover={closePopover}
              />
            ))}
          </SidebarMenu>
        </PopoverContent>
      </Popover>
    );
  }

  // Expanded mode with accordion
  return (
    <ItemWrapper>
      <SidebarMenuButton
        onClick={() => onToggleMenu(key)}
        isActive={isActive}
        className='justify-between'
        tooltip={depth === 0 ? getTitle(item) : undefined}
      >
        <span className='flex items-center gap-2'>
          <MenuIcon icon={item.icon} />
          <span className='whitespace-nowrap'>{getTitle(item)}</span>
        </span>
        <ChevronDown
          className={cn(
            'size-4 transition-transform',
            isExpanded && 'rotate-180',
          )}
        />
      </SidebarMenuButton>
      <SidebarMenuSub className={cn(!isExpanded && 'hidden')}>
        {children.map((child) =>
          child.children?.length ? (
            <SidebarParentItem
              key={child.name ?? child.title}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
              isCollapsed={isCollapsed}
              openMenus={openMenus}
              onToggleMenu={onToggleMenu}
              getTitle={getTitle}
            />
          ) : (
            <SidebarLeafItem
              key={child.name ?? child.title}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
              getTitle={getTitle}
            />
          ),
        )}
      </SidebarMenuSub>
    </ItemWrapper>
  );
});

const SidebarItemRouter = memo(function SidebarItemRouter(
  props: SidebarItemProps,
) {
  const { item, depth = 0 } = props;
  const hasChildren = Boolean(item.children?.length);

  return hasChildren ? (
    <SidebarParentItem {...props} depth={depth} />
  ) : (
    <SidebarLeafItem
      item={props.item}
      depth={depth}
      currentPath={props.currentPath}
      getTitle={props.getTitle}
    />
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AppSidebar() {
  const { isCan } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  // Filter menus based on permissions
  const accessibleMenus = useMemo(() => {
    const filterMenus = (
      menus: ReadonlyArray<TSidebarMenu>,
    ): MenuItemWithChildren[] => {
      return menus.reduce<MenuItemWithChildren[]>((acc, item) => {
        if (item.permission && !isCan(item.permission)) return acc;

        const children = item.children ? filterMenus(item.children) : undefined;
        const hasLink = Boolean(item.name);
        const hasChildren = Boolean(children?.length);

        if (!hasLink && !hasChildren) return acc;

        acc.push({ ...item, children });
        return acc;
      }, []);
    };

    return filterMenus(APP_SIDEBAR_MENUS);
  }, [isCan]);

  // Get translated title
  const getTitle = useCallback(
    (menu: MenuItemWithChildren): string => {
      return menu.title ? t(menu.title as never) : '';
    },
    [t],
  );

  // Toggle menu open/close
  const handleToggleMenu = useCallback((key: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleMenus.map((menu) => (
                <SidebarItemRouter
                  key={menu.name ?? menu.title}
                  item={menu}
                  depth={0}
                  currentPath={location.pathname}
                  isCollapsed={isCollapsed}
                  openMenus={openMenus}
                  onToggleMenu={handleToggleMenu}
                  getTitle={getTitle}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='pb-4'>
        <SidebarMenu className='mb-3'>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
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

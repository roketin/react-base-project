import AppSidebarHeader from '@/modules/app/components/layouts/app-sidebar-header';
import { APP_MENUS } from '@/modules/app/components/layouts/menus';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/modules/app/components/ui/sidebar';
import { nameToPath } from '@/modules/app/hooks/use-named-route';
import { cn } from '@/modules/app/libs/utils';
import { NavLink } from 'react-router-dom';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_MENUS.map((item) => {
                const actualPath = nameToPath(item.name);
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={actualPath} end={actualPath === '/admin'}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            isActive && '!bg-primary !text-primary-foreground',
                          )}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

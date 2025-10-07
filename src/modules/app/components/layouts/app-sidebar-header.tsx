import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/app/components/ui/sidebar';
import { RBrand } from '@/modules/app/components/base/r-brand';

const AppSidebarHeader = () => {
  return (
    <SidebarHeader className='border-sidebar-border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-3'>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className='data-[slot=sidebar-menu-button]:!p-2 data-[slot=sidebar-menu-button]:!h-auto'
          >
            <a href='#' className='flex items-center gap-3 no-underline'>
              <RBrand
                subtitleClassName='text-xs text-sidebar-foreground/70'
                titleClassName='text-base font-semibold leading-tight text-sidebar-foreground'
                iconClassName='size-10'
              />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
export default AppSidebarHeader;

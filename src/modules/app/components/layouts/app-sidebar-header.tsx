import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/app/components/ui/sidebar';
import { Rocket } from 'lucide-react';

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
              <span className='bg-primary text-primary-foreground shadow-sm size-10 rounded-md flex items-center justify-center flex-none'>
                <Rocket className='size-5' />
              </span>
              <span className='flex flex-col text-left'>
                <span className='text-base font-semibold leading-tight'>
                  Roketin Skeleton
                </span>
                <span className='text-xs text-sidebar-foreground/70'>
                  Skeleton Admin Panel
                </span>
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
export default AppSidebarHeader;

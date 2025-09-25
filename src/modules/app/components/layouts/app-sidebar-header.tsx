import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/app/components/ui/sidebar';
import { Rocket } from 'lucide-react';

const AppSidebarHeader = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className='data-[slot=sidebar-menu-button]:!p-1.5'
          >
            <a href='#'>
              <Rocket className='!size-5' />
              <span className='text-base font-semibold'>App Skeleton.</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
export default AppSidebarHeader;

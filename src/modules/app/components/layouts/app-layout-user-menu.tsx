import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import RAvatar from '@/modules/app/components/base/r-avatar';
import RBtn from '@/modules/app/components/base/r-btn';
import { LogOut, UserRound } from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useCallback } from 'react';
import showAlert from '@/modules/app/components/base/show-alert';
import ProfileDialog from '@/modules/auth/components/elements/auth-profile-dialog';
import {
  useSidebar,
  useDelayedExpanded,
} from '@/modules/app/contexts/sidebar-context';
import { useProfileDialogStore } from '@/modules/auth/stores/profile-dialog.store';

const AppUserMenu = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNamedRoute();
  const { isCollapsed } = useSidebar();
  const { isOpen: isProfileOpen, setOpen: setIsProfileOpen } =
    useProfileDialogStore();

  // Use helper hook for delayed visibility
  const showUserInfo = useDelayedExpanded(300);

  /**
   * Handles user logout with a confirmation prompt.
   * Shows a modal alert to confirm logout, and upon confirmation,
   * triggers logout, closes the alert, and navigates to the login page.
   *
   * @returns {void}
   */
  const handleLogout = useCallback(() => {
    showAlert(
      {
        title: 'Logout confirmation',
        description: 'Are you sure you want to logout from the dashboard?',
        type: 'confirm',
      },
      ({ ok, setLoading, close }) => {
        if (!ok) return;
        setLoading(true);
        setTimeout(() => {
          logout();
          close();
          navigate('AuthLogin', {}, { replace: true });
        }, 400);
      },
    );
  }, [logout, navigate]);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className='group flex w-full items-center gap-3 rounded-md px-2 py-2 transition-all duration-300 hover:bg-sidebar-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring'>
            <RAvatar
              name={user?.name || 'User'}
              size={isCollapsed ? 'xs' : 'sm'}
              className='bg-primary text-primary-foreground transition-all duration-300 shrink-0'
            />
            <div
              className={`flex-1 text-left leading-tight transition-all duration-300 overflow-hidden backface-hidden h-[35px] ${
                showUserInfo ? 'opacity-100' : 'opacity-0'
              } group-data-[collapsible=icon]:hidden`}
            >
              <div className='text-sm font-medium line-clamp-1'>
                {user?.name || '...'}
              </div>
              <div className='text-xs text-sidebar-foreground/60 line-clamp-1'>
                {user?.role || '...'}
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          className='w-56 border-border/70 p-0 shadow-lg'
        >
          <div className='border-b border-border/60 px-4 py-3'>
            <p className='text-xs text-muted-foreground'>
              {user?.email || '...'}
            </p>
          </div>
          <div className='flex flex-col gap-1 p-2'>
            <RBtn
              variant='ghost'
              className='justify-start gap-2 text-sm shadow-none'
              onClick={() => setIsProfileOpen(true)}
            >
              <UserRound className='size-4' />
              Profile
            </RBtn>
            <RBtn
              variant='ghost'
              className='justify-start gap-2 text-sm text-destructive hover:text-destructive shadow-none'
              onClick={handleLogout}
            >
              <LogOut className='size-4' />
              Logout
            </RBtn>
          </div>
        </PopoverContent>
      </Popover>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
};

export { AppUserMenu };

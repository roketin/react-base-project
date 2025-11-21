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
import { useCallback, useState } from 'react';
import showAlert from '@/modules/app/components/base/show-alert';
import ProfileDialog from '@/modules/auth/components/elements/auth-profile-dialog';

const AppUserMenu = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNamedRoute();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          <button className='group flex items-center gap-3 px-3 py-2 transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:rounded-md'>
            <div className='hidden md:block text-right leading-tight'>
              <p className='text-sm font-medium group-hover:text-primary'>
                {user?.name || '...'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {user?.role || '...'}
              </p>
            </div>
            <RAvatar
              name={user?.name || 'User'}
              size='sm'
              className='bg-primary text-primary-foreground'
            />
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
              className='justify-start gap-2 text-sm'
              onClick={() => setIsProfileOpen(true)}
            >
              <UserRound className='size-4' />
              Profile
            </RBtn>
            <RBtn
              variant='ghost'
              className='justify-start gap-2 text-sm text-destructive hover:text-destructive'
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

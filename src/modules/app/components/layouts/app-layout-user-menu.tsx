import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import RBtn from '@/modules/app/components/base/r-btn';
import { LogOut, UserRound } from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useCallback, useMemo } from 'react';
import showAlert from '@/modules/app/components/base/show-alert';

const AppUserMenu = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNamedRoute();

  /**
   * Computes and memoizes the user's initials based on their name.
   * Returns up to two uppercase initials or a default string if no name is present.
   *
   * @returns {string} User initials or default abbreviation.
   */
  const initials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return 'RKT';
  }, [user?.name]);

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
          <span className='grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-foreground shadow'>
            {initials}
          </span>
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
            disabled
          >
            <UserRound className='size-4' />
            Profile (coming soon)
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
  );
};

export { AppUserMenu };

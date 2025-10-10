import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import RBtn from '@/modules/app/components/base/r-btn';
import { LogOut, UserRound } from 'lucide-react';

type AppUserMenuProps = {
  initials: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  onLogout: () => void;
};

/**
 * Renders the user avatar, profile preview, and action menu in the app header.
 */
export function AppUserMenu({
  initials,
  name,
  email,
  role,
  onLogout,
}: AppUserMenuProps) {
  const displayName = name ?? '...';
  const displayEmail = email ?? '...';
  const displayRole = role ?? '...';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='group flex items-center gap-3 px-3 py-2 transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:rounded-md'>
          <div className='hidden md:block text-right leading-tight'>
            <p className='text-sm font-medium group-hover:text-primary'>
              {displayName}
            </p>
            <p className='text-xs text-muted-foreground'>{displayRole}</p>
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
          <p className='text-xs text-muted-foreground'>{displayEmail}</p>
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
            onClick={onLogout}
          >
            <LogOut className='size-4' />
            Logout
          </RBtn>
        </div>
      </PopoverContent>
    </Popover>
  );
}

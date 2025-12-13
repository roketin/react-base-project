import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type TTheme } from '@/modules/app/hooks/use-theme';
import { cn } from '@/modules/app/libs/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/app/components/base/r-dropdown-menu';
import RBtn from '@/modules/app/components/base/r-btn';

export type TRThemeSwitcherProps = {
  /** Show as dropdown or inline buttons */
  variant?: 'dropdown' | 'inline';
  /** Size of the component */
  size?: 'sm' | 'default';
  /** Additional class */
  className?: string;
};

const themeOptions: { value: TTheme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export const RThemeSwitcher = ({
  variant = 'dropdown',
  size = 'default',
  className,
}: TRThemeSwitcherProps) => {
  const { theme, setTheme, effectiveTheme } = useTheme();

  const CurrentIcon = effectiveTheme === 'dark' ? Moon : Sun;

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-1 p-1 rounded-lg bg-muted',
          className,
        )}
      >
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center justify-center rounded-md p-2 transition-colors',
              size === 'sm' ? 'p-1.5' : 'p-2',
              theme === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            title={label}
          >
            <Icon className={cn(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <RBtn
          variant='ghost'
          size={size === 'sm' ? 'iconSm' : 'icon'}
          className={className}
        >
          <CurrentIcon className={cn(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
          <span className='sr-only'>Toggle theme</span>
        </RBtn>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(theme === value && 'bg-accent')}
          >
            <Icon className='mr-2 h-4 w-4' />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RThemeSwitcher;

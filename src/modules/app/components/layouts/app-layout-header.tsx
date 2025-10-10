import { RBreadcrumbs } from '@/modules/app/components/base/r-breadcrumbs';
import RLangSwitcher from '@/modules/app/components/base/r-lang-switcher';
import { SidebarTrigger } from '@/modules/app/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { AppUserMenu } from './app-layout-user-menu';

type AppLayoutHeaderProps = {
  initials: string;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onLogout: () => void;
};

/**
 * Top navigation bar containing breadcrumbs, language switcher, and user menu.
 */
export function AppLayoutHeader({
  initials,
  userName,
  userEmail,
  userRole,
  onLogout,
}: AppLayoutHeaderProps) {
  return (
    <header className='sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/80 py-2 px-5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm'>
      <div className='flex items-center gap-3'>
        <SidebarTrigger className='-ml-2 rounded-lg border border-border/60 bg-background/80 hover:bg-primary/10 hover:text-primary' />
        <Separator
          orientation='vertical'
          className='h-8 border-l border-border/60'
        />
        <div className='flex flex-col gap-1'>
          <RBreadcrumbs />
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <RLangSwitcher />
        <AppUserMenu
          initials={initials}
          name={userName}
          email={userEmail}
          role={userRole}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}

import { SidebarTrigger } from '@/modules/app/components/ui/sidebar';
import RLangSwitcher from '@/modules/app/components/base/r-lang-switcher';
import { RBreadcrumbs } from '@/modules/app/components/base/r-breadcrumbs';
import { APP_EL } from '../../constants/app.constant';

const AppLayoutHeader = () => {
  return (
    <div
      id={APP_EL.HEADER}
      className='border-b border-border/40 bg-background/80 py-3 px-6 flex-none'
    >
      <header className='flex shrink-0 items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <SidebarTrigger className='md:hidden' />
          <RBreadcrumbs />
        </div>

        <div className='flex items-center gap-2'>
          <RLangSwitcher />
        </div>
      </header>
    </div>
  );
};

export { AppLayoutHeader };

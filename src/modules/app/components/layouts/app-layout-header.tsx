import RLangSwitcher from '@/modules/app/components/base/r-lang-switcher';
import { SidebarTrigger } from '@/modules/app/components/ui/sidebar';
import { AppUserMenu } from './app-layout-user-menu';
import { Separator } from '@/modules/app/components/ui/separator';
import { useMatches } from 'react-router-dom';
import { useMemo } from 'react';
import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useTranslation } from 'react-i18next';
import { RBreadcrumbs } from '@/modules/app/components/base/r-breadcrumbs';

const AppLayoutHeader = () => {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: TAppRouteObject['handle'];
  })[];

  // Get title from route
  const title = useMemo<string>(
    () => matches[matches.length - 1].handle?.title || '',
    [matches],
  );

  // Translation
  const { t } = useTranslation();

  return (
    <div
      id='app-header'
      className='sticky top-0 z-20 border-b border-border/60 bg-background/80 py-1 px-5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm shadow-xl shadow-slate-100'
    >
      <header className='flex shrink-0 items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <SidebarTrigger className='-ml-2 rounded-lg border border-border/60 bg-background/80 hover:bg-primary/10 hover:text-primary' />
          <Separator
            orientation='vertical'
            className='h-8 border-l border-border/60'
          />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {t(title as any)}
        </div>

        <div className='flex items-center gap-2'>
          <RLangSwitcher />
          <AppUserMenu />
        </div>
      </header>

      <div className='pb-2 pt-1'>
        <RBreadcrumbs />
      </div>
    </div>
  );
};

export { AppLayoutHeader };

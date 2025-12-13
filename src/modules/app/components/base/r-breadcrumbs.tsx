import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { Fragment, useMemo } from 'react';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useMatches } from 'react-router-dom';
import { linkTo } from '@/modules/app/hooks/use-named-route';
import { useOverridePageConfigStore } from '@/modules/app/stores/page-config.store';
import type { TBreadcrumbItem } from '@/modules/app/types/page-config.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/app/components/base/r-dropdown-menu';

type TBreadcrumbRenderItem = TBreadcrumbItem & {
  disabled?: boolean;
};

const MAX_ITEMS_MOBILE = 1; // Home + 1 item (last)
const MAX_ITEMS_DESKTOP = 3; // Home + 3 items (or first + ... + last 2)

export function RBreadcrumbs() {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: TAppRouteObject['handle'];
  })[];

  const resolvers = useBreadcrumbStore((s) => s.resolvers);
  const { t } = useTranslation('dashboard');
  const overrideBreadcrumbs = useOverridePageConfigStore(
    (state) => state.current?.breadcrumbs,
  );

  const filteredMatches = matches.filter(
    (m) => m.handle?.breadcrumb && !m.handle?.breadcrumbOptions?.hide,
  );

  const routeCrumbs = filteredMatches.map<TBreadcrumbRenderItem>((match, i) => {
    const bc = match.handle!.breadcrumb!;
    let label: string;

    if (typeof bc === 'string') {
      label = t(bc, { defaultValue: bc });
    } else {
      const value = bc(match);
      if (typeof value === 'string') {
        label = t(value, { defaultValue: value });
      } else {
        const resolver = resolvers[value.type];
        label = resolver?.(value.id) ?? `${value.type} ${value.id}`;
      }
    }

    const isLast = i === filteredMatches.length - 1;
    const isOnly = filteredMatches.length === 1;
    const isDisabled = Boolean(match.handle?.breadcrumbOptions?.disabled);

    return {
      label,
      href: !isLast && !isOnly && !isDisabled ? match.pathname : undefined,
      disabled: isDisabled,
    };
  });

  const overrideCrumbs = useMemo(() => {
    if (!overrideBreadcrumbs?.length) return undefined;
    return overrideBreadcrumbs.map<TBreadcrumbRenderItem>((crumb) => ({
      label: t(crumb.label, { defaultValue: crumb.label }),
      href: crumb.href,
    }));
  }, [overrideBreadcrumbs, t]);

  const crumbs = overrideCrumbs ?? routeCrumbs;

  const renderCrumbs = (maxItems: number) => {
    // If items fit within max, show all
    if (crumbs.length <= maxItems) {
      return crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const isOnly = crumbs.length === 1;
        const canNavigate = Boolean(crumb.href && !isLast && !isOnly);

        return (
          <Fragment key={`${crumb.label}-${index}`}>
            <li className='inline-flex items-center gap-1.5 min-w-0'>
              {canNavigate ? (
                <Link
                  to={crumb.href as string}
                  className='transition-colors hover:text-primary hover:underline truncate max-w-[150px]'
                  title={crumb.label}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast || isOnly
                      ? 'font-normal text-foreground truncate max-w-[150px]'
                      : 'cursor-default text-muted-foreground truncate max-w-[150px]'
                  }
                  title={crumb.label}
                  {...(isLast || isOnly
                    ? {
                        role: 'link',
                        'aria-disabled': 'true',
                        'aria-current': 'page',
                      }
                    : {})}
                >
                  {crumb.label}
                </span>
              )}
            </li>
            {!isLast && (
              <li role='presentation' aria-hidden='true' className='shrink-0'>
                <ChevronRight size={14} />
              </li>
            )}
          </Fragment>
        );
      });
    }

    // Too many items: show ... + last
    const lastCrumb = crumbs[crumbs.length - 1];
    const hiddenCrumbs = crumbs.slice(0, -1);

    return (
      <>
        <li className='inline-flex items-center gap-1.5 shrink-0'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex size-9 items-center justify-center transition-colors hover:text-foreground hover:bg-accent rounded-md'
                aria-label={`Show ${hiddenCrumbs.length} hidden items`}
              >
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='min-w-[200px]'>
              {hiddenCrumbs.map((crumb, index) => (
                <DropdownMenuItem key={`hidden-${index}`} asChild>
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className='w-full cursor-pointer'
                      title={crumb.label}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className='w-full cursor-default opacity-50'>
                      {crumb.label}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li role='presentation' aria-hidden='true' className='shrink-0'>
          <ChevronRight size={14} />
        </li>
        <li className='inline-flex items-center gap-1.5 min-w-0'>
          <span
            className='font-normal text-foreground truncate max-w-[200px]'
            title={lastCrumb.label}
            role='link'
            aria-disabled='true'
            aria-current='page'
          >
            {lastCrumb.label}
          </span>
        </li>
      </>
    );
  };

  return (
    <nav aria-label='breadcrumb' className='min-w-0 flex-1'>
      <ol className='flex items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5 overflow-hidden'>
        <li className='inline-flex items-center gap-1.5 shrink-0'>
          <Link
            to={linkTo('DashboardIndex')}
            className='flex items-center gap-2 py-1 transition-colors hover:text-primary hover:underline'
          >
            <Home size={14} />
          </Link>
        </li>
        {crumbs.length > 0 && (
          <li role='presentation' aria-hidden='true' className='shrink-0'>
            <ChevronRight size={14} />
          </li>
        )}
        <div className='contents md:hidden min-w-0'>
          {renderCrumbs(MAX_ITEMS_MOBILE)}
        </div>
        <div className='hidden md:contents min-w-0'>
          {renderCrumbs(MAX_ITEMS_DESKTOP)}
        </div>
      </ol>
    </nav>
  );
}

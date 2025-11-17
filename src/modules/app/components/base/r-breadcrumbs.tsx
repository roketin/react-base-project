import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/modules/app/components/ui/breadcrumb';
import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { Fragment, useMemo } from 'react';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useMatches } from 'react-router-dom';
import { linkTo } from '@/modules/app/hooks/use-named-route';
import { useOverridePageConfigStore } from '@/modules/app/stores/page-config.store';
import type { TBreadcrumbItem } from '@/modules/app/types/page-config.type';

type TBreadcrumbRenderItem = TBreadcrumbItem & {
  disabled?: boolean;
};

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

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            to={linkTo('DashboardIndex')}
            className='flex gap-2 items-center hover:underline hover:text-primary py-1'
          >
            <Home size={14} />
          </Link>
        </BreadcrumbItem>
        {crumbs.length > 0 && <BreadcrumbSeparator />}
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isOnly = crumbs.length === 1;
          const canNavigate = Boolean(crumb.href && !isLast && !isOnly);

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem>
                {canNavigate ? (
                  <Link
                    to={crumb.href as string}
                    className='hover:underline hover:text-primary'
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast || isOnly
                        ? 'text-primary'
                        : 'text-muted-foreground cursor-default'
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className='hidden md:block' />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

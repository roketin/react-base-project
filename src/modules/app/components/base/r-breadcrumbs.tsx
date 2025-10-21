import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/modules/app/components/ui/breadcrumb';
import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { Fragment } from 'react';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useMatches } from 'react-router-dom';
import { linkTo } from '@/modules/app/hooks/use-named-route';

export function RBreadcrumbs() {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: TAppRouteObject['handle'];
  })[];

  const resolvers = useBreadcrumbStore((s) => s.resolvers);
  const { t } = useTranslation('dashboard');

  const filteredMatches = matches.filter((m) => m.handle?.breadcrumb);

  const crumbs = filteredMatches.map((match, i) => {
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

    return (
      <Fragment key={i}>
        <BreadcrumbItem>
          {!isLast && !isOnly && !isDisabled ? (
            <Link
              to={match.pathname}
              className='hover:underline hover:text-primary'
            >
              {label}
            </Link>
          ) : (
            <span
              className={
                isLast || isOnly
                  ? 'text-primary'
                  : 'text-muted-foreground cursor-default'
              }
            >
              {label}
            </span>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator className='hidden md:block' />}
      </Fragment>
    );
  });

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
        {crumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

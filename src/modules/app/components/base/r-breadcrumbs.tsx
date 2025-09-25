import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/modules/app/components/ui/breadcrumb';
import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { Link, useMatches } from 'react-router-dom';
import { Fragment } from 'react';

export function RBreadcrumbs() {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: TAppRouteObject['handle'];
  })[];

  const resolvers = useBreadcrumbStore((s) => s.resolvers);

  const filteredMatches = matches.filter((m) => m.handle?.breadcrumb);

  const crumbs = filteredMatches.map((match, i) => {
    const bc = match.handle!.breadcrumb!;
    let label: string;

    if (typeof bc === 'string') {
      label = bc;
    } else {
      const value = bc(match);
      if (typeof value === 'string') {
        label = value;
      } else {
        const resolver = resolvers[value.type];
        label = resolver?.(value.id) ?? `${value.type} ${value.id}`;
      }
    }

    const isLast = i === filteredMatches.length - 1;
    const isOnly = filteredMatches.length === 1;

    return (
      <Fragment key={i}>
        <BreadcrumbItem>
          {!isLast && !isOnly ? (
            <Link to={match.pathname} className='hover:underline'>
              {label}
            </Link>
          ) : (
            label
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator className='hidden md:block' />}
      </Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{crumbs}</BreadcrumbList>
    </Breadcrumb>
  );
}

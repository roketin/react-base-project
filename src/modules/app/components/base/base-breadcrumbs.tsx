import type { AppRouteObject } from '@/modules/app/libs/routes-utils';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { Link, useMatches } from 'react-router-dom';

export function BaseBreadcrumbs() {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: AppRouteObject['handle'];
  })[];

  const resolvers = useBreadcrumbStore((s) => s.resolvers);

  const crumbs = matches
    .filter((m) => m.handle?.breadcrumb)
    .map((match, i) => {
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

      return (
        <span key={i} className='flex items-center gap-2'>
          <Link to={match.pathname} className='text-blue-600 hover:underline'>
            {label}
          </Link>
          {i < matches.length - 1 && <span>/</span>}
        </span>
      );
    });

  return <nav className='flex space-x-1'>{crumbs}</nav>;
}

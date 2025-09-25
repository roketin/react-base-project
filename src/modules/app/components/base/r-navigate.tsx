// DynamicRedirect.tsx

import { Navigate } from 'react-router-dom';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';

export type TRNavigateProps = {
  name?: string;
  path?: string;
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  replace?: boolean;
};

export function RNavigate({
  name,
  path,
  params,
  query,
  replace,
}: TRNavigateProps) {
  let to: { pathname: string; search?: string; replace?: boolean };

  const { linkTo } = useNamedRoute();

  if (name) {
    to = linkTo(name, params, { query, replace });
  } else if (path) {
    let pathname = path;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        pathname = pathname.replace(`:${key}`, val);
      }
    }

    let search: string | undefined;
    if (query) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        searchParams.append(key, String(value));
      }
      const queryString = searchParams.toString();
      if (queryString) search = `?${queryString}`;
    }

    to = { pathname, search, replace };
  } else {
    throw new Error('DynamicRedirect requires either name or path');
  }

  return <Navigate to={to} replace={replace} />;
}

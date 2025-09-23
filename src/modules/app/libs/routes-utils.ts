import type { BreadcrumbType } from '@/modules/app/stores/breadcrumbs.store';
import type { RouteObject } from 'react-router-dom';

export type TBreadcrumbHandle =
  | string
  | ((match: {
      params: Record<string, string | undefined>;
      data?: unknown;
      pathname: string;
    }) => string | { type: BreadcrumbType; id: string });

export type TAppRouteObject = Omit<RouteObject, 'children' | 'handle'> & {
  name?: string;
  handle?: {
    breadcrumb?: TBreadcrumbHandle;
    [key: string]: unknown;
  };
  children?: TAppRouteObject[];
};

export function createAppRoutes(routes: TAppRouteObject[]): TAppRouteObject[] {
  return routes;
}

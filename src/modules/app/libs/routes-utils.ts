import type { BreadcrumbType } from '@/modules/app/stores/breadcrumbs.store';
import type { RouteObject } from 'react-router-dom';

export type BreadcrumbHandle =
  | string
  | ((match: {
      params: Record<string, string | undefined>;
      data?: unknown;
      pathname: string;
    }) => string | { type: BreadcrumbType; id: string });

export type AppRouteObject = Omit<RouteObject, 'children' | 'handle'> & {
  name?: string;
  handle?: {
    breadcrumb?: BreadcrumbHandle;
    [key: string]: unknown;
  };
  children?: AppRouteObject[];
};
export function createAppRoutes(routes: AppRouteObject[]): AppRouteObject[] {
  return routes;
}

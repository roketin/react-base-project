import type { BreadcrumbType } from '@/modules/app/stores/breadcrumbs.store';
import type { RouteObject } from 'react-router-dom';

/**
 * Defines the type for breadcrumb handling in the application routes.
 * It can be either a static string or a function that generates a breadcrumb label.
 * The function receives an object containing route parameters, optional data, and the current pathname,
 * and returns either a string label or an object with a breadcrumb type and identifier.
 */
export type TBreadcrumbHandle =
  | string
  | ((match: {
      params: Record<string, string | undefined>;
      data?: unknown;
      pathname: string;
    }) => string | { type: BreadcrumbType; id: string });

/**
 * Extends the React Router's RouteObject to include application-specific properties.
 * - `name`: Optional human-readable name for the route.
 * - `handle`: An object that can include a breadcrumb handler and other custom metadata.
 * - `children`: Nested routes following the same structure.
 */
export type TAppRouteObject = Omit<RouteObject, 'children' | 'handle'> & {
  name?: string;
  handle?: {
    breadcrumb?: TBreadcrumbHandle;
    [key: string]: unknown;
  };
  children?: TAppRouteObject[];
};

/**
 * Utility function to create application routes.
 * Currently, this function returns the routes array as-is, but it can be extended
 * to include additional processing or validation for the application's routing configuration.
 *
 * @param routes - Array of application route objects to be processed.
 * @returns The same array of application route objects.
 */
export function createAppRoutes(routes: TAppRouteObject[]): TAppRouteObject[] {
  return routes;
}

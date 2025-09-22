import type { AppRouteObject } from '@/modules/app/libs/routes-utils';
import { routes } from '@/modules/app/routes/app-routes';
import { useNavigate } from 'react-router-dom';

/**
 * Flattens a nested array of route objects into a flat array, computing the full absolute path for each route.
 *
 * @param parentPath - The base path accumulated from parent routes.
 * @returns An array of route objects each with an added `fullPath` property.
 */
export function flattenRoutes(
  routesToProcess: AppRouteObject[] = routes,
  parentPath = '',
): (AppRouteObject & { fullPath: string })[] {
  let flatRoutes: (AppRouteObject & { fullPath: string })[] = [];

  for (const route of routesToProcess) {
    const currentPath = route.path
      ? route.path.startsWith('/')
        ? route.path
        : `${parentPath}/${route.path}`
      : parentPath;
    const fullPath = currentPath.replace(/\/+/g, '/'); // Normalize slashes

    flatRoutes.push({ ...route, fullPath });

    if (route.children) {
      flatRoutes = flatRoutes.concat(flattenRoutes(route.children, fullPath));
    }
  }

  return flatRoutes;
}

/**
 * Finds a route object by its name within the nested routes array, returning the route with its full absolute path.
 *
 * @param name - The name of the route to find.
 * @returns The route object with the matching name and its fullPath, or undefined if not found.
 */
export function findRouteByName(
  name: string,
): (AppRouteObject & { fullPath: string }) | undefined {
  const flatRoutes = flattenRoutes();
  return flatRoutes.find((route) => route.name === name);
}

/**
 * Resolves a route path by replacing parameter placeholders with actual values.
 *
 * @param path - The route path string containing parameters (e.g., '/user/:id').
 * @param params - An object mapping parameter names to their replacement values.
 * @returns The resolved path string with parameters replaced by their values.
 */
export function resolvePath(path: string, params: Record<string, string>) {
  let result = path;
  for (const [key, val] of Object.entries(params)) {
    result = result.replace(`:${key}`, val);
  }
  return result;
}

/**
 * Generates a link object for navigation based on a route name and parameters.
 *
 * @param name - The name of the route to link to.
 * @param params - Optional parameters to replace in the route path.
 * @param options - Optional navigation options, such as replace flag and query parameters.
 * @param options.replace - If true, navigation will replace the current entry in the history stack.
 * @param options.query - An object representing query parameters to append to the URL.
 * @returns An object containing the resolved pathname, optional search string, and optional replace flag.
 * @throws Error if the route with the specified name is not found.
 */
export function linkTo(
  name: string,
  params: Record<string, string> = {},
  options?: {
    replace?: boolean;
    query?: Record<string, string | number | boolean>;
  },
): { pathname: string; search?: string; replace?: boolean } {
  const route = findRouteByName(name);
  if (!route?.fullPath) throw new Error(`Route "${name}" not found`);

  const pathname = resolvePath(route.fullPath, params);

  let search: string | undefined;
  if (options?.query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      searchParams.append(key, String(value));
    }
    const queryString = searchParams.toString();
    if (queryString) {
      search = `?${queryString}`;
    }
  }

  if (options && typeof options.replace === 'boolean') {
    return { pathname, search, replace: options.replace };
  }
  return { pathname, search };
}

/**
 * Custom hook that provides navigation functions using named routes.
 *
 * @returns An object containing:
 *   - push: Function to navigate to a named route with optional parameters and options.
 *   - linkTo: Function to generate a link object for a named route.
 */
export function useNamedRoute() {
  const navigateRaw = useNavigate();

  function navigate(
    name: string,
    params: Record<string, string> = {},
    options?: {
      replace?: boolean;
      query?: Record<string, string | number | boolean>;
    },
  ) {
    const to = linkTo(name, params, options);
    navigateRaw(to, { replace: to.replace });
  }

  return { navigate, linkTo };
}

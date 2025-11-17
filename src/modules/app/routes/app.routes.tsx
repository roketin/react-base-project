// app-routes.ts
import {
  createAppRoutes,
  type TAppRouteObject,
} from '@/modules/app/libs/routes-utils';
import AppGlobalError from '@/modules/app/components/pages/app-global-error';
import AppEntryPoint from '@/modules/app/components/pages/app-entry-point';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import AppLayout from '@/modules/app/components/layouts/app-layout';
import AuthProtectedRoute from '@/modules/auth/hoc/auth-protected-route';
import FeatureFlagRouteGuard from '@/modules/app/hoc/feature-flag-route-guard';
import roketinConfig from '@config';

import { Outlet } from 'react-router-dom';

// Automatically imports all route files matching the pattern to gather route definitions dynamically
const routeModules = import.meta.glob('@/modules/**/routes/*.routes.tsx', {
  eager: true,
});

/**
 * Dynamically loads route definitions from all modules except the current one.
 * Supports both default exports and named exports containing arrays of routes.
 *
 * @returns {TAppRouteObject[]} Aggregated array of route objects from various feature modules.
 */
export function loadRoutes(): TAppRouteObject[] {
  const routes: TAppRouteObject[] = [];

  for (const path in routeModules) {
    // Skip this file to avoid circular dependency and redundant inclusion
    if (path.includes('app.routes')) {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = routeModules[path];

    // If module has a default export which is an array of routes, add them
    if (mod.default) {
      routes.push(...(mod.default as TAppRouteObject[]));
    }

    // Also check for named exports that are arrays of routes and add them
    for (const key of Object.keys(mod)) {
      if (Array.isArray(mod[key])) {
        routes.push(...(mod[key] as TAppRouteObject[]));
      }
    }
  }

  return routes;
}

/**
 * Recursively applies authentication and permission guards to route elements.
 * Wraps route elements with AuthProtectedRoute if authentication or permissions are required.
 *
 * @param {TAppRouteObject[]} routes - Array of route objects to process.
 * @returns {TAppRouteObject[]} New array of route objects with applied route guards.
 */
function applyRouteGuards(routes: TAppRouteObject[]): TAppRouteObject[] {
  return routes.map((route) => {
    // Recursively apply guards to child routes if present
    const guardedChildren = route.children
      ? applyRouteGuards(route.children)
      : undefined;

    const permissions = route.handle?.permissions;
    const featureFlag = route.handle?.featureFlag;
    const featureFlagFallback = route.handle?.featureFlagFallback;
    // Determine if the route requires authentication either explicitly or via permissions
    const requiresAuth =
      Boolean(route.handle?.isRequiredAuth) ||
      Boolean(permissions && permissions.length > 0);

    let element = route.element;
    const fallbackElement = route.children ? <Outlet /> : null;

    if (featureFlag) {
      element = (
        <FeatureFlagRouteGuard
          element={element ?? fallbackElement}
          featureFlag={featureFlag}
          fallback={featureFlagFallback}
        />
      );
    }

    if (requiresAuth) {
      // Wrap the element with AuthProtectedRoute to enforce authentication and permissions
      element = (
        <AuthProtectedRoute
          element={element ?? fallbackElement}
          permissions={permissions}
        />
      );
    }

    return {
      ...route,
      element,
      children: guardedChildren,
    };
  });
}

/**
 * Splits an array of route objects into two groups:
 * - absoluteRoutes: routes with paths starting with '/' (absolute paths)
 * - nestedRoutes: routes with relative paths or no path specified
 *
 * @param {TAppRouteObject[]} routes - Array of route objects to split.
 * @returns {{ absoluteRoutes: TAppRouteObject[], nestedRoutes: TAppRouteObject[] }} Object containing separated route arrays.
 */
function splitFeatureRoutes(routes: TAppRouteObject[]) {
  const absoluteRoutes: TAppRouteObject[] = [];
  const nestedRoutes: TAppRouteObject[] = [];

  for (const route of routes) {
    const path = route.path;
    // Classify routes as absolute or nested based on whether path starts with '/'
    if (typeof path === 'string' && path.startsWith('/')) {
      absoluteRoutes.push(route);
    } else {
      nestedRoutes.push(route);
    }
  }

  return { absoluteRoutes, nestedRoutes };
}

/**
 * The main route configuration for the application.
 * Defines root-level routes, global error handling, authentication-protected admin routes, and fallback routes.
 */
const featureRoutes = loadRoutes();
const { absoluteRoutes, nestedRoutes } = splitFeatureRoutes(featureRoutes);
const rawAdminBasePath = roketinConfig.routes?.admin?.basePath ?? '/admin';
const adminBasePath = rawAdminBasePath.startsWith('/')
  ? rawAdminBasePath
  : `/${rawAdminBasePath}`;

const adminRoute =
  nestedRoutes.length > 0
    ? {
        path: adminBasePath,
        element: <AppLayout />,
        handle: {
          isRequiredAuth: true,
        },
        children: nestedRoutes,
      }
    : null;

const rawAppRoutesConfig: TAppRouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    errorElement: <AppGlobalError />,
    children: [
      { index: true, element: <AppEntryPoint /> },

      ...absoluteRoutes,

      ...(adminRoute ? [adminRoute] : []),
      { path: '*', element: <AppNotFound /> },
    ],
  },
];

export const appRoutesConfig = applyRouteGuards(rawAppRoutesConfig);

// Creates the final route objects used by the router from the appRoutesConfig.
export const routes = createAppRoutes(appRoutesConfig);

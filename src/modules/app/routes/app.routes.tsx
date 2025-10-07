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

import { Outlet } from 'react-router-dom';

// Automatically imports all route files matching the pattern to gather route definitions dynamically
const routeModules = import.meta.glob('@/modules/**/routes/*.routes.tsx', {
  eager: true,
});

/**
 * Loads all route modules except the excluded ones and aggregates their route definitions.
 * It supports both default exports and named exports of arrays of routes.
 * @returns {TAppRouteObject[]} An array of route objects collected from various modules.
 */
export function loadRoutes(): TAppRouteObject[] {
  const routes: TAppRouteObject[] = [];

  for (const path in routeModules) {
    // ❌ Skip this file to avoid circular inclusion
    if (path.includes('app.routes')) {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = routeModules[path];

    // Ambil export sesuai format
    if (mod.default) {
      routes.push(...(mod.default as TAppRouteObject[]));
    }

    // Kalau pakai named export (misalnya export const dashboardRoutes)
    for (const key of Object.keys(mod)) {
      if (Array.isArray(mod[key])) {
        routes.push(...(mod[key] as TAppRouteObject[]));
      }
    }
  }

  return routes;
}

function applyRouteGuards(routes: TAppRouteObject[]): TAppRouteObject[] {
  return routes.map((route) => {
    const guardedChildren = route.children
      ? applyRouteGuards(route.children)
      : undefined;

    const permissions = route.handle?.permissions;
    const requiresAuth =
      Boolean(route.handle?.isRequiredAuth) ||
      Boolean(permissions && permissions.length > 0);

    let element = route.element;

    if (requiresAuth) {
      const fallback = route.children ? <Outlet /> : null;
      element = (
        <AuthProtectedRoute
          element={element ?? fallback}
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

function splitFeatureRoutes(routes: TAppRouteObject[]) {
  const absoluteRoutes: TAppRouteObject[] = [];
  const nestedRoutes: TAppRouteObject[] = [];

  for (const route of routes) {
    const path = route.path;
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
 * Defines the root path, error handling, authentication routes, protected admin routes, and fallback routes.
 */
const featureRoutes = loadRoutes();
const { absoluteRoutes, nestedRoutes } = splitFeatureRoutes(featureRoutes);

const adminRoute =
  nestedRoutes.length > 0
    ? {
        path: '/admin',
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

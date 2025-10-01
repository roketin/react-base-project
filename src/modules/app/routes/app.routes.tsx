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
import { authRoutes } from '@/modules/auth/routes/auth.routes';

// Automatically imports all route files matching the pattern to gather route definitions dynamically
const routeModules = import.meta.glob('@/modules/**/routes/*.routes.tsx', {
  eager: true,
});

// Exclude certain route files to prevent duplication or conflicts
// These routes are handled separately or are entry points and should not be loaded here
const excludedRoutes = ['auth.routes', 'app.routes'];

/**
 * Loads all route modules except the excluded ones and aggregates their route definitions.
 * It supports both default exports and named exports of arrays of routes.
 * @returns {TAppRouteObject[]} An array of route objects collected from various modules.
 */
export function loadRoutes(): TAppRouteObject[] {
  const routes: TAppRouteObject[] = [];

  for (const path in routeModules) {
    // ❌ Skip files that include any of the excluded routes
    if (excludedRoutes.some((excluded) => path.includes(excluded))) {
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

/**
 * The main route configuration for the application.
 * Defines the root path, error handling, authentication routes, protected admin routes, and fallback routes.
 */
export const appRoutesConfig = [
  {
    path: '/',
    element: <Outlet />,
    errorElement: <AppGlobalError />,
    children: [
      { index: true, element: <AppEntryPoint /> },

      ...authRoutes,

      {
        path: '/admin',
        element: <AuthProtectedRoute element={<AppLayout />} />,
        children: loadRoutes(),
      },
      { path: '*', element: <AppNotFound /> },
    ],
  },
];

// Creates the final route objects used by the router from the appRoutesConfig.
export const routes = createAppRoutes(appRoutesConfig);

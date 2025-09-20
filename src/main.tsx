import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import '@/modules/app/assets/css/global.css';

// App Pages
import AppGlobalError from '@/modules/app/components/pages/app-global-error';
import AppEntryPoint from '@/modules/app/components/pages/app-entry-point';
import AppNotFound from '@/modules/app/components/pages/app-not-found';

// Routes
import { authRoutes } from '@/modules/auth/routes/auth.routes';
import AuthProtectedRoute from '@/modules/auth/hoc/auth-protected-route';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <AppGlobalError />,
    children: [
      {
        index: true,
        element: <AppEntryPoint />,
      },

      ...authRoutes,

      // Private pages
      {
        path: '/admin',
        element: (
          <AuthProtectedRoute
            element={
              <div>
                <Outlet />
              </div>
            }
          />
        ),
      },

      { path: '*', element: <AppNotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

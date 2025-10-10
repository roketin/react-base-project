import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import '@/modules/app/assets/css/global.css';
import { routes } from '@/modules/app/routes/app.routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/plugins/tanstack-query';
import './plugins/i18n';
import { Toaster } from '@/modules/app/components/ui/sonner';

const router = createBrowserRouter(routes as RouteObject[]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position='bottom-right' richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import '@/modules/app/assets/css/global.css';
import { routes } from '@/modules/app/routes/app-routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/plugins/tanstack-query';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

const router = createBrowserRouter(routes as RouteObject[]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-right' richColors />
      <Suspense
        fallback={
          <div className='h-full w-full flex items-center justify-center gap-4'>
            <Loader2 className='animate-spin' />
            <h3>Please wait....</h3>
          </div>
        }
      >
        <RouterProvider router={router} />\
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
);

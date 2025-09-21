import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import '@/modules/app/assets/css/global.css';
import { routes } from '@/modules/app/routes/app-routes';

const router = createBrowserRouter(routes as RouteObject[]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

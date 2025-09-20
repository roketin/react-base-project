import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/modules/home/components/home'));

export const homeRoutes: RouteObject[] = [{ path: 'home', element: <Home /> }];

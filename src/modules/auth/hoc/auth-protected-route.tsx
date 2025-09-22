import { Navigate } from 'react-router-dom';
import React, { memo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { linkTo } from '@/modules/app/hooks/use-named-route';

/**
 * High Order Component for protected route
 * @param {component}
 * @returns
 */
const AuthProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    return <Navigate to={linkTo('AuthLogin')} replace />;
  }

  return element;
};

export default memo(AuthProtectedRoute);

import { Navigate } from 'react-router-dom';
import React, { memo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';

/**
 * High Order Component for protected route
 * @param {component}
 * @returns
 */
const AuthProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return element;
};

export default memo(AuthProtectedRoute);

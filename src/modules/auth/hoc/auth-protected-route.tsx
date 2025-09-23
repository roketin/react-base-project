import React, { memo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RNavigate } from '@/modules/app/components/base/r-navigate';

/**
 * High Order Component for protected route
 * @param {component}
 * @returns
 */
const AuthProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    return <RNavigate name='AuthLogin' replace />;
  }

  return element;
};

export default memo(AuthProtectedRoute);

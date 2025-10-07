import React, { memo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import AppForbidden from '@/modules/app/components/pages/app-forbidden';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import { useAuthBootstrap } from '@/modules/auth/hooks/use-auth-bootstrap';
import { RLoading } from '@/modules/app/components/base/r-loading';

type AuthProtectedRouteProps = {
  element: React.ReactNode;
  permissions?: TPermission[];
};

/**
 * High Order Component for protected route
 * @param {component}
 * @returns
 */
const AuthProtectedRoute = ({
  element,
  permissions,
}: AuthProtectedRouteProps) => {
  const { user, isLoggedIn, isCan } = useAuth();
  const { isBootstrapping, status } = useAuthBootstrap();

  if (!isLoggedIn()) {
    return <RNavigate name='AuthLogin' replace />;
  }

  const shouldCheckPermission = Boolean(permissions && permissions.length > 0);

  if (shouldCheckPermission && isBootstrapping) {
    return <RLoading label='Loading access...' className='min-h-[200px]' />;
  }

  if (shouldCheckPermission && !isBootstrapping && status === 'error') {
    return <AppForbidden />;
  }

  if (permissions && permissions.length > 0) {
    if (!user) {
      return <AppForbidden />;
    }

    if (!isCan(permissions)) {
      return <AppForbidden />;
    }
  }

  return element;
};

export default memo(AuthProtectedRoute);

import React, { memo } from 'react';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import AppForbidden from '@/modules/app/components/pages/app-forbidden';
import type { TPermission } from '@/modules/app/constants/permission.constant';

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
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn()) {
    return <RNavigate name='AuthLogin' replace />;
  }

  if (permissions && permissions.length > 0) {
    const userPermissions = Array.isArray(user?.permissions)
      ? user?.permissions
      : [];

    const hasAccess = permissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAccess) {
      return <AppForbidden />;
    }
  }

  return element;
};

export default memo(AuthProtectedRoute);

import type { TPermission } from '@/modules/app/constants/permission.constant';
import useAuthStore from '@/modules/auth/stores/auth.store';

export function useAuth() {
  // Indicator for check is logged in or not
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  // User
  const user = useAuthStore((state) => state.authData);

  const isCan = (required: TPermission | TPermission[]) => {
    const requiredList = Array.isArray(required) ? required : [required];
    if (requiredList.length === 0) return true;
    const userPermissions = user?.permissions ?? [];
    if (!userPermissions || userPermissions.length === 0) return false;
    return requiredList.every((permission) =>
      userPermissions.includes(permission),
    );
  };

  return { user, isLoggedIn, isCan };
}

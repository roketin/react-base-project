import { useCallback, useMemo } from 'react';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import useAuthStore from '@/modules/auth/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_PROFILE_QUERY_KEY } from '@/modules/auth/services/auth.service';

export function useAuth() {
  const queryClient = useQueryClient();
  const token = useAuthStore(useCallback((state) => state.token, []));

  // Grab authenticated user profile and logout handler once.
  const user = useAuthStore(useCallback((state) => state.authData, []));
  const clearCredential = useAuthStore(
    useCallback((state) => state.clearCredential, []),
  );

  // Normalize permissions list once per auth change.
  const userPermissions = useMemo(
    () => user?.permissions ?? [],
    [user?.permissions],
  );

  // Check whether the user owns the required permission(s).
  const isCan = useCallback(
    (required: TPermission | TPermission[]) => {
      const requiredList = Array.isArray(required) ? required : [required];
      if (requiredList.length === 0) return true;
      if (!userPermissions || userPermissions.length === 0) return false;
      return requiredList.every((permission) =>
        userPermissions.includes(permission),
      );
    },
    [userPermissions],
  );

  const isLoggedIn = useCallback(() => Boolean(token), [token]);

  // Clear stored credentials and session info.
  const logout = useCallback(() => {
    queryClient.removeQueries({
      queryKey: AUTH_PROFILE_QUERY_KEY,
      exact: true,
    });
    clearCredential();
  }, [clearCredential, queryClient]);

  return { user, isLoggedIn, isCan, logout };
}

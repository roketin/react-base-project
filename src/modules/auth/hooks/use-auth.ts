import useAuthStore from '@/modules/auth/stores/auth.store';

export function useAuth() {
  // Indicator for check is logged in or not
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  // User
  const user = useAuthStore((state) => state.authData);

  return { user, isLoggedIn };
}

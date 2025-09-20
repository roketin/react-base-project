import useAuthStore from '@/modules/auth/store/auth.store';

export function useAuth() {
  // Indicator for check is logged in or not
  const isLoggedIn = useAuthStore<boolean>((state) => state.isAuthenticated());

  // User
  const user = useAuthStore((state) => state.authData);

  return { user, isLoggedIn };
}

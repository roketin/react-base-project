import { useEffect, useMemo } from 'react';
import { useAuthProfileQuery } from '@/modules/auth/services/auth.service';
import useAuthStore from '@/modules/auth/stores/auth.store';

export function useAuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const authData = useAuthStore((state) => state.authData);
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const clearCredential = useAuthStore((state) => state.clearCredential);

  const shouldFetch = useMemo(
    () => Boolean(token && !authData),
    [token, authData],
  );

  const profileQuery = useAuthProfileQuery(shouldFetch);

  useEffect(() => {
    if (!profileQuery.data) return;
    setAuthData(profileQuery.data);
  }, [profileQuery.data, setAuthData]);

  useEffect(() => {
    if (!profileQuery.isError) return;
    const status = profileQuery.error?.response?.status;
    if (status === 401) {
      clearCredential();
    }
  }, [profileQuery.isError, profileQuery.error, clearCredential]);

  const isFetchingProfile = profileQuery.isLoading || profileQuery.isFetching;

  return {
    isBootstrapping: shouldFetch && isFetchingProfile,
    status: profileQuery.status,
    error: profileQuery.error,
  };
}

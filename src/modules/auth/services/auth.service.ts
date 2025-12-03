import type { TApiResponse } from '@/modules/app/types/api.type';
import type {
  TAuthForgot,
  TAuthLogin,
  TAuthLoginResponse,
  TAuthReset,
  TAuthProfile,
} from '@/modules/auth/types/auth.type';
import http from '@/plugins/axios';
import useAuthStore from '@/modules/auth/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

/** Query key for auth profile, used for cache management */
export const AUTH_PROFILE_QUERY_KEY = ['auth', 'profile'] as const;

/**
 * Fetch current logged-in user profile data
 * @returns Promise<TAuthProfile> - user profile data
 */
const fetchAuthProfile = async (): Promise<TAuthProfile> => {
  const resp = await http.get<TApiResponse<TAuthProfile>>('/auth/me');
  return resp.data.data;
};

/**
 * Hook to fetch user profile with react-query
 * Used to get current logged-in user data declaratively
 */
export const useAuthProfileQuery = createQuery<TAuthProfile, void, AxiosError>({
  queryKey: AUTH_PROFILE_QUERY_KEY,
  fetcher: fetchAuthProfile,
});

/**
 * Mutation for login process
 */
const authLoginMutation = createMutation<
  TApiResponse<TAuthLoginResponse>,
  TAuthLogin,
  AxiosError
>({
  mutationFn: async (payload) => {
    const resp = await http.post('/auth/login', payload);
    return resp.data;
  },
});

/**
 * Hook for user login process
 * After successful login, stores tokens and fetches user profile
 * @returns mutation object with mutate/mutateAsync methods
 */
export const useAuthLogin = () => {
  const queryClient = useQueryClient();
  const setCredential = useAuthStore((state) => state.setCredential);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return authLoginMutation({
    onSuccess: async (response) => {
      setCredential(response.data.access_token, response.data.refresh_token);

      // Clear old profile cache to ensure fresh data
      queryClient.removeQueries({
        queryKey: AUTH_PROFILE_QUERY_KEY,
        exact: true,
      });

      try {
        const profile = await queryClient.fetchQuery({
          queryKey: AUTH_PROFILE_QUERY_KEY,
          queryFn: fetchAuthProfile,
          staleTime: 1000 * 60 * 5,
        });
        setAuthData(profile);
      } catch (error) {
        console.error('Failed to fetch profile after login', error);
      }
    },
  });
};

/**
 * Hook for forgot password request
 * Sends password reset email to user
 */
export const useAuthForgot = createMutation<
  TApiResponse<unknown>,
  TAuthForgot,
  AxiosError
>({
  mutationFn: async (payload) => {
    const resp = await http.post('/auth/forgot', payload);
    return resp.data;
  },
});

/**
 * Hook for password reset
 * Changes user password using token from email
 */
export const useAuthReset = createMutation<
  TApiResponse<unknown>,
  TAuthReset,
  AxiosError
>({
  mutationFn: async (payload) => {
    const resp = await http.post('/auth/reset', payload);
    return resp.data;
  },
});

/**
 * Hook for token refresh
 * Gets new access_token and refresh_token
 */
export const useAuthRefreshToken = createMutation<
  TApiResponse<TAuthLoginResponse>,
  void,
  AxiosError
>({
  mutationFn: async () => {
    const resp = await http.post('/auth/refresh-token');
    return resp.data;
  },
});

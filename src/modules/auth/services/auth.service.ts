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

export const AUTH_PROFILE_QUERY_KEY = ['auth', 'profile'] as const;

export const getAuthProfile = async (): Promise<TAuthProfile> => {
  const resp = await http.get<TApiResponse<TAuthProfile>>('/auth/me');
  return resp.data.data;
};

/**
 * Login
 * @returns
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

export const useAuthLogin = () => {
  const queryClient = useQueryClient();
  const setCredential = useAuthStore((state) => state.setCredential);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return authLoginMutation({
    onSuccess: async (response) => {
      setCredential(response.data.access_token);

      // Ensure profile cache is refreshed for the current session.
      queryClient.removeQueries({
        queryKey: AUTH_PROFILE_QUERY_KEY,
        exact: true,
      });

      try {
        const profile = await queryClient.fetchQuery({
          queryKey: AUTH_PROFILE_QUERY_KEY,
          queryFn: getAuthProfile,
          staleTime: 1000 * 60 * 5,
        });
        setAuthData(profile);
      } catch (error) {
        console.error('Failed to fetch profile after login', error);
      }
    },
  });
};

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

export const useAuthProfile = createMutation<TAuthProfile, void, AxiosError>({
  mutationFn: getAuthProfile,
});

export const useAuthProfileQuery = createQuery<TAuthProfile, void, AxiosError>({
  queryKey: AUTH_PROFILE_QUERY_KEY,
  fetcher: async (_, { signal }) => {
    const resp = await http.get<TApiResponse<TAuthProfile>>('/auth/me', {
      signal,
    });
    return resp.data.data;
  },
});

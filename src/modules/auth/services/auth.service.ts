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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const AUTH_PROFILE_QUERY_KEY = ['auth', 'profile'] as const;

export const getAuthProfile = async (): Promise<TAuthProfile> => {
  const resp = await http.get<TApiResponse<TAuthProfile>>('/auth/me');
  return resp.data.data;
};

/**
 * Login
 * @returns
 */
export const useAuthLogin = () => {
  const queryClient = useQueryClient();
  const setCredential = useAuthStore((state) => state.setCredential);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return useMutation<TApiResponse<TAuthLoginResponse>, AxiosError, TAuthLogin>({
    mutationFn: async (payload) => {
      const resp = await http.post('/auth/login', payload);
      return resp.data;
    },
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

/**
 * Forgot password
 * @returns
 */
export const useAuthForgot = () => {
  return useMutation<TApiResponse<unknown>, AxiosError, TAuthForgot>({
    mutationFn: async (payload) => {
      const resp = await http.post('/auth/forgot', payload);
      return resp.data;
    },
  });
};

/**
 * Reset password
 * @returns
 */
export const useAuthReset = () => {
  return useMutation<TApiResponse<unknown>, AxiosError, TAuthReset>({
    mutationFn: async (payload) => {
      const resp = await http.post('/auth/reset', payload);
      return resp.data;
    },
  });
};

/**
 * Get profile
 * @returns
 */
export const useAuthProfile = () => {
  return useMutation<TAuthProfile, AxiosError, void>({
    mutationFn: getAuthProfile,
  });
};

export const useAuthProfileQuery = (enabled = true) => {
  return useQuery<TAuthProfile, AxiosError>({
    queryKey: AUTH_PROFILE_QUERY_KEY,
    queryFn: getAuthProfile,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

import type { TApiResponse } from '@/modules/app/types/api.type';
import type {
  TAuthForgot,
  TAuthLogin,
  TAuthLoginResponse,
  TAuthReset,
} from '@/modules/auth/types/auth.type';
import http from '@/plugins/axios';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

/**
 * Login
 * @returns
 */
export const useAuthLogin = () => {
  return useMutation<TApiResponse<TAuthLoginResponse>, AxiosError, TAuthLogin>({
    mutationFn: async (payload) => {
      const resp = await http.post('/auth/login', payload);
      return resp.data;
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

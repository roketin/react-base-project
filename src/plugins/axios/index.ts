import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { TApiResponse } from '@/modules/app/types/api.type';
import useAuthStore from '@/modules/auth/stores/auth.store';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    config.headers = config.headers ?? {};

    // Get authentication state from store
    const authStore = useAuthStore.getState();

    if (authStore.isAuthenticated?.() && config.url !== '/auth/refresh') {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
  },
  (error) => error,
);

type ErrorRes = TApiResponse<unknown> | { errors: string[] };

http.interceptors.response.use(
  undefined,
  async (error: AxiosError): Promise<AxiosError> => {
    const { response } = error;
    const responseData = response?.data as ErrorRes;

    /**
     * Handling all error to global alert
     */
    if (response?.status !== 401) {
      const message =
        'errors' in responseData
          ? responseData.errors.join('\n')
          : responseData.message;

      toast.error('Information', {
        description: message ?? 'Something error ..',
      });
    }

    /**
     * Handling 401 and refresh token
     * Uncomment if the application need handling refresh token
     */

    // const originalRequest = config as InternalAxiosRequestConfig & {
    //   _retry: boolean;
    // };
    // if (response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   try {
    //     const authStore = useAuthStore.getState();

    //     const {
    //       data: { access_token, refresh_token },
    //     } = await useAuthRefreshToken.mutationFn(authStore.refreshToken);

    //     authStore.setCredential(access_token, refresh_token);

    //     originalRequest.headers.Authorization = `Bearer ${access_token}`;
    //     return axios(originalRequest as InternalAxiosRequestConfig);
    //   } catch {
    //     useAuthStore.getState().clearCredential();
    //     return Promise.reject(error);
    //   }
    // }

    return Promise.reject(error);
  },
);

export default http;

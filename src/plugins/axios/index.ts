import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { TApiResponse } from '@/modules/app/types/api.type';
import useAuthStore from '@/modules/auth/stores/auth.store';
import roketinConfig from '@config';
import { showToast } from '@/modules/app/libs/toast-utils';

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

    const lang = localStorage.getItem(roketinConfig.app.shortName + '-lang');
    if (lang) {
      config.params = config.params ?? {};
      config.params.lang = lang;
    }

    config.headers['ngrok-skip-browser-warning'] = '9090';

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
     * Check if request is from login endpoint
     */
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const isLoginEndpoint = originalRequest.url?.includes('/v1/auth/login');

    /**
     * Handling all error to global alert
     * Show toast for all errors except 401 from non-login endpoints (will be handled by refresh token)
     */
    const shouldShowToast = response?.status !== 401 || isLoginEndpoint;

    if (shouldShowToast) {
      const message =
        'errors' in responseData
          ? responseData.errors.join('\n')
          : responseData.message;

      showToast.error({
        title: 'Information',
        description: message ?? 'Something error ..',
        duration: 2000,
      });
    }

    /**
     * Handling 401 and refresh token
     * Exclude login endpoint to prevent infinite loop
     */
    if (
      response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore.getState();

        // Call refresh token API dengan access token yang expired
        const resp = await http.post<
          TApiResponse<{
            access_token: string;
            refresh_token: string;
          }>
        >('/v1/auth/refresh-token');

        const { access_token, refresh_token } = resp.data.data;

        authStore.setCredential(access_token, refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest as InternalAxiosRequestConfig);
      } catch {
        useAuthStore.getState().clearCredential();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default http;

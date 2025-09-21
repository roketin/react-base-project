import { cookieStorage } from '@/modules/app/libs/cookie-storage';
import type { TAuthProfile, TAuthStore } from '@/modules/auth/types/auth.type';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useAuthStore = create<Partial<TAuthStore>>()(
  devtools(
    persist(
      (set, get) => ({
        token: '',

        refreshToken: '',

        authData: null,

        isAuthenticated: () => !!get().token,

        setCredential(token: string, refreshToken: string) {
          set({
            token,
            refreshToken,
          });
        },

        clearCredential() {
          set({
            token: '',
            refreshToken: '',
            authData: null,
          });
        },

        setAuthData(data: TAuthProfile) {
          set({
            authData: data,
          });
        },
      }),
      {
        name: '@cred',
        storage: cookieStorage,
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
        }),
      },
    ),
    {
      enabled: import.meta.env.DEV,
    },
  ),
);

export default useAuthStore;

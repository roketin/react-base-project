import { cookieStorage } from '@/modules/app/libs/cookie-storage';
import type { TAuthProfile, TAuthStore } from '@/modules/auth/types/auth.type';
import { useAdaptiveSearchStore } from '@/modules/adaptive-search';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import roketinConfig from '@config';

const useAuthStore = create<TAuthStore>()(
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
          // Clear userId from adaptive search tracking
          useAdaptiveSearchStore.getState().setUserId(undefined);
        },

        setAuthData(data: TAuthProfile) {
          set({
            authData: data,
          });
          // Set userId for adaptive search tracking
          useAdaptiveSearchStore.getState().setUserId(data.id);
        },
      }),
      {
        name: roketinConfig.app.shortName + '-session',
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

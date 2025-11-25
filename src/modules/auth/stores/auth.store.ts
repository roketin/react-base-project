import { cookieStorage } from '@/modules/app/libs/cookie-storage';
import type { TAuthProfile, TAuthStore } from '@/modules/auth/types/auth.type';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import roketinConfig from '@config';

const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        token: '',
        authData: null,

        isAuthenticated: () => !!get().token,

        setCredential(token: string) {
          set({
            token,
          });
        },

        clearCredential() {
          set({
            token: '',
            authData: null,
          });
          // Clear userId from global search tracking
          useGlobalSearchStore.getState().setUserId(undefined);
        },

        setAuthData(data: TAuthProfile) {
          set({
            authData: data,
          });
          // Set userId for global search tracking
          useGlobalSearchStore.getState().setUserId(data.id);
        },
      }),
      {
        name: roketinConfig.app.shortName + '-session',
        storage: cookieStorage,
        partialize: (state) => ({
          token: state.token,
        }),
      },
    ),
    {
      enabled: import.meta.env.DEV,
    },
  ),
);

export default useAuthStore;

import { defineRoketinConfig } from './src/modules/app/types/app.type';

export default defineRoketinConfig({
  app: {
    name: 'R-Skeleton',
    shortName: 'RSkeleton',
    tagline: 'Roketin App Skeleton',
  },
  theme: {
    appearance: 'system',
    sidebar: {
      variant: 'sidebar',
      width: 280,
    },
  },
  sidebar: {
    settings: {
      stateStorage: {
        type: 'local-storage',
        key: 'sidebar_state',
      },
      width: '16rem',
      widthMobile: '18rem',
      widthIcon: '3rem',
      keyboardShortcut: 'b',
    },
  },
  filters: {
    persistence: {
      enabled: true,
      strategy: 'local-storage',
      keyPrefix: 'filter_',
      debounceMs: 200,
    },
  },
  routes: {
    admin: {
      basePath: '/r-admin',
    },
  },
  languages: {
    enabled: true,
    supported: [
      { code: 'en', label: 'English', isDefault: true },
      { code: 'id', label: 'Bahasa Indonesia' },
    ],
  },
});

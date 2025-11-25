import { defineRoketinConfig } from './src/modules/app/types/app.type';

/**
 * Application configuration settings.
 * @property {string} name - The full name of the application.
 * @property {string} shortName - A shorter name for the application.
 * @property {string} tagline - A brief tagline or description of the application.
 */
export default defineRoketinConfig({
  app: {
    name: 'R-Skeleton',
    shortName: 'RSkeleton',
    tagline: 'Roketin App Skeleton',
  },

  /**
   * Sidebar behavior and layout configuration.
   * @property {object} settings - Configuration for sidebar settings.
   * @property {object} settings.stateStorage - Defines how sidebar state is persisted.
   * @property {string} settings.stateStorage.type - Storage type for sidebar state (e.g., 'local-storage').
   * @property {string} settings.stateStorage.key - Key used for storing sidebar state.
   * @property {string} settings.width - Width of the sidebar on desktop.
   * @property {string} settings.widthMobile - Width of the sidebar on mobile devices.
   * @property {string} settings.widthIcon - Width reserved for sidebar icons.
   * @property {string} settings.keyboardShortcut - Keyboard shortcut key to toggle sidebar.
   */
  sidebar: {
    settings: {
      stateStorage: {
        type: 'local-storage',
        key: 'sidebar_state',
      },
      width: '16rem',
      widthMobile: '20rem',
      widthIcon: '4rem',
      keyboardShortcut: 'b',
    },
  },

  /**
   * Filter persistence settings.
   * @property {boolean} enabled - Flag to enable or disable filter persistence.
   * @property {string} strategy - Strategy used to persist filters (e.g., 'local-storage').
   * @property {string} keyPrefix - Prefix for keys used in storage.
   * @property {number} debounceMs - Debounce time in milliseconds for filter persistence.
   */
  filters: {
    persistence: {
      enabled: true,
      strategy: 'local-storage',
      keyPrefix: 'filter_',
      debounceMs: 200,
    },
  },

  /**
   * Routes configuration for different parts of the application.
   * @property {object} admin - Configuration specific to admin routes.
   * @property {string} admin.basePath - Base URL path for admin routes.
   */
  routes: {
    admin: {
      basePath: '/r-admin',
    },
  },

  /**
   * Language support configuration.
   * @property {boolean} enabled - Flag to enable or disable multi-language support.
   * @property {Array} supported - List of supported languages.
   * @property {string} supported[].code - Language code (e.g., 'en', 'id').
   * @property {string} supported[].label - Display name of the language.
   * @property {boolean} [supported[].isDefault] - Indicates if this language is the default.
   */
  languages: {
    enabled: true,
    debug: false,
    // debug: import.meta.env.DEV,
    supported: [
      { code: 'en', label: 'English', isDefault: true },
      { code: 'id', label: 'Bahasa Indonesia' },
    ],
  },

  /**
   * Global search configuration.
   * @property {boolean} enabled - Flag to enable or disable global search functionality.
   */
  search: {
    enableSearchGlobal: true,
  },
});

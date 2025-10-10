import type { LucideIcon } from 'lucide-react';
import type { TPermission } from '@/modules/app/constants/permission.constant';

export type TRoketinSidebarMenuItem = {
  title: string;
  icon?: LucideIcon;
  name?: string;
  permission?: TPermission | TPermission[];
  children?: TRoketinSidebarMenuItem[];
};

export type TRoketinSidebarSettings = {
  stateStorage?: {
    type: 'local-storage' | 'session-storage';
    key?: string;
  };
  width?: string | number;
  widthMobile?: string | number;
  widthIcon?: string | number;
  keyboardShortcut?: string;
};

export type TRoketinThemeConfig = {
  appearance?: 'light' | 'dark' | 'system';
  sidebar?: {
    variant?: 'sidebar' | 'floating' | 'inset';
    width?: number;
  };
  [key: string]: unknown;
};

export type TRoketinAppConfig = {
  name: string;
  shortName?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
};

export type TRoketinFilterPersistenceConfig =
  | { enabled: false }
  | {
      enabled: true;
      strategy: 'local-storage' | 'session-storage' | 'query-params';
      keyPrefix?: string;
      debounceMs?: number;
    };

export type TRoketinFiltersConfig = {
  persistence: TRoketinFilterPersistenceConfig;
};

export type TRoketinRoutesConfig = {
  admin?: {
    basePath: string;
  };
};

export type TRoketinLanguageConfig = {
  code: string;
  label: string;
  isDefault?: boolean;
};

export type TRoketinLanguagesConfig = {
  enabled: boolean;
  debug: boolean;
  supported: ReadonlyArray<TRoketinLanguageConfig>;
};

export type TRoketinSidebarConfig = {
  settings?: TRoketinSidebarSettings;
};

export type TRoketinConfig = {
  app: TRoketinAppConfig;
  theme?: TRoketinThemeConfig;
  sidebar: TRoketinSidebarConfig;
  filters?: TRoketinFiltersConfig;
  routes?: TRoketinRoutesConfig;
  languages?: TRoketinLanguagesConfig;
};

export function defineRoketinConfig<TConfig extends TRoketinConfig>(
  config: TConfig,
): TConfig {
  return config;
}

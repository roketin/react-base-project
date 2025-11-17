import { create } from 'zustand';
import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';
import type { TBreadcrumbItem } from '@/modules/app/types/page-config.type';
import type { TPermission } from '@/modules/app/constants/permission.constant';
import type { TLocale } from '@/modules/app/types/locale.type';

export type TResolvedPageConfig = {
  title?: TLocale | string;
  breadcrumbs?: TBreadcrumbItem[];
  permissions?: TPermission[];
  featureFlag?: FeatureFlagKey;
};

type TPageConfigStore = {
  current?: TResolvedPageConfig;
  setPageConfig: (config?: TResolvedPageConfig) => void;
};

export const useOverridePageConfigStore = create<TPageConfigStore>((set) => ({
  current: undefined,
  setPageConfig: (config) => set({ current: config }),
}));

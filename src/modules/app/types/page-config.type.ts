import type { TPermission } from '@/modules/app/constants/permission.constant';
import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';
import type { TLocale } from '@/modules/app/types/locale.type';

export type TBreadcrumbItem = {
  label: TLocale | string;
  href?: string;
};

export type TPageConfigContext = {
  params: Record<string, string | undefined>;
  pathname: string;
  segments: string[];
};

export type TBreadcrumbDefinition =
  | TBreadcrumbItem[]
  | ((ctx: TPageConfigContext) => TBreadcrumbItem[]);

export type TPageConfig = {
  title?: TLocale | string;
  breadcrumbs?: TBreadcrumbDefinition;
  permissions?: TPermission | TPermission[];
  featureFlag?: FeatureFlagKey;
};

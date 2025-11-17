import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';

export type TModuleConfig = {
  moduleId: string;
  parentModuleId?: string;
  featureFlag?: FeatureFlagKey;
  menu?: TSidebarMenu | TSidebarMenu[] | false;
};

export function defineModuleConfig<TConfig extends TModuleConfig>(
  config: TConfig,
): TConfig {
  return config;
}

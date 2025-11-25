import type { TPermission } from '@/modules/app/constants/permission.constant';
import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';
import type { LucideIcon } from 'lucide-react';

export type TModuleActionDefinition = {
  id: string;
  titleKey: string;
  badge: string;
  icon?: LucideIcon;
  permission?: TPermission | TPermission[];
  keywords?: string[];
  // Navigation options (mutually exclusive with onExecute)
  routeName?: string;
  queryParams?: Record<string, string>;
  // Custom execution (mutually exclusive with routeName)
  onExecute?: () => void;
};

// Deprecated: Use TModuleActionDefinition instead
export type TModuleCommandDefinition = TModuleActionDefinition;

export type TModuleConfig = {
  moduleId: string;
  parentModuleId?: string;
  featureFlag?: FeatureFlagKey;
  menu?: TSidebarMenu | TSidebarMenu[] | false;
  actions?: TModuleActionDefinition[];
  // Deprecated: Use actions instead
  commands?: TModuleCommandDefinition[];
};

export function defineModuleConfig<TConfig extends TModuleConfig>(
  config: TConfig,
): TConfig {
  return config;
}

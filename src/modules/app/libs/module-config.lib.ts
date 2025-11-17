import { isFeatureEnabled } from '@/modules/app/libs/feature-flag';
import type { TModuleConfig } from '@/modules/app/types/module-config.type';

const moduleConfigModules = import.meta.glob<Record<string, unknown>>(
  '@/modules/**/*.config.ts',
  {
    eager: true,
  },
);

function isModuleConfig(value: unknown): value is TModuleConfig {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<TModuleConfig>;
  const menu = candidate.menu;
  const hasMenu =
    menu === undefined ||
    menu === false ||
    Array.isArray(menu) ||
    typeof menu === 'object';

  return typeof candidate.moduleId === 'string' && hasMenu;
}

function extractModuleConfigs(module: Record<string, unknown>) {
  const configs: TModuleConfig[] = [];
  const seen = new Set<TModuleConfig>();

  for (const key of Object.keys(module)) {
    if (key === '__esModule') continue;
    const candidate = module[key];
    if (isModuleConfig(candidate) && !seen.has(candidate)) {
      seen.add(candidate);
      configs.push(candidate);
    }
  }

  return configs;
}

function loadModuleConfigs(): TModuleConfig[] {
  const configs: TModuleConfig[] = [];
  const modulePaths = Object.keys(moduleConfigModules).sort();

  for (const path of modulePaths) {
    const mod = moduleConfigModules[path];
    configs.push(...extractModuleConfigs(mod));
  }

  return configs;
}

export const APP_MODULE_CONFIGS: TModuleConfig[] = loadModuleConfigs().filter(
  (config) => isFeatureEnabled(config.featureFlag),
);

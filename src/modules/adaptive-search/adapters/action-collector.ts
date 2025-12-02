import type {
  TAdaptiveSearchConfig,
  TSearchActionDefinition,
  TApiMappingConfig,
} from '../types/adaptive-search.type';

/**
 * Auto-discover and collect all adaptive search configs
 * Pattern: /src/modules/**\/*.config.search.ts
 */
export function collectAdaptiveSearchConfigs(): TAdaptiveSearchConfig[] {
  const modules = import.meta.glob<{ default: TAdaptiveSearchConfig }>(
    '/src/modules/**/*.config.search.ts',
    { eager: true },
  );

  const configs: TAdaptiveSearchConfig[] = [];

  for (const path in modules) {
    const module = modules[path];

    if (module.default) {
      configs.push(module.default);
    } else {
      console.warn(`[Adaptive Search] Invalid config at ${path}`);
    }
  }

  return configs;
}

/**
 * Get all static actions from configs
 */
export function collectSearchActions(): TSearchActionDefinition[] {
  const configs = collectAdaptiveSearchConfigs();
  const actions = configs.flatMap((config) => config.actions || []);

  return actions;
}

/**
 * Get all API mapping configs
 */
export function collectApiMappingConfigs(): TApiMappingConfig[] {
  const configs = collectAdaptiveSearchConfigs();
  const mappings = configs
    .filter((config) => config.apiMapping)
    .map((config) => config.apiMapping!);

  return mappings;
}

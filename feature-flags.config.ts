export type FeatureFlagDefinition = {
  env?: string;
  description?: string;
  defaultEnabled?: boolean;
};

export function defineFeatureFlags<
  TFlags extends Record<string, FeatureFlagDefinition>,
>(flags: TFlags): TFlags {
  return flags;
}

const featureFlags = defineFeatureFlags({
  DASHBOARD: {
    env: 'VITE_FEATURE_DASHBOARD',
    description: 'Dashboard module visibility.',
    defaultEnabled: true,
  },
  SAMPLE_FORM: {
    env: 'VITE_FEATURE_SAMPLE_FORM',
    description: 'Sample form module visibility.',
    defaultEnabled: true,
  },
  CONFIG: {
    env: 'VITE_FEATURE_CONFIG',
    description: 'Config module visibility.',
    defaultEnabled: true,
  },
  CONFIG_USER: {
    env: 'VITE_FEATURE_CONFIG_USER',
    description: 'Config User module visibility.',
    defaultEnabled: true,
  },
  CONFIG_ROLE: {
    env: 'VITE_FEATURE_CONFIG_ROLE',
    description: 'Config Role module visibility.',
    defaultEnabled: true,
  },
});

export type FeatureFlagKey = keyof typeof featureFlags;

export default featureFlags;

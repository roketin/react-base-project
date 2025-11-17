import featureFlags, {
  type FeatureFlagDefinition,
  type FeatureFlagKey,
} from '@feature-flags';

type FeatureFlagEnv = ImportMetaEnv & {
  [key: string]: string | boolean | undefined;
};

const ENV_FALLBACK_PREFIX = 'VITE_FEATURE_';

function getEnvKey(flag: FeatureFlagKey) {
  const definition = featureFlags[flag];
  return definition?.env ?? `${ENV_FALLBACK_PREFIX}${flag}`;
}

function readEnvValue(flag: FeatureFlagKey) {
  const env = import.meta.env as FeatureFlagEnv;
  const envKey = getEnvKey(flag);
  return env?.[envKey];
}

function normalizeBooleanValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on', 'enabled'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off', 'disabled'].includes(normalized)) {
    return false;
  }
  return undefined;
}

/**
 * Evaluates whether a feature flag is enabled.
 * Uses flag definitions from `feature-flags.config.ts` and falls back to
 * defaultEnabled when the env variable is not set.
 */
export function isFeatureEnabled(flag?: FeatureFlagKey): boolean {
  if (!flag) return true;

  const definition = featureFlags[flag];
  if (!definition) return true;

  const rawValue = readEnvValue(flag);
  if (typeof rawValue === 'boolean') {
    return rawValue;
  }
  if (typeof rawValue === 'string') {
    const normalized = normalizeBooleanValue(rawValue);
    if (normalized !== undefined) {
      return normalized;
    }
  }

  return definition.defaultEnabled ?? true;
}

export function getFeatureFlagDefinition(
  flag: FeatureFlagKey,
): FeatureFlagDefinition | undefined {
  return featureFlags[flag];
}

export function getAllFeatureFlags() {
  return featureFlags;
}

export type { FeatureFlagKey, FeatureFlagDefinition } from '@feature-flags';

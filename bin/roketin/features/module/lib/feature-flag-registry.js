import fs from 'fs';
import path from 'path';
import { logger } from '../../../lib/logger.js';

const FEATURE_FLAGS_FILE = path.resolve(
  process.cwd(),
  'feature-flags.config.ts',
);
const DEFINE_FLAGS_MARKER = 'const featureFlags = defineFeatureFlags({';

export function registerFeatureFlag({ featureFlagKey, moduleParts }) {
  if (!featureFlagKey) return;
  if (!fs.existsSync(FEATURE_FLAGS_FILE)) {
    logger.warn(
      '⚠️ feature-flags.config.ts not found; skipping flag registration.',
    );
    return;
  }

  const source = fs.readFileSync(FEATURE_FLAGS_FILE, 'utf8');
  if (source.includes(`${featureFlagKey}:`)) {
    logger.info(`ℹ️ Feature flag ${featureFlagKey} already exists.`);
    return;
  }

  const markerIndex = source.indexOf(DEFINE_FLAGS_MARKER);
  if (markerIndex === -1) {
    logger.warn('⚠️ Unable to locate defineFeatureFlags block.');
    return;
  }

  const closingIndex = source.indexOf(
    '});',
    markerIndex + DEFINE_FLAGS_MARKER.length,
  );
  if (closingIndex === -1) {
    logger.warn('⚠️ Unable to insert feature flag definition.');
    return;
  }

  const description = buildFlagDescription(moduleParts);
  const flagEntry = `  ${featureFlagKey}: {
    env: 'VITE_FEATURE_${featureFlagKey}',
    description: '${description}',
    defaultEnabled: true,
  },
`;

  const updatedSource =
    source.slice(0, closingIndex) + flagEntry + source.slice(closingIndex);

  fs.writeFileSync(FEATURE_FLAGS_FILE, updatedSource);
  logger.info(
    `✅ Registered feature flag ${featureFlagKey} in feature-flags.config.ts`,
  );
}

function buildFlagDescription(moduleParts) {
  const readable = moduleParts
    .map((part) =>
      part
        .split('-')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' '),
    )
    .join(' ');

  return `${readable} module visibility.`;
}

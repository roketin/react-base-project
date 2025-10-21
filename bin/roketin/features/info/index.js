import {
  getGeneratorChoices,
  getGeneratorPresets,
  getGeneratorTypes,
  getRestrictedModules,
} from '../module/config/index.js';
import { logger } from '../../lib/logger.js';
import { cliVersion } from '../../lib/version.js';

export default function infoFeature() {
  const presets = getGeneratorPresets();
  const generators = getGeneratorTypes();
  const restrictedModules = Array.from(getRestrictedModules());
  const choices = getGeneratorChoices();

  logger.info(`📦 Roketin CLI Information (v${cliVersion})`);
  logger.info('--------------------------');
  logger.info(
    `Restricted modules: ${restrictedModules.join(', ') || '(none)'}`,
  );
  logger.info('Presets:');
  Object.entries(presets).forEach(([name, items]) => {
    logger.info(`  - ${name}: ${items.join(', ')}`);
  });
  logger.info('Available generators:');
  Object.entries(generators).forEach(([key, value]) => {
    logger.info(`  - ${key}${value.label ? ` (${value.label})` : ''}`);
  });
  logger.info('Prompt choices:');
  choices.forEach((choice) => {
    logger.info(`  - ${choice.value}: ${choice.name}`);
  });
}

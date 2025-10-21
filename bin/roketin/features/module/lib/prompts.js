import fs from 'fs';
import { select, checkbox, confirm } from '@inquirer/prompts';
import { logger } from '../../../lib/logger.js';
import { getGeneratorChoices, getGeneratorPresets } from '../config/index.js';

export async function promptOverwriteIfNeeded(basePath) {
  if (!fs.existsSync(basePath)) {
    return false;
  }

  const overwrite = await confirm({
    message: `The folder '${basePath}' already exists. Overwrite existing files?`,
    default: false,
  });

  if (!overwrite) {
    logger.info('🚫 Aborted by user.');
    process.exit(0);
  }

  return true;
}

export async function promptGenerationTypes(typeConfigs) {
  const presets = getGeneratorPresets();
  const choice = await select({
    message: 'Select the module type to generate:',
    choices: getGeneratorChoices(),
  });

  if (choice === 'all') {
    return Object.keys(typeConfigs);
  }

  if (presets[choice]) {
    return presets[choice];
  }

  const customSelected = await checkbox({
    message: 'Select folders/files to generate:',
    choices: Object.keys(typeConfigs),
    loop: false,
  });

  return customSelected;
}

export async function confirmNestedModule(modulePath, moduleName) {
  return confirm({
    message: `The path '${modulePath}' is nested. Treat '${moduleName}' as a child module?`,
    default: true,
  });
}

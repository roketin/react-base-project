import { logger } from '../../lib/logger.js';
import { ensureDirExists } from '../../lib/fs-utils.js';
import {
  promptGenerationTypes,
  promptOverwriteIfNeeded,
  confirmNestedModule,
} from './lib/prompts.js';
import { sanitizeModulePath, buildModuleBasePath } from './lib/paths.js';
import { generateArtifacts, getTypeConfigs } from './lib/artifact-generator.js';

export default async function moduleFeature({ command, args }) {
  const [rawModulePath] = args;

  if (!rawModulePath) {
    logger.error('❌ Usage: pnpm roketin module <module_path>');
    process.exit(1);
  }

  let moduleParts;
  try {
    moduleParts = sanitizeModulePath(rawModulePath);
  } catch (error) {
    logger.error(`❌ ${error.message}`);
    process.exit(1);
  }

  const moduleName = moduleParts[moduleParts.length - 1];
  const basePath = buildModuleBasePath(moduleParts);
  const allowOverwrite = await promptOverwriteIfNeeded(basePath);
  ensureDirExists(basePath);

  let isChild = command === 'module-child';
  if (!isChild && moduleParts.length > 1) {
    const treatAsChild = await confirmNestedModule(rawModulePath, moduleName);
    isChild = treatAsChild;
  }

  const typeConfigs = getTypeConfigs();
  const selectedTypes = await promptGenerationTypes(typeConfigs);
  if (selectedTypes.length === 0) {
    logger.info('🔵 No generator selected. Nothing to do.');
    process.exit(0);
  }

  generateArtifacts({
    basePath,
    moduleName,
    moduleParts,
    types: selectedTypes,
    isChild,
    overwrite: allowOverwrite,
  });
}

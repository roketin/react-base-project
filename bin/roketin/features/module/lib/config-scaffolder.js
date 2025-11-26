import path from 'path';
import {
  ensureDirExists,
  fileExists,
  writeFile,
} from '../../../lib/fs-utils.js';
import { moduleConfigTemplate } from '../templates/config.js';
import { localeTemplate } from '../templates/locale.js';
import { buildModuleBasePath } from './paths.js';
import { buildFeatureFlagKey } from './module-meta.js';
import { registerFeatureFlag } from './feature-flag-registry.js';
import { logCreated } from '../../../lib/logger.js';

export function ensureAncestorConfigs({ moduleParts, overwrite }) {
  if (moduleParts.length <= 1) return;

  for (let i = 0; i < moduleParts.length - 1; i++) {
    const ancestorParts = moduleParts.slice(0, i + 1);
    const basePath = buildModuleBasePath(ancestorParts);
    ensureDirExists(basePath);

    const configFileName = `${ancestorParts[ancestorParts.length - 1]}.config.ts`;
    const filePath = path.join(basePath, configFileName);

    if (fileExists(filePath)) continue;

    const moduleId = ancestorParts.join('-');
    const featureFlagKey = buildFeatureFlagKey(ancestorParts);
    const content = moduleConfigTemplate({
      moduleId,
      featureFlagKey,
      moduleParts: ancestorParts,
      isChild: ancestorParts.length > 1,
    });

    writeFile(filePath, content, true);
    registerFeatureFlag({ featureFlagKey, moduleParts: ancestorParts });
    logCreated(filePath, false);
  }
}

export function ensureAncestorLocales({ moduleParts }) {
  if (moduleParts.length <= 1) return;

  for (let i = 0; i < moduleParts.length - 1; i++) {
    const ancestorParts = moduleParts.slice(0, i + 1);
    const basePath = buildModuleBasePath(ancestorParts);
    const localesDir = path.join(basePath, 'locales');
    ensureDirExists(localesDir);

    const moduleName = ancestorParts[ancestorParts.length - 1];
    const localeFileName = `${moduleName}.en.json`;
    const filePath = path.join(localesDir, localeFileName);

    if (fileExists(filePath)) continue;

    const content = localeTemplate({ moduleName });
    writeFile(filePath, content, true);
    logCreated(filePath, false);
  }
}

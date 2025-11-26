import path from 'path';
import {
  ensureDirExists,
  writeFile,
  fileExists,
} from '../../../lib/fs-utils.js';
import {
  ensureAncestorRouteScaffolds,
  injectChildRoutesIntoParent,
} from './routing.js';
import { logCreated, logSkipped, logger } from '../../../lib/logger.js';
import { getGeneratorTypes } from '../config/index.js';
import { buildFeatureFlagKey, buildModuleId } from './module-meta.js';
import { registerFeatureFlag } from './feature-flag-registry.js';
import {
  ensureAncestorConfigs,
  ensureAncestorLocales,
} from './config-scaffolder.js';

export function getTypeConfigs() {
  return getGeneratorTypes();
}

export function generateArtifacts({
  basePath,
  moduleName,
  moduleParts,
  types,
  isChild,
  overwrite,
}) {
  const typeConfigs = getGeneratorTypes();
  const moduleId = buildModuleId(moduleParts);
  const featureFlagKey = buildFeatureFlagKey(moduleParts);

  types.forEach((type) => {
    const config = typeConfigs[type];

    if (!config) {
      logger.warn(`⚠️ Unknown generator type: ${type}`);
      return;
    }

    const targetDir = config.folder
      ? path.join(basePath, config.folder)
      : basePath;
    ensureDirExists(targetDir);

    const context = {
      moduleName,
      moduleParts,
      isChild,
      basePath,
      overwrite,
      moduleId,
      featureFlagKey,
    };

    const fileName = config.getFileName(context);
    const filePath = path.join(targetDir, fileName);
    const content = config.getContent({ ...context, filePath });

    if (content === null) {
      logSkipped(filePath);
      return;
    }

    const existed = fileExists(filePath);
    const written = writeFile(filePath, content, overwrite);

    if (!written) {
      logSkipped(filePath);
      return;
    }

    logCreated(filePath, existed);

    if (type === 'route' && isChild) {
      const ancestorScaffolds = ensureAncestorRouteScaffolds({
        moduleParts,
        overwrite,
      });

      ancestorScaffolds
        .filter((scaffold) => scaffold.isChild)
        .forEach((scaffold) => {
          injectChildRoutesIntoParent({
            moduleName: scaffold.moduleName,
            moduleParts: scaffold.moduleParts,
            childRouteFilePath: scaffold.routeFilePath,
          });
        });

      injectChildRoutesIntoParent({
        moduleName,
        moduleParts,
        childRouteFilePath: filePath,
      });
    }

    if (type === 'config') {
      ensureAncestorConfigs({ moduleParts, overwrite });
      registerFeatureFlag({
        featureFlagKey,
        moduleParts,
      });
    }

    if (type === 'locale') {
      ensureAncestorLocales({ moduleParts });
    }
  });
}

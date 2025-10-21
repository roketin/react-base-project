import path from 'path';
import { sanitizeFolderName } from '../../../lib/utils.js';
import { getRestrictedModules } from '../config/index.js';

export function sanitizeModulePath(rawPath) {
  const segments = rawPath
    .split('/')
    .map((segment) => sanitizeFolderName(segment))
    .filter(Boolean);

  if (segments.length === 0) {
    throw new Error('Module path is invalid.');
  }

  const restrictedModules = getRestrictedModules();

  if (segments.some((segment) => restrictedModules.has(segment))) {
    throw new Error(
      'You cannot create a module inside restricted folders: auth, app, or dashboard.',
    );
  }

  return segments;
}

export function buildModuleBasePath(parts) {
  const segments = ['./src/modules'];
  parts.forEach((segment, index) => {
    if (index === 0) {
      segments.push(segment);
    } else {
      segments.push('modules', segment);
    }
  });
  return path.resolve(...segments);
}

export function resolveGlobParentRoute(moduleParts) {
  const parentParts = moduleParts.slice(0, -1);
  return parentParts.length > 0 ? parentParts : null;
}

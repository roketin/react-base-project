import fs from 'fs';
import path from 'path';
import { ensureDirExists } from '../../../lib/fs-utils.js';
import { buildModuleBasePath } from './paths.js';
import { camelCase, kebabCase } from '../../../lib/utils.js';
import {
  createRouteTemplateParts,
  createScaffoldRouteContent,
} from '../templates/shared/route-helpers.js';
import { logger } from '../../../lib/logger.js';
import { getGeneratorTypes } from '../config/index.js';

export function ensureAncestorRouteScaffolds({ moduleParts, overwrite }) {
  const scaffolds = [];
  for (let depth = 1; depth < moduleParts.length; depth += 1) {
    const ancestorParts = moduleParts.slice(0, depth);
    const scaffold = ensureRouteScaffold({
      moduleParts: ancestorParts,
      overwrite,
    });
    if (scaffold) {
      scaffolds.push(scaffold);
    }
  }
  return scaffolds;
}

export function ensureRouteScaffold({ moduleParts, overwrite }) {
  const moduleName = moduleParts.at(-1);
  if (!moduleName) {
    return null;
  }

  const isChild = moduleParts.length > 1;
  const basePath = buildModuleBasePath(moduleParts);
  ensureDirExists(basePath);

  const routeConfig = getGeneratorTypes().route;
  const routeContext = {
    moduleName,
    moduleParts,
    isChild,
    basePath,
    overwrite,
  };

  const routesDir = path.join(basePath, routeConfig.folder);
  ensureDirExists(routesDir);

  const routeFileName = routeConfig.getFileName(routeContext);
  const routeFilePath = path.join(routesDir, routeFileName);

  let routeCreated = false;

  if (!fs.existsSync(routeFilePath)) {
    const content =
      routeConfig.getContent({
        ...routeContext,
        filePath: routeFilePath,
        autoScaffold: true,
      }) ??
      createScaffoldRouteContent({
        moduleName,
        moduleParts,
        isChild,
      });

    if (typeof content === 'string') {
      fs.writeFileSync(routeFilePath, content);
      logger.success(`🟢 Created parent route scaffold: ${routeFilePath}`);
      routeCreated = true;
    }
  }

  return {
    moduleParts,
    moduleName,
    isChild,
    routeFilePath,
    routeCreated,
  };
}

export function injectChildRoutesIntoParent({
  moduleName,
  moduleParts,
  childRouteFilePath,
}) {
  if (moduleParts.length < 2) {
    logger.info(
      '🔵 Skipped auto-link: no parent module detected for child route.',
    );
    return;
  }

  const parentParts = moduleParts.slice(0, -1);
  const parentBasePath = buildModuleBasePath(parentParts);
  const parentRouteDir = path.join(parentBasePath, 'routes');
  const parentRouteFileBase = kebabCase(parentParts.at(-1));
  const candidateFiles = [
    path.join(parentRouteDir, `${parentRouteFileBase}.routes.tsx`),
    path.join(parentRouteDir, `${parentRouteFileBase}.routes.child.tsx`),
  ];
  const parentRouteFilePath = candidateFiles.find((candidate) =>
    fs.existsSync(candidate),
  );

  if (!parentRouteFilePath) {
    logger.warn(
      `🔶 Skipped auto-link: parent route file not found. Looked in ${candidateFiles.join(
        ', ',
      )}`,
    );
    return;
  }

  const routeDir = path.dirname(parentRouteFilePath);
  const relativePathToChild = path.relative(routeDir, childRouteFilePath);
  const normalizedRelativePath = normalizeImportPath(relativePathToChild);

  const childRoutesIdentifier = `${camelCase(moduleName)}ChildRoutes`;
  const importStatement = `import { ${childRoutesIdentifier} } from "${normalizedRelativePath}";`;

  let parentContent = fs.readFileSync(parentRouteFilePath, 'utf8');
  let updated = false;

  if (
    !includesImport(
      parentContent,
      childRoutesIdentifier,
      normalizedRelativePath,
    )
  ) {
    parentContent = insertImportStatement(parentContent, importStatement);
    updated = true;
  }

  if (!parentContent.includes(`...${childRoutesIdentifier}`)) {
    const injectedContent = insertChildSpreadIntoParent({
      source: parentContent,
      childIdentifier: childRoutesIdentifier,
      parentParts,
    });

    if (injectedContent !== parentContent) {
      parentContent = injectedContent;
      updated = true;
    }
  }

  if (!updated) {
    logger.info(
      `🔵 Skipped auto-link: ${childRoutesIdentifier} already registered in ${parentRouteFilePath}`,
    );
    return;
  }

  fs.writeFileSync(parentRouteFilePath, parentContent);
  logger.success(`🟢 Linked child routes in ${parentRouteFilePath}`);
}

function normalizeImportPath(relativePath) {
  let formatted = relativePath.replace(/\.[tj]sx?$/, '');
  formatted = formatted.split(path.sep).join('/');
  if (!formatted.startsWith('.')) {
    formatted = `./${formatted}`;
  }
  return formatted;
}

function includesImport(source, identifier, importPath) {
  const importRegex = new RegExp(
    `import\\s*\\{[^}]*\\b${identifier}\\b[^}]*\\}\\s*from\\s*["']${importPath}["'];?`,
  );
  return importRegex.test(source);
}

function insertImportStatement(source, importStatement) {
  const lines = source.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*import\b/.test(lines[i])) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex === -1) {
    return `${importStatement}\n${source}`;
  }

  lines.splice(lastImportIndex + 1, 0, importStatement);
  return lines.join('\n');
}

function insertChildSpreadIntoParent({ source, childIdentifier, parentParts }) {
  const commentMarker = '// Add other child routes here if needed';
  if (source.includes(commentMarker)) {
    const commentIndex = source.indexOf(commentMarker);
    const lineStart = source.lastIndexOf('\n', commentIndex) + 1;
    const indentation = source.slice(lineStart, commentIndex).match(/^\s*/) ?? [
      '    ',
    ];

    const insertion = `${indentation[0]}...${childIdentifier},\n`;
    return (
      source.slice(0, commentIndex) + insertion + source.slice(commentIndex)
    );
  }

  const possiblePaths = new Set();
  const joinedParentPath = parentParts.map((part) => kebabCase(part)).join('/');

  if (joinedParentPath) {
    possiblePaths.add(joinedParentPath);
  }

  const lastParentSegment = parentParts.at(-1);
  if (lastParentSegment) {
    possiblePaths.add(kebabCase(lastParentSegment));
  }

  const targetLocation = findChildrenInsertionPoint(source, possiblePaths);
  if (!targetLocation) {
    logger.warn(
      '🔶 Skipped auto-link: unable to locate a children array in parent route file.',
    );
    return source;
  }

  const { insertionIndex, itemIndent, closingIndent } = targetLocation;
  const spreadLine = `\n${itemIndent}...${childIdentifier},\n${closingIndent}`;

  return (
    source.slice(0, insertionIndex) + spreadLine + source.slice(insertionIndex)
  );
}

function findChildrenInsertionPoint(source, paths) {
  let searchIndex = -1;

  for (const routePath of paths) {
    const candidateIndex = source.indexOf(`path: "${routePath}"`);
    if (candidateIndex !== -1) {
      searchIndex = candidateIndex;
      break;
    }
  }

  if (searchIndex === -1) {
    searchIndex = source.indexOf('children');
    if (searchIndex === -1) {
      return null;
    }
  }

  const childrenIndex = source.indexOf('children', searchIndex);
  if (childrenIndex === -1) {
    return null;
  }

  const bracketStart = source.indexOf('[', childrenIndex);
  if (bracketStart === -1) {
    return null;
  }

  let depth = 1;
  let cursor = bracketStart + 1;
  while (cursor < source.length && depth > 0) {
    const char = source[cursor];
    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
    }
    cursor += 1;
  }

  if (depth !== 0) {
    return null;
  }

  const insertionIndex = cursor - 1;

  const childrenLineStart = source.lastIndexOf('\n', childrenIndex) + 1;
  const childrenLineEnd = source.indexOf('\n', childrenIndex);
  const childrenLine =
    childrenLineEnd === -1
      ? source.slice(childrenLineStart)
      : source.slice(childrenLineStart, childrenLineEnd);
  const baseIndentMatch = childrenLine.match(/^\s*/);
  const baseIndent = baseIndentMatch ? baseIndentMatch[0] : '    ';

  const arrayBody = source.slice(bracketStart + 1, insertionIndex);
  const itemIndentMatch = arrayBody.match(/\n(\s*)\S/);
  const itemIndent = itemIndentMatch ? itemIndentMatch[1] : `${baseIndent}  `;

  const closingLineStart = source.lastIndexOf('\n', insertionIndex - 1) + 1;
  const closingIndentMatch = source
    .slice(closingLineStart, insertionIndex)
    .match(/^\s*/) ?? [baseIndent];
  const closingIndent = closingIndentMatch[0];

  return { insertionIndex, itemIndent, closingIndent };
}

import fs from 'fs';
import path from 'path';
import { logger } from '../../lib/logger.js';
import { fileExists } from '../../lib/fs-utils.js';
import { camelCase, kebabCase } from '../../lib/utils.js';
import { confirm, select } from '@inquirer/prompts';

/**
 * Build the filesystem path for a module given its parts
 */
function buildModulePath(parts) {
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

/**
 * Parse module path string into parts array
 */
function parseModulePath(modulePath) {
  return modulePath
    .split('/')
    .map((s) => kebabCase(s.trim()))
    .filter(Boolean);
}

/**
 * Find all files that import from the old module path
 */
function findFilesWithImports(oldImportPath, searchDir = './src') {
  const results = [];
  const absoluteSearchDir = path.resolve(searchDir);

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          walkDir(fullPath);
        }
      } else if (/\.(tsx?|jsx?|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(oldImportPath)) {
          results.push(fullPath);
        }
      }
    }
  }

  walkDir(absoluteSearchDir);
  return results;
}

/**
 * Update imports in a file
 */
function updateImportsInFile(filePath, oldImportPath, newImportPath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = new RegExp(escapeRegex(oldImportPath), 'g');
  const newContent = content.replace(regex, newImportPath);

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  return false;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Remove child route import and spread from parent route file
 */
function removeFromParentRoute(parentRoutePath, moduleName) {
  if (!fileExists(parentRoutePath)) return false;

  let content = fs.readFileSync(parentRoutePath, 'utf8');
  const routeIdentifier = `${camelCase(moduleName)}Routes`;

  // Remove import statement
  const importRegex = new RegExp(
    `import\\s*\\{\\s*${routeIdentifier}\\s*\\}\\s*from\\s*["'][^"']+["'];?\\n?`,
    'g',
  );
  content = content.replace(importRegex, '');

  // Remove spread from children array
  const spreadRegex = new RegExp(`\\s*\\.\\.\\.${routeIdentifier},?\\n?`, 'g');
  content = content.replace(spreadRegex, '');

  // Clean up any double commas or trailing commas before ]
  content = content.replace(/,(\s*),/g, ',');
  content = content.replace(/,(\s*)\]/g, '$1]');

  fs.writeFileSync(parentRoutePath, content);
  return true;
}

/**
 * Update route file to reflect new location (child vs standalone)
 */
function updateRouteFile(routeFilePath, isNowChild, newParentName) {
  if (!fileExists(routeFilePath)) return;

  let content = fs.readFileSync(routeFilePath, 'utf8');

  if (isNowChild) {
    // Add child route comment if not present
    if (!content.includes('CHILD ROUTE')) {
      const importEnd = content.lastIndexOf("from 'react-router-dom';");
      if (importEnd !== -1) {
        const insertPos = content.indexOf('\n', importEnd) + 1;
        const comment = `\n// This is a CHILD ROUTE (nested module).\n// Auto-linked into parent route: ${newParentName}.routes.tsx\n`;
        content =
          content.slice(0, insertPos) + comment + content.slice(insertPos);
      }
    }
  } else {
    // Remove child route comments for standalone
    content = content.replace(
      /\/\/ This is a CHILD ROUTE[^\n]*\n(\/\/[^\n]*\n)*/g,
      '',
    );
  }

  fs.writeFileSync(routeFilePath, content);
}

/**
 * Add child route import to new parent
 */
function addToParentRoute(parentRoutePath, moduleName, relativeImportPath) {
  if (!fileExists(parentRoutePath)) {
    logger.warn(`⚠️ Parent route not found: ${parentRoutePath}`);
    return false;
  }

  let content = fs.readFileSync(parentRoutePath, 'utf8');
  const routeIdentifier = `${camelCase(moduleName)}Routes`;

  // Check if already imported
  if (content.includes(routeIdentifier)) {
    logger.info(`🔵 ${routeIdentifier} already exists in parent route`);
    return false;
  }

  // Add import statement after last import
  const importStatement = `import { ${routeIdentifier} } from '${relativeImportPath}';\n`;
  const lastImportIndex = content.lastIndexOf('import ');
  const lastImportEnd = content.indexOf('\n', lastImportIndex) + 1;
  content =
    content.slice(0, lastImportEnd) +
    importStatement +
    content.slice(lastImportEnd);

  // Add spread to children array
  const childrenMatch = content.match(/children:\s*\[/);
  if (childrenMatch) {
    const insertPos = content.indexOf('[', childrenMatch.index) + 1;
    content =
      content.slice(0, insertPos) +
      `\n      ...${routeIdentifier},` +
      content.slice(insertPos);
  }

  fs.writeFileSync(parentRoutePath, content);
  return true;
}

export default async function moduleMoveFeature({ args }) {
  const [sourcePath, targetPath] = args;

  if (!sourcePath) {
    logger.error('❌ Usage: pnpm roketin module:move <source> [target]');
    logger.info('Examples:');
    logger.info('  pnpm roketin module:move master-data/client client');
    logger.info(
      '  pnpm roketin module:move master-data/client user-management/client',
    );
    logger.info('  pnpm roketin module:move client master-data/client');
    process.exit(1);
  }

  const sourceParts = parseModulePath(sourcePath);
  const moduleName = sourceParts[sourceParts.length - 1];
  const sourceDir = buildModulePath(sourceParts);

  if (!fileExists(sourceDir)) {
    logger.error(`❌ Source module not found: ${sourceDir}`);
    process.exit(1);
  }

  // Determine target
  let targetParts;
  if (targetPath) {
    targetParts = parseModulePath(targetPath);
  } else {
    // Interactive: ask where to move
    const moveType = await select({
      message: `Where do you want to move "${moduleName}"?`,
      choices: [
        { name: 'Promote to top-level module', value: 'promote' },
        { name: 'Move to another parent module', value: 'move' },
      ],
    });

    if (moveType === 'promote') {
      targetParts = [moduleName];
    } else {
      logger.info('Enter target path (e.g., "user-management/client"):');
      process.exit(1);
    }
  }

  const targetDir = buildModulePath(targetParts);
  const isSourceChild = sourceParts.length > 1;
  const isTargetChild = targetParts.length > 1;

  logger.info(`📦 Moving module:`);
  logger.info(
    `   From: ${sourcePath} (${isSourceChild ? 'child' : 'standalone'})`,
  );
  logger.info(
    `   To:   ${targetParts.join('/')} (${isTargetChild ? 'child' : 'standalone'})`,
  );

  const proceed = await confirm({
    message: 'Proceed with move?',
    default: true,
  });

  if (!proceed) {
    logger.info('🔵 Cancelled');
    process.exit(0);
  }

  // 1. Build old and new import paths
  const oldImportPath = `@/modules/${sourceParts.join('/modules/')}`;
  const newImportPath = `@/modules/${targetParts.join('/modules/')}`;

  // 2. Find files that need import updates
  logger.info('🔍 Scanning for import references...');
  const filesToUpdate = findFilesWithImports(oldImportPath);
  logger.info(`   Found ${filesToUpdate.length} file(s) with imports`);

  // 3. Remove from old parent route (if was child)
  if (isSourceChild) {
    const oldParentParts = sourceParts.slice(0, -1);
    const oldParentName = oldParentParts[oldParentParts.length - 1];
    const oldParentRouteDir = buildModulePath(oldParentParts);
    const oldParentRoutePath = path.join(
      oldParentRouteDir,
      'routes',
      `${kebabCase(oldParentName)}.routes.tsx`,
    );

    if (fileExists(oldParentRoutePath)) {
      logger.info(`🔧 Removing from parent route: ${oldParentRoutePath}`);
      removeFromParentRoute(oldParentRoutePath, moduleName);
    }
  }

  // 4. Move the folder
  logger.info(`📁 Moving folder...`);
  if (fileExists(targetDir)) {
    logger.error(`❌ Target already exists: ${targetDir}`);
    process.exit(1);
  }

  // Ensure parent directory exists
  const targetParentDir = path.dirname(targetDir);
  fs.mkdirSync(targetParentDir, { recursive: true });

  // Move folder
  fs.renameSync(sourceDir, targetDir);
  logger.success(`   Moved to: ${targetDir}`);

  // 5. Update all imports
  logger.info('🔧 Updating imports...');
  let updatedCount = 0;
  for (const file of filesToUpdate) {
    // Skip files in the moved module itself (they'll have wrong paths now)
    if (!file.startsWith(sourceDir)) {
      if (updateImportsInFile(file, oldImportPath, newImportPath)) {
        updatedCount++;
      }
    }
  }
  logger.info(`   Updated ${updatedCount} file(s)`);

  // 6. Update route file
  const routeFilePath = path.join(
    targetDir,
    'routes',
    `${kebabCase(moduleName)}.routes.tsx`,
  );
  if (fileExists(routeFilePath)) {
    if (isTargetChild) {
      const newParentName = targetParts[targetParts.length - 2];
      updateRouteFile(routeFilePath, true, newParentName);
    } else {
      updateRouteFile(routeFilePath, false);
    }
  }

  // 7. Add to new parent route (if now child)
  if (isTargetChild) {
    const newParentParts = targetParts.slice(0, -1);
    const newParentName = newParentParts[newParentParts.length - 1];
    const newParentRouteDir = buildModulePath(newParentParts);
    const newParentRoutePath = path.join(
      newParentRouteDir,
      'routes',
      `${kebabCase(newParentName)}.routes.tsx`,
    );

    const relativeImportPath = `../modules/${moduleName}/routes/${kebabCase(moduleName)}.routes`;

    if (fileExists(newParentRoutePath)) {
      logger.info(`🔧 Adding to parent route: ${newParentRoutePath}`);
      addToParentRoute(newParentRoutePath, moduleName, relativeImportPath);
    } else {
      logger.warn(
        `⚠️ Parent route not found. Please manually add import to: ${newParentRoutePath}`,
      );
    }
  }

  // 8. Clean up empty directories
  if (isSourceChild) {
    const oldModulesDir = path.dirname(sourceDir);
    try {
      const remaining = fs.readdirSync(oldModulesDir);
      if (remaining.length === 0) {
        fs.rmdirSync(oldModulesDir);
        logger.info(`🧹 Removed empty directory: ${oldModulesDir}`);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  logger.success(`\n✅ Module moved successfully!`);

  if (!isTargetChild) {
    logger.info(`\n📝 Note: "${moduleName}" is now a standalone module.`);
    logger.info(`   It will be auto-discovered by app.routes.tsx`);
  }
}

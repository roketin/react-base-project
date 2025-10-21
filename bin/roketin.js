#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import cfonts from 'cfonts';
import { select, checkbox, confirm } from '@inquirer/prompts';

const [command, rawModulePath] = process.argv.slice(2);

const RESTRICTED_MODULES = new Set(['auth', 'app', 'dashboard']);
const GENERATOR_PRESETS = {
  view: ['page', 'route', 'locale', 'type', 'service'],
};

const TYPE_CONFIGS = {
  page: {
    folder: 'components/pages',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.tsx`,
    getContent: ({
      moduleName,
    }) => `const ${capitalize(moduleName)}Index = () => {
  return (
    <div>${capitalize(moduleName)} Page Content</div>
  )
}

export default ${capitalize(moduleName)}Index
`,
  },
  route: {
    folder: 'routes',
    getFileName: ({ moduleName, isChild }) =>
      `${kebabCase(moduleName)}.routes${isChild ? '.child' : ''}.tsx`,
    getContent: ({ moduleName, moduleParts, isChild, filePath, overwrite }) => {
      const parentRoutePathEstimate = path.join(
        moduleParts.length > 1 ? '../..' : '.',
        kebabCase(moduleParts[0]),
        'routes',
        `${kebabCase(moduleParts[0])}.routes.tsx`,
      );

      const routeConfig = createRouteConfig(moduleName, isChild, moduleParts);

      if (isChild) {
        return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";

// This is a CHILD ROUTE.
// The generator tries to link it into the parent route automatically.
// Please double-check ${parentRoutePathEstimate} if the parent structure is customized.

export const ${camelCase(moduleName)}ChildRoutes = createAppRoutes(${routeConfig});
`;
      }

      if (!overwrite && fs.existsSync(filePath)) {
        return null;
      }

      return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";
// import { ${camelCase(moduleName)}ChildRoutes } from "./${kebabCase(moduleName)}.routes.child"; // Example Child Route

// Child routes generated with \`pnpm roketin module-child\` are auto-linked into this file when possible.
// Verify the registration below if you heavily customized the route structure.

export const ${camelCase(moduleName)}Routes = createAppRoutes(${routeConfig});
`;
    },
  },
  store: {
    folder: 'stores',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.store.ts`,
    getContent: ({ moduleName }) => `import { useState } from "react";

export function use${capitalize(moduleName)}Store() {
  const [state, setState] = useState(null);
  return { state, setState };
}
`,
  },
  hook: {
    folder: 'hooks',
    getFileName: ({ moduleName }) => `use-${kebabCase(moduleName)}.ts`,
    getContent: ({ moduleName }) => `import { useEffect } from "react";

export function use${capitalize(moduleName)}() {
  useEffect(() => {
    console.log("${capitalize(moduleName)} hook mounted");
  }, []);
}
`,
  },
  service: {
    folder: 'services',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.service.ts`,
    getContent: () => '',
  },
  constant: {
    folder: 'constants',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.constant.ts`,
    getContent: ({ moduleName }) =>
      `export const ${snakeCase(moduleName).toUpperCase()}_CONSTANT = {};`,
  },
  type: {
    folder: 'types',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.type.ts`,
    getContent: ({ moduleName }) => `export type T${capitalize(moduleName)} = {
  sample: string;
};`,
  },
  lib: {
    folder: 'libs',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}-lib.ts`,
    getContent: ({ moduleName }) =>
      `export function ${camelCase(moduleName)}Lib() {}`,
  },
  context: {
    folder: 'contexts',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}-context.ts`,
    getContent: ({ moduleName }) => `import { createContext, use } from "react";

export type T${capitalize(moduleName)}Context = {
  sample: string;
};

export const ${pascalCase(moduleName)}Context = createContext<T${capitalize(moduleName)}Context | null>(null);

export function use${capitalize(moduleName)}Context() {
  const context = use(${pascalCase(moduleName)}Context);
  if (!context) {
    throw new Error('use${capitalize(moduleName)}Context must be used within a ${pascalCase(moduleName)}.');
  }

  return context;
}

`,
  },
  locale: {
    folder: 'locales',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.en.json`,
    getContent: ({ moduleName }) => `{
  "title": "${capitalize(moduleName)}",
  "subtitle": "Sub ${capitalize(moduleName)}"
}`,
  },
};

/**
 * Main entry point of the CLI tool.
 * Validates input arguments, renders banner, processes commands,
 * prompts user for options, and generates module artifacts accordingly.
 * Handles both 'module' and 'module-child' commands.
 */
async function main() {
  validateCliArgs(command, rawModulePath);
  renderBanner();

  if (command !== 'module' && command !== 'module-child') {
    console.log(`🔵 Unknown command: ${command}`);
    process.exit(1);
  }

  const moduleParts = sanitizeModulePath(rawModulePath);
  const moduleName = moduleParts[moduleParts.length - 1];

  const basePath = buildModuleBasePath(moduleParts);
  const allowOverwrite = await promptOverwriteIfNeeded(basePath);
  ensureDirExists(basePath);

  let isChild = command === 'module-child';
  if (!isChild && moduleParts.length > 1) {
    const treatAsChild = await confirm({
      message: `The path '${rawModulePath}' is nested. Treat '${moduleName}' as a child module?`,
      default: true,
    });
    isChild = treatAsChild;
  }

  const selectedTypes = await promptGenerationTypes();
  if (selectedTypes.length === 0) {
    console.log('🔵 No generator selected. Nothing to do.');
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

/**
 * Validates the CLI arguments to ensure command and module path are provided.
 * @param {string} cmd - The command passed in CLI.
 * @param {string} pathArg - The module path argument.
 * Exits the process with an error message if validation fails.
 */
function validateCliArgs(cmd, pathArg) {
  if (!cmd || !pathArg) {
    console.log('❌ Usage: pnpm roketin module <module_path>');
    process.exit(1);
  }
}

/**
 * Renders the CLI banner using cfonts.
 * Displays the tool name and description with styled fonts and colors.
 */
function renderBanner() {
  cfonts.say('Roketin', {
    font: '3d',
    align: 'left',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: true,
    transitionGradient: true,
    rawMode: false,
    env: 'node',
  });

  cfonts.say('Module Generator', {
    font: 'chrome',
    align: 'left',
    colors: ['yellow', 'green'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });
}

/**
 * Sanitizes the raw module path provided by the user.
 * Splits the path into segments, normalizes folder names,
 * and checks for restricted module names.
 * @param {string} rawPath - Raw path string from CLI input.
 * @returns {string[]} Array of sanitized path segments.
 * Exits the process if path is invalid or contains restricted folders.
 */
function sanitizeModulePath(rawPath) {
  const segments = rawPath
    .split('/')
    .map((segment) => sanitizeFolderName(segment))
    .filter(Boolean);

  if (segments.length === 0) {
    console.error('❌ Module path is invalid.');
    process.exit(1);
  }

  if (segments.some((segment) => RESTRICTED_MODULES.has(segment))) {
    console.error(
      '❌ You cannot create a module inside restricted folders: auth, app, or dashboard.',
    );
    process.exit(1);
  }

  return segments;
}

/**
 * Builds the absolute base path for the module based on its parts.
 * The path follows the pattern: ./src/modules/<module>/modules/<child_module>/...
 * @param {string[]} parts - Array of module path segments.
 * @returns {string} Absolute path string for the module base directory.
 */
function buildModuleBasePath(parts) {
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
 * Prompts the user to confirm overwriting existing files if the base path exists.
 * @param {string} basePath - The module base directory path.
 * @returns {Promise<boolean>} Resolves to true if overwrite is allowed, otherwise exits.
 */
async function promptOverwriteIfNeeded(basePath) {
  if (!fs.existsSync(basePath)) {
    return false;
  }

  const overwrite = await confirm({
    message: `The folder '${basePath}' already exists. Overwrite existing files?`,
    default: false,
  });

  if (!overwrite) {
    console.log('🚫 Aborted by user.');
    process.exit(0);
  }

  return true;
}

/**
 * Ensures that the specified directory exists.
 * Creates the directory recursively if it does not exist.
 * @param {string} dir - Directory path to ensure existence.
 */
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Prompts the user to select the types of module files/folders to generate.
 * Offers presets, all, or custom selection.
 * @returns {Promise<string[]>} Array of selected generator types.
 */
async function promptGenerationTypes() {
  const choice = await select({
    message: 'Select the module type to generate:',
    choices: [
      {
        name: 'Standard (components/pages, route, locale, type, service)',
        value: 'view',
      },
      { name: 'All folders', value: 'all' },
      { name: 'Custom', value: 'custom' },
    ],
  });

  if (choice === 'all') {
    return Object.keys(TYPE_CONFIGS);
  }

  if (choice === 'view') {
    return GENERATOR_PRESETS.view;
  }

  const customSelected = await checkbox({
    message: 'Select folders/files to generate:',
    choices: Object.keys(TYPE_CONFIGS),
    loop: false,
  });

  return customSelected;
}

/**
 * Generates the module artifacts (files/folders) based on user selection.
 * Writes files with generated content, respecting overwrite rules.
 * Logs creation, overwrite, or skip statuses with emojis.
 * @param {Object} params - Parameters object.
 * @param {string} params.basePath - Base directory path for the module.
 * @param {string} params.moduleName - Final module name segment.
 * @param {string[]} params.moduleParts - Array of module path segments.
 * @param {string[]} params.types - Selected types to generate.
 * @param {boolean} params.isChild - Whether the module is a child module.
 * @param {boolean} params.overwrite - Whether to overwrite existing files.
 */
function generateArtifacts({
  basePath,
  moduleName,
  moduleParts,
  types,
  isChild,
  overwrite,
}) {
  types.forEach((type) => {
    const config = TYPE_CONFIGS[type];

    if (!config) {
      console.warn(`⚠️ Unknown generator type: ${type}`);
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
    };

    const fileName = config.getFileName(context);
    const filePath = path.join(targetDir, fileName);
    const content = config.getContent({ ...context, filePath });

    if (content === null) {
      console.log(`🔵 Skipped: ${filePath}`);
      return;
    }

    const existed = fs.existsSync(filePath);
    const written = writeFile(filePath, content, overwrite);

    if (!written) {
      console.log(`🔵 Skipped: ${filePath}`);
      return;
    }

    console.log(`${existed ? '🟣 Overwritten' : '🟢 Created'}: ${filePath}`);

    if (type === 'route' && isChild) {
      injectChildRoutesIntoParent({
        moduleName,
        moduleParts,
        childRouteFilePath: filePath,
      });
    }
  });
}

/**
 * Writes content to a file, respecting overwrite flag.
 * @param {string} filePath - Path of the file to write.
 * @param {string} content - Content to write into the file.
 * @param {boolean} overwrite - Whether to overwrite if file exists.
 * @returns {boolean} True if file was written, false if skipped.
 */
function writeFile(filePath, content, overwrite) {
  if (fs.existsSync(filePath) && !overwrite) {
    return false;
  }

  fs.writeFileSync(filePath, content);
  return true;
}

/**
 * Automatically links a generated child route file into its parent route module.
 * Adds the import statement and spreads the child routes inside the parent's children array.
 * Falls back gracefully if the parent route file cannot be found or already contains the link.
 * @param {object} params - Injection parameters.
 * @param {string} params.moduleName - The current (child) module name.
 * @param {string[]} params.moduleParts - The full path parts for the child module.
 * @param {string} params.childRouteFilePath - Absolute path to the generated child route file.
 */
function injectChildRoutesIntoParent({
  moduleName,
  moduleParts,
  childRouteFilePath,
}) {
  if (moduleParts.length < 2) {
    console.log(
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
    console.log(
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
    console.log(
      `🔵 Skipped auto-link: ${childRoutesIdentifier} already registered in ${parentRouteFilePath}`,
    );
    return;
  }

  fs.writeFileSync(parentRouteFilePath, parentContent);
  console.log(`🟢 Linked child routes in ${parentRouteFilePath}`);
}

/**
 * Creates a route configuration string for react-router based on module info.
 * Includes comments explaining path usage depending on child or standalone route.
 * @param {string} finalModuleName - The last segment of the module name.
 * @param {boolean} isChild - Whether this route is a child route.
 * @param {string[]} moduleParts - Array of module path segments.
 * @returns {string} Route configuration code as a string.
 */
function createRouteConfig(finalModuleName, isChild, moduleParts) {
  const componentImport = `${capitalize(finalModuleName)}Index`;

  const routePath = isChild
    ? kebabCase(finalModuleName)
    : moduleParts.map((part) => kebabCase(part)).join('/');

  const pathComment = isChild
    ? '// Child route path uses only the segment name, as it is nested within a parent route.'
    : `// Standalone route path uses the full segment path for flat registration: "${routePath}".`;

  const indexRoute = `
      {
        index: true,
        name: "${capitalize(finalModuleName)}Index",
        element: <${componentImport} />,
      },
      // Add other child routes here if needed
    `;

  return `[
  {
    path: "${routePath}", ${pathComment}
    element: <Outlet />,
    handle: {
      breadcrumb: "${capitalize(finalModuleName)}",
    },
    children: [${indexRoute}
    ],
  },
]`;
}

/**
 * Normalizes a relative path for import usage inside TypeScript files.
 * Ensures POSIX separators and removes file extensions.
 * @param {string} relativePath - Raw relative path from parent to child file.
 * @returns {string} Normalized path suitable for import statements.
 */
function normalizeImportPath(relativePath) {
  let formatted = relativePath.replace(/\.[tj]sx?$/, '');
  formatted = formatted.split(path.sep).join('/');
  if (!formatted.startsWith('.')) {
    formatted = `./${formatted}`;
  }
  return formatted;
}

/**
 * Checks whether a specific import statement already exists for a child route.
 * @param {string} source - File content to inspect.
 * @param {string} identifier - Imported identifier name.
 * @param {string} importPath - Import path string.
 * @returns {boolean} True if an equivalent import already exists.
 */
function includesImport(source, identifier, importPath) {
  const importRegex = new RegExp(
    `import\\s*\\{[^}]*\\b${identifier}\\b[^}]*\\}\\s*from\\s*["']${importPath}["'];?`,
  );
  return importRegex.test(source);
}

/**
 * Inserts an import statement after the last existing import block.
 * @param {string} source - Original file content.
 * @param {string} importStatement - Import statement to inject.
 * @returns {string} Updated file content.
 */
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

/**
 * Inserts the spread of child routes into the correct children array of the parent route.
 * Prefers the placeholder comment inserted by the generator; falls back to structural parsing.
 * @param {object} params - Parameters for insertion.
 * @param {string} params.source - Current parent route file content.
 * @param {string} params.childIdentifier - Identifier of the child routes array.
 * @param {string[]} params.parentParts - Module parts representing the parent path.
 * @returns {string} Updated file content with spread inserted when possible.
 */
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
    console.log(
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

/**
 * Finds the insertion point before the closing bracket of the relevant children array.
 * Attempts to scope the search to route objects matching the provided path hints.
 * @param {string} source - Parent route file content.
 * @param {Set<string>} paths - Possible path string literals identifying the parent route object.
 * @returns {{ insertionIndex: number, itemIndent: string, closingIndent: string } | null}
 *          Object containing the position and indentation details, or null if not found.
 */
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

/**
 * Sanitizes a folder name by trimming, converting to lowercase,
 * replacing spaces with hyphens, and removing invalid characters.
 * @param {string} name - Raw folder name string.
 * @returns {string} Sanitized folder name.
 */
function sanitizeFolderName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Capitalizes a string by splitting on spaces, hyphens, or underscores,
 * capitalizing the first letter of each segment, and joining them.
 * @param {string} str - Input string.
 * @returns {string} Capitalized string with no separators.
 */
function capitalize(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Converts a string to camelCase.
 * @param {string} str - Input string.
 * @returns {string} camelCase string.
 */
function camelCase(str) {
  const c = capitalize(str);
  return c.charAt(0).toLowerCase() + c.slice(1);
}

/**
 * Converts a string to kebab-case.
 * @param {string} str - Input string.
 * @returns {string} kebab-case string.
 */
function kebabCase(str) {
  return str
    .trim()
    .split(/[\s_]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`))
    .join('-')
    .replace(/^-+/, '')
    .toLowerCase();
}

/**
 * Converts a string to snake_case.
 * @param {string} str - Input string.
 * @returns {string} snake_case string.
 */
function snakeCase(str) {
  return str
    .trim()
    .split(/[\s-]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))
    .join('_')
    .replace(/^_+/, '')
    .toLowerCase();
}

/**
 * Converts a string to PascalCase.
 * @param {string} str - Input string.
 * @returns {string} PascalCase string.
 */
function pascalCase(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

main().catch((error) => {
  console.error(`❌ ${error}`);
  process.exit(1);
});

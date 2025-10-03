#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { select, checkbox, confirm } from '@inquirer/prompts'; // Added 'confirm'
import cfonts from 'cfonts';

const args = process.argv.slice(2);
const command = args[0];
const modulePathArg = args[1];

if (!command || !modulePathArg) {
  console.log('Usage: r-app module <module_path>');
  process.exit(1);
}

//#region -------------------------- Title
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
//#endregion -------------------------- Title

// split path
const parts = modulePathArg.split('/');
const moduleName = parts[parts.length - 1]; // used for file naming

// --- PATH CORRECTION START ---
// Build the base path segment by segment.
// This ensures 'modules' is correctly inserted for all nested paths,
// maintaining the pattern: src/modules/moduleA/modules/moduleB/...
const pathSegments = ['./src/modules'];

for (let i = 0; i < parts.length; i++) {
  const segment = sanitizeFolderName(parts[i]);

  if (i === 0) {
    // The first segment (top-level module) goes directly under src/modules
    pathSegments.push(segment);
  } else {
    // All subsequent segments (nested modules) must be placed in a 'modules' subfolder
    pathSegments.push('modules');
    pathSegments.push(segment);
  }
}

const basePath = path.resolve(...pathSegments);
// --- PATH CORRECTION END ---

const TYPE_CONFIGS = {
  page: {
    folder: 'components/pages',
    getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.tsx`,
    getContent: ({ moduleName }) => `
const ${capitalize(moduleName)}Index = () => {
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
    getContent: ({ moduleName, isChild, moduleParts, filePath }) => {
      const finalModuleName = moduleName;
      const parentRoutePathEstimate = path.join(
        moduleParts.length > 1 ? '../..' : '.',
        kebabCase(moduleParts[0]),
        'routes',
        `${kebabCase(moduleParts[0])}.routes.tsx`,
      );

      if (isChild) {
        const routeConfig = createRouteConfig(
          finalModuleName,
          true,
          moduleParts,
        );

        return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";

// This is a CHILD ROUTE.
// It will not be automatically registered. You must import and nest it within a Parent Route
// (e.g., in ${parentRoutePathEstimate}) manually.

export const ${camelCase(moduleName)}ChildRoutes = createAppRoutes(${routeConfig});
`;
      }

      if (fs.existsSync(filePath)) {
        return null;
      }

      const routeConfig = createRouteConfig(
        finalModuleName,
        false,
        moduleParts,
      );

      return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";
// import { ${camelCase(moduleName)}ChildRoutes } from "./${kebabCase(moduleName)}.routes.child"; // Example Child Route

// To register child routes, add the child route elements to the 'children' array below.
// Example: { path: "settings", children: ${camelCase(moduleName)}ChildRoutes }
// Note: If this is a nested route, ensure you have correctly embedded it in the root router.

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

const customChoices = Object.keys(TYPE_CONFIGS);

//#region -------------------------- Generator
if (command === 'module' || command === 'module-child') {
  let isChild = command === 'module-child';

  // Logic to ask if a nested 'module' command should be treated as 'module-child'
  if (command === 'module' && parts.length > 1) {
    const confirmChild = await confirm({
      message: `The path '${modulePathArg}' is nested. Treat '${moduleName}' as a child module? (Selecting 'No' means the path will be registered flatly as '${parts.join('/')}')`,
      default: true,
    });
    if (confirmChild) {
      isChild = true;
    }
  }

  const mainChoice = await select({
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

  let selected = [];
  if (mainChoice === 'all') {
    selected = customChoices;
  } else if (mainChoice === 'view') {
    selected = ['page', 'route', 'locale', 'type', 'service'];
  } else if (mainChoice === 'custom') {
    const customSelected = await checkbox({
      message: 'Select folders/files to generate:',
      choices: customChoices,
      loop: false,
    });
    selected = customSelected;
  }

  selected.forEach((type) => {
    const config = TYPE_CONFIGS[type];

    if (!config) {
      console.warn(`Unknown generator type: ${type}`);
      return;
    }

    const fullPath = config.folder
      ? path.join(basePath, config.folder)
      : basePath;
    ensureDir(fullPath);

    const context = {
      moduleName,
      moduleParts: parts,
      isChild,
      basePath,
    };

    const fileName = config.getFileName(context);
    const filePath = path.join(fullPath, fileName);
    const content = config.getContent({ ...context, filePath });

    if (content === null) {
      console.log(`Skipped: ${filePath} (already exists)`);
      return;
    }

    const created = createFile(filePath, content);
    console.log(`${created ? 'Created' : 'Skipped'}: ${filePath}`);
  });
} else {
  console.log(`Unknown command: ${command}`);
}
//#endregion -------------------------- Generator

//#region -------------------------- Core Function & Utils

/**
 * Creates a route configuration.
 * The path is determined by whether it's a child (last segment) or a standalone (full path).
 * @param {string} finalModuleName - The name of the final component
 * @param {boolean} isChild - If this is a child route (module-child command or confirmed as child)
 * @param {string[]} moduleParts - All parts of the module path (e.g., ['testing', 'makan'])
 * @returns {string} The simple route configuration string.
 */
function createRouteConfig(finalModuleName, isChild, moduleParts) {
  const componentImport = capitalize(finalModuleName) + 'Index';

  let routePath;
  let pathComment;

  if (isChild) {
    // Child: Use only the last segment path. E.g., for 'testing/makan', path is 'makan'.
    routePath = kebabCase(finalModuleName);
    pathComment = `// Child route path uses only the segment name, as it's nested within a parent route.`;
  } else {
    // Not a child: Use the full path for flat registration. E.g., for 'testing/makan', path is 'testing/makan'.
    routePath = moduleParts.map((p) => kebabCase(p)).join('/');
    pathComment = `// Standalone route path uses the full segment path for flat registration: "${routePath}". This route MUST be registered at the root level.`;
  }

  // Ensure the index route is generated
  const indexRoute = `
      {
        index: true,
        name: "${capitalize(finalModuleName)}Index",
        element: <${componentImport} />,
      },
      // Add other child routes here if needed
    `;

  const routeConfig = `[
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
  return routeConfig;
}

function sanitizeFolderName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces to dash
    .replace(/[^a-z0-9-]/g, ''); // remove characters other than a-z, 0-9, dash
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createFile(filePath, content = '') {
  if (fs.existsSync(filePath)) {
    return false;
  }

  fs.writeFileSync(filePath, content);
  return true;
}

function capitalize(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function camelCase(str) {
  const c = capitalize(str);
  return c.charAt(0).toLowerCase() + c.slice(1);
}

function kebabCase(str) {
  return str
    .trim()
    .split(/[\s_]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`))
    .join('-')
    .replace(/^-+/, '')
    .toLowerCase();
}

function snakeCase(str) {
  return str
    .trim()
    .split(/[\s-]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))
    .join('_')
    .replace(/^_+/, '')
    .toLowerCase();
}

function pascalCase(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
//#endregion -------------------------- Core Function & Utils

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { select, checkbox } from '@inquirer/prompts';
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
const rawModuleName = parts[parts.length - 1];
const moduleName = rawModuleName; // tetap untuk file naming

// Sanitize only the first folder name in path to kebab-case, rest remain as input
const firstFolder = sanitizeFolderName(parts[0]);
const restFolders = parts.slice(1); // tetap seperti input
let basePath;

if (restFolders.length > 0) {
  // Jika ada nested path, tambahkan folder 'modules'
  basePath = path.resolve(
    './src/modules',
    firstFolder,
    'modules',
    ...restFolders,
  );
} else {
  // Tidak ada nested path, jangan tambah 'modules'
  basePath = path.resolve('./src/modules', firstFolder);
}

// Map type ke folder
const folderMap = {
  page: 'components/pages',
  route: 'routes',
  store: 'stores',
  hook: 'hooks',
  // hoc: 'hoc',
  constant: 'constants',
  type: 'types',
  lib: 'libs',
  context: 'contexts',
  locale: 'locales',
};

const customChoices = Object.keys(folderMap);

//#region -------------------------- Generator
if (command === 'module') {
  const mainChoice = await select({
    message: 'Pilih tipe module yang ingin dibuat:',
    choices: [
      {
        name: 'Standard (components/pages, route, locale, type)',
        value: 'view',
      },
      { name: 'Semua folder', value: 'all' },
      { name: 'Custom', value: 'custom' },
    ],
  });

  let selected = [];
  if (mainChoice === 'all') {
    selected = customChoices;
  } else if (mainChoice === 'view') {
    selected = ['page', 'route', 'locale', 'type'];
  } else if (mainChoice === 'custom') {
    const customSelected = await checkbox({
      message: 'Pilih folder/file yang ingin dibuat:',
      choices: customChoices,
      loop: false,
    });
    selected = customSelected;
  }

  // buat folder & file
  selected.forEach((type) => {
    const folder = folderMap[type];
    const fullPath = folder ? path.join(basePath, folder) : basePath;
    ensureDir(fullPath);
    let fileName;
    switch (type) {
      case 'page':
        fileName = `${kebabCase(moduleName)}.tsx`;
        break;
      case 'route':
        fileName = `${kebabCase(moduleName)}.routes.tsx`;
        break;
      case 'store':
        fileName = `${kebabCase(moduleName)}.store.ts`;
        break;
      case 'hook':
        fileName = `use-${kebabCase(moduleName)}.ts`;
        break;
      // case 'hoc':
      //   fileName = `with${capitalize(moduleName)}.ts`;
      //   break;
      case 'constant':
        fileName = `${kebabCase(moduleName)}.constant.ts`;
        break;
      case 'type':
        fileName = `${kebabCase(moduleName)}.type.ts`;
        break;
      case 'lib':
        fileName = `${kebabCase(moduleName)}-lib.ts`;
        break;
      case 'context':
        fileName = `${kebabCase(moduleName)}-context.ts`;
        break;
      case 'locale':
        fileName = `${kebabCase(moduleName)}.en.json`;
        break;
      default:
        fileName = `${kebabCase(moduleName)}.${type}`;
    }
    const filePath = path.join(fullPath, fileName);
    createFile(filePath, getTemplate(type));
    console.log(`Created: ${filePath}`);
  });
} else {
  console.log(`Unknown command: ${command}`);
}
//#endregion -------------------------- Generator

//#region -------------------------- Core Function & Utils
function getTemplate(type) {
  switch (type) {
    case 'page':
      return `
const ${capitalize(moduleName)}Index = () => {
  return (
    <div>${capitalize(moduleName)}</div>
  )
}

export default ${capitalize(moduleName)}Index
`;

    case 'route':
      return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";

export const ${camelCase(moduleName)}Routes = createAppRoutes([
  {
    name: "${capitalize(moduleName)}Index",
    path: "${parts.map((p) => kebabCase(p)).join('/')}",
    element: <${capitalize(moduleName)}Index />,
    handle: {
      breadcrumb: "${capitalize(moduleName)}",
    },
  },
]);
`;

    case 'store':
      return `import { useState } from "react";

export function use${capitalize(moduleName)}Store() {
  const [state, setState] = useState(null);
  return { state, setState };
}
`;
    case 'hook':
      return `import { useEffect } from "react";

export function use${capitalize(moduleName)}() {
  useEffect(() => {
    console.log("${capitalize(moduleName)} hook mounted");
  }, []);
}
`;

    case 'hoc':
      return `import React from "react";

export function with${capitalize(moduleName)}(Component) {
  return function Wrapped(props) {
    return <Component {...props} />;
  };
}
`;

    case 'constant':
      return `export const ${snakeCase(moduleName).toUpperCase()}_CONSTANT = {};`;

    case 'type':
      return `export type T${capitalize(moduleName)} = {
  sample: string;
};`;

    case 'lib':
      return `export function ${camelCase(moduleName)}Lib() {}`;

    case 'context':
      return `import { createContext, use } from "react";

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

`;
    case 'locale':
      return `{
      "title": "${capitalize(moduleName)}",
      "subTitle": "Sub ${capitalize(moduleName)}"
}`;

    default:
      return '';
  }
}

function sanitizeFolderName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spasi jadi dash
    .replace(/[^a-z0-9-]/g, ''); // hapus karakter selain a-z, 0-9, dash
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createFile(filePath, content = '') {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content);
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

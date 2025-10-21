import { kebabCase } from '../../../lib/utils.js';
import { pageTemplate } from '../templates/page.js';
import { routeTemplate } from '../templates/route.js';
import { storeTemplate } from '../templates/store.js';
import { hookTemplate } from '../templates/hook.js';
import { serviceTemplate } from '../templates/service.js';
import { constantTemplate } from '../templates/constant.js';
import { typeTemplate } from '../templates/type.js';
import { libTemplate } from '../templates/lib.js';
import { contextTemplate } from '../templates/context.js';
import { localeTemplate } from '../templates/locale.js';

export const generatorConfig = {
  restrictedModules: ['auth', 'app', 'dashboard'],
  presets: {
    view: ['page', 'route', 'locale', 'type', 'service'],
  },
  prompts: {
    generationChoices: [
      {
        name: 'Standard (components/pages, route, locale, type, service)',
        value: 'view',
      },
      { name: 'All folders', value: 'all' },
      { name: 'Custom', value: 'custom' },
    ],
  },
  generators: {
    page: {
      label: 'Page',
      folder: 'components/pages',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.tsx`,
      getContent: pageTemplate,
    },
    route: {
      label: 'Route',
      folder: 'routes',
      getFileName: ({ moduleName, isChild }) =>
        `${kebabCase(moduleName)}.routes${isChild ? '.child' : ''}.tsx`,
      getContent: routeTemplate,
    },
    store: {
      label: 'Store',
      folder: 'stores',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.store.ts`,
      getContent: storeTemplate,
    },
    hook: {
      label: 'Hook',
      folder: 'hooks',
      getFileName: ({ moduleName }) => `use-${kebabCase(moduleName)}.ts`,
      getContent: hookTemplate,
    },
    service: {
      label: 'Service',
      folder: 'services',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.service.ts`,
      getContent: serviceTemplate,
    },
    constant: {
      label: 'Constant',
      folder: 'constants',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.constant.ts`,
      getContent: constantTemplate,
    },
    type: {
      label: 'Type',
      folder: 'types',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.type.ts`,
      getContent: typeTemplate,
    },
    lib: {
      label: 'Lib',
      folder: 'libs',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}-lib.ts`,
      getContent: libTemplate,
    },
    context: {
      label: 'Context',
      folder: 'contexts',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}-context.ts`,
      getContent: contextTemplate,
    },
    locale: {
      label: 'Locale',
      folder: 'locales',
      getFileName: ({ moduleName }) => `${kebabCase(moduleName)}.en.json`,
      getContent: localeTemplate,
    },
  },
};

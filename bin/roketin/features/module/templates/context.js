import { capitalize, pascalCase } from '../../../lib/utils.js';

export function contextTemplate({ moduleName }) {
  return `import { createContext, use } from "react";

export type T${capitalize(moduleName)}Context = {
  sample: string;
};

export const ${pascalCase(
    moduleName,
  )}Context = createContext<T${capitalize(moduleName)}Context | null>(null);

export function use${capitalize(moduleName)}Context() {
  const context = use(${pascalCase(moduleName)}Context);
  if (!context) {
    throw new Error('use${capitalize(
      moduleName,
    )}Context must be used within a ${pascalCase(moduleName)}.');
  }

  return context;
}

`;
}

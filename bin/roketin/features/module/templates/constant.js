import { snakeCase } from '../../../lib/utils.js';

export function constantTemplate({ moduleName }) {
  return `export const ${snakeCase(moduleName).toUpperCase()}_CONSTANT = {};`;
}

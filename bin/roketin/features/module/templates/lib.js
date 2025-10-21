import { camelCase } from '../../../lib/utils.js';

export function libTemplate({ moduleName }) {
  return `export function ${camelCase(moduleName)}Lib() {}`;
}

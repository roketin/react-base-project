import { capitalize } from '../../../lib/utils.js';

export function typeTemplate({ moduleName }) {
  return `export type T${capitalize(moduleName)} = {
  sample: string;
};`;
}

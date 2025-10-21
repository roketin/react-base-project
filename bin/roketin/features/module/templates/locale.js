import { capitalize } from '../../../lib/utils.js';

export function localeTemplate({ moduleName }) {
  return `{
  "title": "${capitalize(moduleName)}",
  "subtitle": "Sub ${capitalize(moduleName)}"
}`;
}

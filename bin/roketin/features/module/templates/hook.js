import { capitalize } from '../../../lib/utils.js';

export function hookTemplate({ moduleName }) {
  return `import { useEffect } from "react";

export function use${capitalize(moduleName)}() {
  useEffect(() => {
    console.log("${capitalize(moduleName)} hook mounted");
  }, []);
}
`;
}

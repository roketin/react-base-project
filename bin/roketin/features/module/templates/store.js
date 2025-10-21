import { capitalize } from '../../../lib/utils.js';

export function storeTemplate({ moduleName }) {
  return `import { useState } from "react";

export function use${capitalize(moduleName)}Store() {
  const [state, setState] = useState(null);
  return { state, setState };
}
`;
}

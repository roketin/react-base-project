import { capitalize } from '../../../lib/utils.js';

export function pageTemplate({ moduleName }) {
  return `const ${capitalize(moduleName)}Index = () => {
  return (
    <div>${capitalize(moduleName)} Page Content</div>
  )
}

export default ${capitalize(moduleName)}Index
`;
}

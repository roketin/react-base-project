import fs from 'fs';
import path from 'path';
import { camelCase, capitalize, kebabCase } from '../../../lib/utils.js';
import {
  createRouteConfigString,
  createScaffoldRouteContent,
} from './shared/route-helpers.js';

export function routeTemplate({
  moduleName,
  moduleParts,
  isChild,
  filePath,
  overwrite,
  autoScaffold,
}) {
  if (autoScaffold) {
    return createScaffoldRouteContent({ moduleName, moduleParts, isChild });
  }

  const parentRoutePathEstimate = path.join(
    moduleParts.length > 1 ? '../..' : '.',
    kebabCase(moduleParts[0]),
    'routes',
    `${kebabCase(moduleParts[0])}.routes.tsx`,
  );

  const routeConfig = createRouteConfigString(moduleName, isChild, moduleParts);

  if (isChild) {
    return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";

// This is a CHILD ROUTE (nested module).
// Auto-linked into parent route: ${parentRoutePathEstimate}

export const ${camelCase(moduleName)}Routes = createAppRoutes(${routeConfig});
`;
  }

  if (!overwrite && fs.existsSync(filePath)) {
    return null;
  }

  return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import ${capitalize(moduleName)}Index from "../components/pages/${kebabCase(moduleName)}";
import { Outlet } from "react-router-dom";

// Child routes from nested modules are auto-linked into this file.

export const ${camelCase(moduleName)}Routes = createAppRoutes(${routeConfig});
`;
}

import { camelCase, capitalize, kebabCase } from '../../../../lib/utils.js';

export function createRouteTemplateParts(
  finalModuleName,
  isChild,
  moduleParts,
) {
  const routePath = getRoutePath(finalModuleName, isChild, moduleParts);
  const pathComment = isChild
    ? '// Child route path uses only the segment name, as it is nested within a parent route.'
    : `// Standalone route path uses the full segment path for flat registration: "${routePath}".`;

  return {
    routePath,
    pathComment,
  };
}

export function createRouteConfigString(finalModuleName, isChild, moduleParts) {
  const componentImport = `${capitalize(finalModuleName)}Index`;
  const { routePath, pathComment } = createRouteTemplateParts(
    finalModuleName,
    isChild,
    moduleParts,
  );

  const indexRoute = `
      {
        index: true,
        name: "${capitalize(finalModuleName)}Index",
        element: <${componentImport} />,
      },
      // Add other child routes here if needed
    `;

  return `[
  {
    path: "${routePath}", ${pathComment}
    element: <Outlet />,
    handle: {
      breadcrumb: "${capitalize(finalModuleName)}",
      breadcrumbOptions: {
        disabled: true,
      },
    },
    children: [${indexRoute}
    ],
  },
]`;
}

export function createScaffoldRouteContent({
  moduleName,
  moduleParts,
  isChild,
}) {
  const { routePath, pathComment } = createRouteTemplateParts(
    moduleName,
    isChild,
    moduleParts,
  );
  const exportName = `${camelCase(moduleName)}Routes`;
  const childNotice = isChild
    ? `// This is a CHILD ROUTE.\n// The generator tries to link it into the parent route automatically.\n// Please double-check the parent route file if the structure is customized.\n\n`
    : '';

  return `import { createAppRoutes } from "@/modules/app/libs/routes-utils";
import { Outlet } from "react-router-dom";

${childNotice}export const ${exportName} = createAppRoutes([
  {
    path: "${routePath}", ${pathComment}
    element: <Outlet />,
    handle: {
      breadcrumb: "${capitalize(moduleName)}",
      breadcrumbOptions: {
        disabled: true,
      },
    },
    children: [
      // Add other child routes here if needed
    ],
  },
]);
`;
}

function getRoutePath(finalModuleName, isChild, moduleParts) {
  return isChild
    ? kebabCase(finalModuleName)
    : moduleParts.map((part) => kebabCase(part)).join('/');
}

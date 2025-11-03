import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import ts from 'typescript';
import { logger } from '../../lib/logger.js';

const colors = {
  heading: (text) => `\x1b[1m\x1b[36m${text}\x1b[0m`,
  highlight: (text) => `\x1b[35m${text}\x1b[0m`,
  info: (text) => `\x1b[90m${text}\x1b[0m`,
  bullet: (text) => `\x1b[90m${text}\x1b[0m`,
  warning: (text) => `\x1b[33m${text}\x1b[0m`,
  strong: (text) => `\x1b[1m${text}\x1b[0m`,
};

const ROUTE_GLOB = 'src/modules/**/routes/*.routes.ts?(x)';
const APP_ROUTES_FILENAME = 'app.routes.tsx';
const APP_ROUTES_PATH = path.join(
  'src',
  'modules',
  'app',
  'routes',
  APP_ROUTES_FILENAME,
);
const DEFAULT_ADMIN_BASE_PATH = '/admin';

export default async function viewRoutesFeature({ args = [] } = {}) {
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    return;
  }

  await printRouterTree();
}

function printUsage() {
  logger.info(colors.heading('Usage:'));
  logger.info('  pnpm roketin view-routes');
  logger.info('');
  logger.info(colors.heading('Description:'));
  logger.info(
    '  Visualize the aggregated routing tree resolved from feature route files.',
  );
}

async function printRouterTree() {
  const cwd = process.cwd();
  const routeFiles = await fg(ROUTE_GLOB, {
    cwd,
    absolute: true,
    onlyFiles: true,
  });

  const featureRouteFiles = routeFiles.filter(
    (filePath) => !filePath.endsWith(APP_ROUTES_FILENAME),
  );

  if (featureRouteFiles.length === 0) {
    logger.warn('No feature route files found.');
    return;
  }

  const parsedRoutes = [];
  featureRouteFiles.sort().forEach((absolutePath) => {
    const { routes, issues } = parseRouteFile(absolutePath);
    parsedRoutes.push(...routes);
    issues.forEach((issue) => logger.warn(colors.warning(issue)));
  });

  const absoluteRoutes = [];
  const nestedRoutes = [];

  parsedRoutes.forEach((route) => {
    if (route.isSpread) {
      absoluteRoutes.push(route);
      return;
    }

    if (route.path && route.path.startsWith('/')) {
      absoluteRoutes.push(route);
    } else {
      nestedRoutes.push(route);
    }
  });

  const adminBasePath = readAdminBasePath(cwd);
  const tree = buildRouteTree({
    absoluteRoutes,
    nestedRoutes,
    adminBasePath,
    projectRoot: cwd,
  });

  logger.info(colors.heading('📍 Application Route Map'));
  logger.info(colors.info('────────────────────────'));
  printTree(tree);
  logger.info('');
  logger.info(
    `Total feature routes: ${parsedRoutes.length} (absolute: ${absoluteRoutes.length}, nested: ${nestedRoutes.length})`,
  );
}

function parseRouteFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const routes = [];
  const issues = [];

  const visit = (node) => {
    if (ts.isCallExpression(node) && isCreateAppRoutesCall(node)) {
      const [firstArgument] = node.arguments;
      if (firstArgument && ts.isArrayLiteralExpression(firstArgument)) {
        routes.push(
          ...firstArgument.elements
            .map((element) => {
              if (ts.isObjectLiteralExpression(element)) {
                return parseRouteObject(element, sourceFile, filePath);
              }
              if (ts.isSpreadElement(element)) {
                return createSpreadPlaceholder(element, sourceFile, filePath);
              }
              issues.push(
                formatIssue(
                  filePath,
                  sourceFile,
                  element,
                  'Unsupported route element encountered.',
                ),
              );
              return null;
            })
            .filter(Boolean),
        );
      } else {
        issues.push(
          formatIssue(
            filePath,
            sourceFile,
            node,
            'createAppRoutes must receive an array literal as its first argument.',
          ),
        );
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return { routes, issues };
}

function isCreateAppRoutesCall(node) {
  return (
    ts.isIdentifier(node.expression) &&
    node.expression.escapedText === 'createAppRoutes'
  );
}

function parseRouteObject(node, sourceFile, filePath) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const route = {
    path: undefined,
    rawPath: undefined,
    name: undefined,
    index: false,
    children: [],
    handle: undefined,
    isSpread: false,
    source: {
      file: filePath,
      line: location.line + 1,
      column: location.character + 1,
    },
  };

  node.properties.forEach((prop) => {
    if (ts.isPropertyAssignment(prop)) {
      const propName = getPropertyName(prop.name);
      if (!propName) return;

      const initializer = prop.initializer;

      switch (propName) {
        case 'path': {
          route.path = extractString(initializer, sourceFile);
          route.rawPath = initializer.getText(sourceFile);
          break;
        }
        case 'name': {
          route.name = extractString(initializer, sourceFile);
          break;
        }
        case 'index': {
          route.index = extractBoolean(initializer) ?? route.index;
          break;
        }
        case 'children': {
          if (ts.isArrayLiteralExpression(initializer)) {
            route.children = initializer.elements
              .map((element) => {
                if (ts.isObjectLiteralExpression(element)) {
                  return parseRouteObject(element, sourceFile, filePath);
                }
                if (ts.isSpreadElement(element)) {
                  return createSpreadPlaceholder(element, sourceFile, filePath);
                }
                return null;
              })
              .filter(Boolean);
          }
          break;
        }
        case 'handle': {
          if (ts.isObjectLiteralExpression(initializer)) {
            route.handle = parseHandle(initializer, sourceFile);
          }
          break;
        }
        default:
          break;
      }
    }
  });

  return route;
}

function createSpreadPlaceholder(node, sourceFile, filePath) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return {
    isSpread: true,
    spreadExpression: node.expression.getText(sourceFile),
    children: [],
    source: {
      file: filePath,
      line: location.line + 1,
      column: location.character + 1,
    },
  };
}

function parseHandle(node, sourceFile) {
  const handle = {};
  node.properties.forEach((prop) => {
    if (!ts.isPropertyAssignment(prop)) return;
    const propName = getPropertyName(prop.name);
    if (!propName) return;

    const initializer = prop.initializer;

    switch (propName) {
      case 'title':
      case 'breadcrumb': {
        handle[propName] = extractString(initializer, sourceFile);
        break;
      }
      case 'permissions': {
        handle.permissions =
          extractStringArray(initializer, sourceFile) ?? handle.permissions;
        break;
      }
      case 'isRequiredAuth': {
        handle.isRequiredAuth = extractBoolean(initializer) ?? false;
        break;
      }
      default:
        break;
    }
  });
  return handle;
}

function getPropertyName(node) {
  if (!node) return undefined;
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
    return node.text;
  }
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function extractString(node, sourceFile) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) return node.getText(sourceFile);
  return undefined;
}

function extractBoolean(node) {
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

function extractStringArray(node, sourceFile) {
  if (!ts.isArrayLiteralExpression(node)) return undefined;
  const values = [];
  node.elements.forEach((element) => {
    const value = extractString(element, sourceFile);
    if (typeof value === 'string') {
      values.push(value);
    } else {
      values.push(element.getText(sourceFile));
    }
  });
  return values;
}

function formatIssue(filePath, sourceFile, node, message) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const relativePath = path.relative(process.cwd(), filePath);
  return `⚠️  ${relativePath}:${location.line + 1}:${location.character + 1} — ${message}`;
}

function readAdminBasePath(projectRoot) {
  const configPath = path.join(projectRoot, 'roketin.config.ts');
  if (!fs.existsSync(configPath)) {
    return DEFAULT_ADMIN_BASE_PATH;
  }

  const text = fs.readFileSync(configPath, 'utf8');
  const sourceFile = ts.createSourceFile(
    configPath,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  let basePath = undefined;

  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      if (node.expression.escapedText === 'defineRoketinConfig') {
        const [firstArgument] = node.arguments;
        if (firstArgument && ts.isObjectLiteralExpression(firstArgument)) {
          basePath = extractBasePath(firstArgument, sourceFile);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return normalizeBasePath(basePath ?? DEFAULT_ADMIN_BASE_PATH);
}

function extractBasePath(configObject, sourceFile) {
  const routesProp = findObjectProperty(configObject, 'routes');
  if (!routesProp || !ts.isObjectLiteralExpression(routesProp.initializer)) {
    return undefined;
  }
  const adminProp = findObjectProperty(routesProp.initializer, 'admin');
  if (!adminProp || !ts.isObjectLiteralExpression(adminProp.initializer)) {
    return undefined;
  }
  const basePathProp = findObjectProperty(adminProp.initializer, 'basePath');
  if (!basePathProp) return undefined;
  return extractString(basePathProp.initializer, sourceFile);
}

function findObjectProperty(objectLiteral, name) {
  return objectLiteral.properties.find(
    (prop) =>
      ts.isPropertyAssignment(prop) && getPropertyName(prop.name) === name,
  );
}

function normalizeBasePath(value) {
  if (!value || typeof value !== 'string') {
    return DEFAULT_ADMIN_BASE_PATH;
  }
  if (!value.trim()) return DEFAULT_ADMIN_BASE_PATH;
  return value.startsWith('/') ? value : `/${value}`;
}

function buildRouteTree({
  absoluteRoutes,
  nestedRoutes,
  adminBasePath,
  projectRoot,
}) {
  const rootChildren = [
    createPseudoNode({
      segment: '[index]',
      infoParts: [
        'path=/',
        'component=AppEntryPoint',
        `src=${APP_ROUTES_PATH}`,
      ],
    }),
    ...absoluteRoutes.map((route) => routeToPrintable(route, '/', projectRoot)),
  ];

  if (nestedRoutes.length > 0) {
    rootChildren.push(
      createPseudoNode({
        segment: adminBasePath,
        infoParts: [
          `path=${adminBasePath}`,
          'component=AppLayout',
          `src=${APP_ROUTES_PATH}`,
        ],
        children: nestedRoutes.map((route) =>
          routeToPrintable(route, adminBasePath, projectRoot),
        ),
      }),
    );
  }

  rootChildren.push(
    createPseudoNode({
      segment: '*',
      infoParts: ['path=*', 'component=AppNotFound', `src=${APP_ROUTES_PATH}`],
    }),
  );

  return [
    createPseudoNode({
      segment: '/',
      infoParts: ['path=/'],
      children: rootChildren,
    }),
  ];
}

function createPseudoNode({ segment, infoParts = [], children = [] }) {
  return {
    segment,
    infoParts,
    children,
  };
}

function routeToPrintable(route, parentPath, projectRoot) {
  if (route.isSpread) {
    return {
      segment: `… ${route.spreadExpression}`,
      infoParts: [`src=${path.relative(projectRoot, route.source.file)}`],
      children: [],
    };
  }

  const segment = route.index
    ? '[index]'
    : typeof route.path === 'string'
      ? route.path
      : (route.rawPath ?? '(pathless)');

  const fullPath = computeFullPath(parentPath, route);
  const infoParts = [];

  if (fullPath) {
    infoParts.push(`path=${fullPath}`);
  }
  if (route.name) {
    infoParts.push(`name=${route.name}`);
  }
  if (route.index) {
    infoParts.push('index');
  }
  if (route.handle?.title) {
    infoParts.push(`title=${route.handle.title}`);
  }
  if (route.handle?.breadcrumb) {
    infoParts.push(`breadcrumb=${route.handle.breadcrumb}`);
  }
  if (route.handle?.permissions?.length) {
    infoParts.push(`permissions=[${route.handle.permissions.join(', ')}]`);
  }
  if (route.handle?.isRequiredAuth) {
    infoParts.push('requiresAuth=true');
  }
  if (route.source) {
    const relative = path.relative(projectRoot, route.source.file);
    infoParts.push(`src=${relative}`);
  }

  const children = (route.children ?? []).map((child) =>
    routeToPrintable(child, fullPath ?? parentPath, projectRoot),
  );

  return {
    segment,
    infoParts,
    children,
  };
}

function computeFullPath(parentPath, route) {
  if (route.isSpread) return undefined;
  if (route.index) return parentPath || '/';
  if (route.path && route.path.startsWith('/')) {
    return route.path;
  }
  if (route.path) {
    return joinPaths(parentPath, route.path);
  }
  return parentPath;
}

function joinPaths(base, segment) {
  const cleanBase = !base || base === '/' ? '' : base.replace(/\/+$/, '');
  const cleanSegment = segment.replace(/^\/+/, '');
  if (!cleanBase) {
    return `/${cleanSegment}`;
  }
  if (!cleanSegment) {
    return cleanBase || '/';
  }
  return `${cleanBase}/${cleanSegment}`;
}

function printTree(nodes, prefix = '') {
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = prefix ? (isLast ? '└─ ' : '├─ ') : '';
    logger.info(`${prefix}${connector}${colors.highlight(node.segment)}`);
    const infoPrefix = prefix + (isLast ? '   ' : '│  ');
    if (node.infoParts && node.infoParts.length > 0) {
      let hasSrcLine = false;
      node.infoParts.forEach((info) => {
        const output = info.startsWith('src=')
          ? info.replace(
              /(src=)(.+)/,
              (_, label, value) => `${label}${colors.strong(value)}`,
            )
          : info;
        logger.info(
          `${infoPrefix}${colors.bullet('•')} ${colors.info(output)}`,
        );
        if (!hasSrcLine && info.startsWith('src=')) {
          hasSrcLine = true;
        }
      });
      if (hasSrcLine) {
        logger.info('');
      }
    }
    const nextPrefix = prefix + (isLast ? '   ' : '│  ');
    if (node.children && node.children.length > 0) {
      printTree(node.children, nextPrefix);
    }
  });
}

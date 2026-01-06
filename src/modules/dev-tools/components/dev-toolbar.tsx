import { useState, useMemo } from 'react';
import {
  FlaskConical,
  Sun,
  Moon,
  Monitor,
  Languages,
  Grid3X3,
  Eraser,
  Sparkles,
  Trash2,
  Route,
  X,
  Search,
  Rocket,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/modules/app/hooks/use-theme';
import { useDevTools } from '../hooks/use-dev-tools';
import { useBreakpoint } from '../hooks/use-breakpoint';
import { useTranslation } from 'react-i18next';
import i18n from '@/plugins/i18n';
import { cn } from '@/modules/app/libs/utils';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';
import { flattenRoutes } from '@/modules/app/hooks/use-named-route';
import { APP_SIDEBAR_MENUS } from '@/modules/app/libs/sidebar-menu.lib';
import type { TSidebarMenu } from '@/modules/app/types/sidebar-menu.type';

/**
 * Development toolbar - Floating button that expands into toolbar
 * Only renders in development mode
 */
export const DevToolbar = () => {
  if (!import.meta.env.DEV) return null;

  return <DevToolbarInner />;
};

import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { routes as appRoutes } from '@/modules/app/routes/app.routes';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';

type TRouteTreeNode = {
  name?: string;
  path: string;
  fullPath: string;
  title?: string;
  breadcrumb?: string;
  permissions?: string[];
  icon?: TSidebarMenu['icon'];
  children?: TRouteTreeNode[];
  depth: number;
};

/**
 * Flatten sidebar menus to get icon mapping by route name
 */
function flattenSidebarMenus(
  menus: TSidebarMenu[],
  parentIcon?: TSidebarMenu['icon'],
): Map<string, TSidebarMenu['icon']> {
  const iconMap = new Map<string, TSidebarMenu['icon']>();

  for (const menu of menus) {
    const currentIcon = menu.icon ?? parentIcon;
    if (menu.name) {
      iconMap.set(menu.name, currentIcon);
    }
    if (menu.children) {
      const childMap = flattenSidebarMenus(menu.children, currentIcon);
      childMap.forEach((icon, name) => iconMap.set(name, icon));
    }
  }

  return iconMap;
}

/**
 * Extract breadcrumb string from route handle
 */
function extractBreadcrumb(
  handle?: TAppRouteObject['handle'],
): string | undefined {
  if (!handle?.breadcrumb) return undefined;
  const bc = handle.breadcrumb;
  if (typeof bc === 'string') return bc;
  return undefined;
}

/**
 * Build route tree from app routes
 */
function buildRouteTree(
  routes: TAppRouteObject[],
  iconMap: Map<string, TSidebarMenu['icon']>,
  parentPath = '',
  depth = 0,
): TRouteTreeNode[] {
  return routes
    .filter((route) => route.path !== undefined || route.index || route.name)
    .map((route) => {
      const currentPath = route.path ?? (route.index ? '(index)' : '');
      const fullPath = route.path
        ? route.path.startsWith('/')
          ? route.path
          : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
        : parentPath || '/';

      const node: TRouteTreeNode = {
        name: route.name,
        path: currentPath,
        fullPath,
        title: route.handle?.title as string | undefined,
        breadcrumb: extractBreadcrumb(route.handle),
        permissions: route.handle?.permissions as string[] | undefined,
        icon: route.name ? iconMap.get(route.name) : undefined,
        depth,
      };

      if (route.children && route.children.length > 0) {
        node.children = buildRouteTree(
          route.children,
          iconMap,
          fullPath,
          depth + 1,
        );
      }

      return node;
    });
}

/**
 * Get route tree structure
 */
function getRouteTree(): TRouteTreeNode[] {
  const iconMap = flattenSidebarMenus(APP_SIDEBAR_MENUS);
  return buildRouteTree(appRoutes, iconMap);
}

/**
 * Route Tree Item Component
 */
const RouteTreeItem = ({
  node,
  expandedPaths,
  toggleExpand,
}: {
  node: TRouteTreeNode;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedPaths.has(node.fullPath);
  const IconComponent = node.icon;
  const hasDetails = node.name || node.breadcrumb;

  return (
    <div>
      <div
        className={cn(
          'group py-1.5 px-2 hover:bg-zinc-700/50 rounded cursor-pointer text-xs',
          node.name && 'hover:bg-zinc-700',
        )}
        style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
        onClick={() => hasChildren && toggleExpand(node.fullPath)}
      >
        <div className='flex items-center gap-2'>
          <span className='w-4 shrink-0'>
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown size={14} className='text-zinc-400' />
              ) : (
                <ChevronRight size={14} className='text-zinc-400' />
              )
            ) : null}
          </span>

          <span className='w-4 shrink-0'>
            {hasChildren ? (
              <Folder size={14} className='text-amber-400' />
            ) : IconComponent ? (
              <IconComponent size={14} className='text-zinc-400' />
            ) : (
              <FileCode size={14} className='text-zinc-500' />
            )}
          </span>

          <span className='text-zinc-300 font-mono'>{node.path || '/'}</span>

          {node.name && (
            <span className='text-emerald-400 font-mono'>→ {node.name}</span>
          )}

          {node.title && (
            <span className='text-zinc-500 ml-auto truncate max-w-32 text-[10px]'>
              {node.title}
            </span>
          )}
        </div>

        {hasDetails && (
          <div
            className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px]'
            style={{ marginLeft: '32px' }}
          >
            <span className='text-zinc-500 font-mono'>
              <span className='text-zinc-600'>path:</span> {node.fullPath}
            </span>

            {node.breadcrumb && (
              <span className='text-amber-500/70'>
                <span className='text-zinc-600'>breadcrumb:</span>{' '}
                {node.breadcrumb}
              </span>
            )}

            {node.permissions && node.permissions.length > 0 && (
              <span className='text-rose-400/80'>
                <span className='text-zinc-600'>permissions:</span>{' '}
                {node.permissions.join(', ')}
              </span>
            )}
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child, idx) => (
            <RouteTreeItem
              key={`${child.fullPath}-${idx}`}
              node={child}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Filter route tree based on search query
 */
function filterRouteTree(
  nodes: TRouteTreeNode[],
  query: string,
): TRouteTreeNode[] {
  if (!query.trim()) return nodes;

  const lowerQuery = query.toLowerCase();

  const filterNode = (node: TRouteTreeNode): TRouteTreeNode | null => {
    const matchesName = node.name?.toLowerCase().includes(lowerQuery);
    const matchesPath = node.path.toLowerCase().includes(lowerQuery);
    const matchesFullPath = node.fullPath.toLowerCase().includes(lowerQuery);
    const matchesTitle = node.title?.toLowerCase().includes(lowerQuery);

    const filteredChildren = node.children
      ? (node.children.map(filterNode).filter(Boolean) as TRouteTreeNode[])
      : [];

    if (
      matchesName ||
      matchesPath ||
      matchesFullPath ||
      matchesTitle ||
      filteredChildren.length > 0
    ) {
      return {
        ...node,
        children:
          filteredChildren.length > 0 ? filteredChildren : node.children,
      };
    }

    return null;
  };

  return nodes.map(filterNode).filter(Boolean) as TRouteTreeNode[];
}

/**
 * Get all paths from route tree for expanding
 */
function getAllPaths(nodes: TRouteTreeNode[]): Set<string> {
  const paths = new Set<string>();
  const addPaths = (nodeList: TRouteTreeNode[]) => {
    nodeList.forEach((node) => {
      paths.add(node.fullPath);
      if (node.children) addPaths(node.children);
    });
  };
  addPaths(nodes);
  return paths;
}

/**
 * Routes Panel Component
 */
const RoutesPanel = ({ onClose }: { onClose: () => void }) => {
  const routeTree = getRouteTree();
  const flatRoutes = flattenRoutes();
  const namedRoutesCount = flatRoutes.filter((r) => r.name).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const addPaths = (nodes: TRouteTreeNode[], depth = 0) => {
      if (depth >= 2) return;
      nodes.forEach((node) => {
        initial.add(node.fullPath);
        if (node.children) addPaths(node.children, depth + 1);
      });
    };
    addPaths(routeTree);
    return initial;
  });

  const filteredTree = filterRouteTree(routeTree, searchQuery);

  const displayExpandedPaths = searchQuery.trim()
    ? getAllPaths(filteredTree)
    : expandedPaths;

  const toggleExpand = (path: string) => {
    if (searchQuery.trim()) return;
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedPaths(getAllPaths(routeTree));
  };

  const collapseAll = () => {
    setExpandedPaths(new Set());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-99999 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden pointer-events-auto transition-all duration-300',
        isExpanded
          ? 'w-[90vw] max-w-none'
          : 'w-[600px] max-w-[calc(100vw-2rem)]',
      )}
    >
      <div className='flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700'>
        <span className='text-sm font-semibold text-white'>
          Routes Tree ({namedRoutesCount} named routes)
        </span>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={expandAll}
            className='text-xs text-zinc-400 hover:text-white px-2 py-1 hover:bg-zinc-700 rounded'
          >
            Expand All
          </button>
          <button
            type='button'
            onClick={collapseAll}
            className='text-xs text-zinc-400 hover:text-white px-2 py-1 hover:bg-zinc-700 rounded'
          >
            Collapse All
          </button>
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-xs text-zinc-400 hover:text-white px-2 py-1 hover:bg-zinc-700 rounded'
            title={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? '⊟' : '⊞'}
          </button>
          <button
            type='button'
            onClick={onClose}
            className='p-1 hover:bg-zinc-700 rounded transition-colors text-muted'
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className='px-4 py-2 border-b border-zinc-700'>
        <div className='relative'>
          <Search
            size={14}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'
          />
          <input
            type='text'
            placeholder='Search routes by name, path, or title...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 pl-9 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500'
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white'
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div
        className={cn(
          'overflow-y-auto custom-scrollbar p-2 transition-all duration-300',
          isExpanded ? 'max-h-[calc(100vh-180px)]' : 'max-h-80',
        )}
      >
        {filteredTree.length > 0 ? (
          filteredTree.map((node, idx) => (
            <RouteTreeItem
              key={`${node.fullPath}-${idx}`}
              node={node}
              expandedPaths={displayExpandedPaths}
              toggleExpand={toggleExpand}
            />
          ))
        ) : (
          <div className='text-center py-8 text-zinc-500 text-xs'>
            No routes found matching "{searchQuery}"
          </div>
        )}
      </div>

      <div className='px-4 py-2 bg-zinc-900 border-t border-zinc-700 text-xs text-zinc-500'>
        Tip: Use <code className='text-emerald-400'>useNamedRoute()</code> hook
        with route names for type-safe navigation
      </div>
    </motion.div>
  );
};

// ============================================================================
// LOCALES PANEL
// ============================================================================

type TLocaleData = Record<string, unknown>;
type TNamespaceLocales = Record<string, TLocaleData>;

function getAvailableLanguages(): string[] {
  const resources = i18n.options.resources;
  return resources ? Object.keys(resources) : [];
}

function getNamespaces(): string[] {
  const resources = i18n.options.resources;
  if (!resources) return [];
  const allNamespaces = new Set<string>();
  Object.values(resources).forEach((langData) => {
    Object.keys(langData as object).forEach((ns) => allNamespaces.add(ns));
  });
  return Array.from(allNamespaces).sort();
}

function getLocaleData(namespace: string, lang: string): TLocaleData {
  const resources = i18n.options.resources;
  if (!resources || !resources[lang]) return {};
  return (resources[lang] as TNamespaceLocales)[namespace] || {};
}

function flattenObject(obj: TLocaleData, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as TLocaleData, newKey));
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

function getAllKeys(locales: Record<string, Record<string, string>>): string[] {
  const allKeys = new Set<string>();
  Object.values(locales).forEach((data) => {
    Object.keys(data).forEach((key) => allKeys.add(key));
  });
  return Array.from(allKeys).sort();
}

const LocalesPanel = ({ onClose }: { onClose: () => void }) => {
  const languages = useMemo(() => getAvailableLanguages(), []);
  const namespaces = useMemo(() => getNamespaces(), []);

  const [selectedNamespace, setSelectedNamespace] = useState<string>(
    namespaces[0] || '',
  );
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    languages.slice(0, 2),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const localeData = useMemo(() => {
    const data: Record<string, Record<string, string>> = {};
    selectedLangs.forEach((lang) => {
      const raw = getLocaleData(selectedNamespace, lang);
      data[lang] = flattenObject(raw);
    });
    return data;
  }, [selectedNamespace, selectedLangs]);

  const allKeys = useMemo(() => {
    const keys = getAllKeys(localeData);
    if (!searchQuery.trim()) return keys;
    const query = searchQuery.toLowerCase();
    return keys.filter((key) => {
      if (key.toLowerCase().includes(query)) return true;
      return selectedLangs.some((lang) =>
        localeData[lang]?.[key]?.toLowerCase().includes(query),
      );
    });
  }, [localeData, searchQuery, selectedLangs]);

  const toggleLang = (lang: string) => {
    setSelectedLangs((prev) => {
      if (prev.includes(lang)) {
        return prev.length > 1 ? prev.filter((l) => l !== lang) : prev;
      }
      return [...prev, lang];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-99999 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden pointer-events-auto transition-all duration-300',
        isExpanded
          ? 'w-[90vw] max-w-none'
          : 'w-[700px] max-w-[calc(100vw-2rem)]',
      )}
    >
      <div className='flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700'>
        <span className='text-sm font-semibold text-white'>
          Locales Viewer ({namespaces.length} namespaces)
        </span>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-xs text-zinc-400 hover:text-white px-2 py-1 hover:bg-zinc-700 rounded'
            title={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? '⊟' : '⊞'}
          </button>
          <button
            type='button'
            onClick={onClose}
            className='p-1 hover:bg-zinc-700 rounded transition-colors text-muted'
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className='px-4 py-2 border-b border-zinc-700 flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-zinc-400'>Namespace:</span>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className='bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-zinc-500'
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-xs text-zinc-400'>Languages:</span>
          <div className='flex gap-1'>
            {languages.map((lang) => (
              <button
                key={lang}
                type='button'
                onClick={() => toggleLang(lang)}
                className={cn(
                  'px-2 py-1 text-xs rounded transition-colors',
                  selectedLangs.includes(lang)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600',
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className='relative flex-1 min-w-48'>
          <Search
            size={14}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'
          />
          <input
            type='text'
            placeholder='Search keys or values...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1 pl-9 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500'
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white'
            >
              <X size={12} />
            </button>
          )}
        </div>

        <span className='text-xs text-zinc-500'>{allKeys.length} keys</span>
      </div>

      <div
        className={cn(
          'overflow-auto custom-scrollbar transition-all duration-300',
          isExpanded ? 'max-h-[calc(100vh-220px)]' : 'max-h-80',
        )}
      >
        <table className='w-full text-xs'>
          <thead className='bg-zinc-900 sticky top-0'>
            <tr>
              <th className='text-left px-4 py-2 text-zinc-400 font-medium border-b border-zinc-700 min-w-48'>
                Key
              </th>
              {selectedLangs.map((lang) => (
                <th
                  key={lang}
                  className='text-left px-4 py-2 text-zinc-400 font-medium border-b border-zinc-700 min-w-64'
                >
                  {lang.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => {
              const hasMissing = selectedLangs.some(
                (lang) => !localeData[lang]?.[key],
              );
              return (
                <tr
                  key={key}
                  className={cn(
                    'border-b border-zinc-700/50 hover:bg-zinc-700/30',
                    hasMissing && 'bg-rose-900/20',
                  )}
                >
                  <td className='px-4 py-2 font-mono text-zinc-300'>{key}</td>
                  {selectedLangs.map((lang) => {
                    const value = localeData[lang]?.[key];
                    return (
                      <td
                        key={lang}
                        className={cn(
                          'px-4 py-2',
                          value ? 'text-zinc-300' : 'text-rose-400 italic',
                        )}
                      >
                        {value || '(missing)'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {allKeys.length === 0 && (
          <div className='text-center py-8 text-zinc-500 text-xs'>
            {searchQuery
              ? `No keys found matching "${searchQuery}"`
              : 'No locale data available'}
          </div>
        )}
      </div>

      <div className='px-4 py-2 bg-zinc-900 border-t border-zinc-700 text-xs text-zinc-500'>
        Missing translations are highlighted in red
      </div>
    </motion.div>
  );
};

// ============================================================================
// MACOS DOCK STYLE TOOLBAR
// ============================================================================

/**
 * Dock Item Component with hover animation
 */
const DockItem = ({
  icon,
  label,
  onClick,
  active,
  color = 'zinc',
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  color?:
    | 'zinc'
    | 'amber'
    | 'blue'
    | 'purple'
    | 'rose'
    | 'emerald'
    | 'orange'
    | 'cyan';
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    zinc: 'text-zinc-300 bg-zinc-700/80 hover:bg-zinc-600/80',
    amber: 'text-amber-400 bg-amber-500/20 hover:bg-amber-500/30',
    blue: 'text-blue-400 bg-blue-500/20 hover:bg-blue-500/30',
    purple: 'text-purple-400 bg-purple-500/20 hover:bg-purple-500/30',
    rose: 'text-rose-400 bg-rose-500/20 hover:bg-rose-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/30',
    orange: 'text-orange-400 bg-orange-500/20 hover:bg-orange-500/30',
    cyan: 'text-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30',
  };

  return (
    <motion.button
      type='button'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='relative flex flex-col items-center group'
      whileHover={{ scale: 1.3, y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm',
          active ? 'bg-emerald-600/80 text-white' : colorClasses[color],
        )}
      >
        {icon}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className='absolute -top-8 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded whitespace-nowrap border border-zinc-700'
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active indicator dot */}
      {active && (
        <div className='absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400' />
      )}
    </motion.button>
  );
};

const DevToolbarInner = () => {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const {
    activeFormName,
    fillActiveForm,
    clearActiveForm,
    showGrid,
    toggleGrid,
    lastAction,
  } = useDevTools();
  const { breakpoint, width } = useBreakpoint();
  const [showRoutes, setShowRoutes] = useState(false);
  const [showLocales, setShowLocales] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleFillForm = () => {
    if (!activeFormName) return;
    void fillActiveForm();
  };

  const handleClearForm = () => {
    clearActiveForm();
  };

  const handleToggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = [
      'light',
      'dark',
      'system',
    ];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleToggleLocale = () => {
    const newLocale = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLocale).catch(() => {});
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={18} />;
    if (theme === 'system') return <Monitor size={18} />;
    return <Sun size={18} />;
  };

  return (
    <>
      {/* Routes Panel */}
      <AnimatePresence>
        {showRoutes && <RoutesPanel onClose={() => setShowRoutes(false)} />}
      </AnimatePresence>

      {/* Locales Panel */}
      <AnimatePresence>
        {showLocales && <LocalesPanel onClose={() => setShowLocales(false)} />}
      </AnimatePresence>

      {/* Action Animation Overlay */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-99998 pointer-events-none flex items-center justify-center'
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 0.6 }}
              className={cn(
                'absolute inset-0',
                lastAction === 'fill' ? 'bg-emerald-500' : 'bg-orange-500',
              )}
            />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 12,
              }}
              className={cn(
                'relative z-10 rounded-full p-6',
                lastAction === 'fill'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-orange-500 text-white',
              )}
            >
              {lastAction === 'fill' ? (
                <Sparkles size={48} />
              ) : (
                <Trash2 size={48} />
              )}
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn(
                'absolute rounded-full w-24 h-24',
                lastAction === 'fill' ? 'bg-emerald-500' : 'bg-orange-500',
              )}
            />

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: 1,
                  x: Math.cos((i * Math.PI) / 4) * 150,
                  y: Math.sin((i * Math.PI) / 4) * 150,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
                className={cn(
                  'absolute w-3 h-3 rounded-full',
                  lastAction === 'fill' ? 'bg-emerald-400' : 'bg-orange-400',
                )}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className='absolute bottom-1/3 text-white font-bold text-xl tracking-wider'
            >
              {lastAction === 'fill' ? 'FILLED!' : 'CLEARED!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* macOS Dock Style Toolbar */}
      <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-99999 pointer-events-auto'>
        <AnimatePresence mode='wait'>
          {isVisible ? (
            <motion.div
              key='dock'
              initial={{ y: 60, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              className='flex items-end gap-1 px-3 py-2 bg-black backdrop-blur-xl rounded-2xl shadow-2xl'
            >
              <div className='flex flex-col'>
                {/* Branding */}
                <div className='flex items-center gap-1.5 px-2 py-1 mb-1'>
                  <Rocket size={10} className='text-emerald-400' />
                  <span className='text-[7px] font-bold text-white tracking-wide'>
                    ROKETIN DEV TOOLS
                  </span>
                </div>

                {/* Breakpoint Badge */}
                <div className='flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900/80 text-[10px] font-mono'>
                  <span className='text-emerald-400 font-bold'>
                    {breakpoint.toUpperCase()}
                  </span>
                  <span className='text-zinc-500'>{width}px</span>
                </div>
              </div>

              {/* Separator */}
              <div className='w-px h-8 bg-zinc-600/50 mx-1' />

              {/* Theme */}
              <DockItem
                icon={getThemeIcon()}
                label={`Theme: ${theme}`}
                onClick={handleToggleTheme}
                color='amber'
              />

              {/* Locale */}
              <DockItem
                icon={<Languages size={18} />}
                label={`Language: ${i18n.language.toUpperCase()}`}
                onClick={handleToggleLocale}
                color='blue'
              />

              {/* Grid */}
              <DockItem
                icon={<Grid3X3 size={18} />}
                label='Toggle Grid'
                onClick={toggleGrid}
                active={showGrid}
                color='purple'
              />

              {/* Routes */}
              <DockItem
                icon={<Route size={18} />}
                label='Routes'
                onClick={() => {
                  setShowRoutes(!showRoutes);
                  if (!showRoutes) setShowLocales(false);
                }}
                active={showRoutes}
                color='cyan'
              />

              {/* Locales */}
              <DockItem
                icon={<Globe size={18} />}
                label='Locales'
                onClick={() => {
                  setShowLocales(!showLocales);
                  if (!showLocales) setShowRoutes(false);
                }}
                active={showLocales}
                color='emerald'
              />

              {/* Form Tools (if active) */}
              {activeFormName && (
                <>
                  {/* Separator */}
                  <div className='w-px h-8 bg-zinc-600/50 mx-1' />

                  <DockItem
                    icon={<FlaskConical size={18} />}
                    label={`Fill: ${activeFormName}`}
                    onClick={handleFillForm}
                    color='emerald'
                  />

                  <DockItem
                    icon={<Eraser size={18} />}
                    label={`Clear: ${activeFormName}`}
                    onClick={handleClearForm}
                    color='orange'
                  />
                </>
              )}

              {/* Separator */}
              <div className='w-px h-8 bg-zinc-600/50 mx-1' />

              {/* Toggle Visibility */}
              <DockItem
                icon={<X size={18} />}
                label='Hide Dock'
                onClick={() => setIsVisible(false)}
                color='rose'
              />
            </motion.div>
          ) : (
            <RTooltip content='Show Dock' side='top'>
              <motion.button
                key='fab'
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                type='button'
                onClick={() => setIsVisible(true)}
                className='w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-600 backdrop-blur-xl rounded-full border border-emerald-400/30 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white hover:shadow-emerald-500/40 hover:shadow-xl'
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    x: [0, 1, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Rocket size={20} />
                </motion.div>
              </motion.button>
            </RTooltip>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

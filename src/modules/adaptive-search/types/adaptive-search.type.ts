import type { LucideIcon } from 'lucide-react';
import type { TPermission } from '@/modules/app/constants/permission.constant';

/**
 * Type for searchable item (unified type for menu, action, and data)
 */
export type TSearchableItem = {
  id: string;
  type: 'menu' | 'action' | 'data';
  title: string;
  path?: string;
  module: string;
  moduleTitle: string;
  icon?: LucideIcon;
  badge?: string;
  keywords?: string[];
  keywordsText?: string;
  permission?: TPermission | TPermission[];
  titleKey?: string;
  // For action type items
  actionType?: 'navigate' | 'navigate-with-query' | 'custom';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionPayload?: Record<string, any>;
  // For data type items (from API)
  _raw?: TApiSearchResultItem;
};

/**
 * Type for menu item (from sidebar)
 */
export type TSearchableMenuItem = TSearchableItem & {
  type: 'menu';
};

/**
 * Type for action context (injected to action handlers)
 */
export type TActionContext = {
  getCurrentQuery: () => string;
  /** Navigate using path directly */
  navigate: (path: string) => void;
  /** Navigate using route name with params and query */
  navigateByName: (
    name: string,
    params?: Record<string, string>,
    options?: { query?: Record<string, string | number | boolean> },
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openDialog?: (dialogId: string, data?: any) => void;
};

/**
 * Type for search action definition (static actions from config)
 */
export type TSearchActionDefinition = {
  id: string;
  moduleId: string;
  titleKey: string;
  badge: string;
  icon?: LucideIcon;
  permission?: TPermission | TPermission[];
  keywords?: string[];

  // Navigation options (declarative)
  routeName?: string;
  queryParams?: Record<string, string>;

  // Action types
  actionType?: 'navigate' | 'navigate-with-query' | 'custom';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionPayload?: Record<string, any>;

  // Custom execution (factory pattern)
  createExecutor?: (context: TActionContext) => () => void;

  // Legacy support
  onExecute?: () => void;
};

/**
 * Type for API search result item (from backend)
 */
export type TApiSearchResultItem = {
  module: string;
  id: string;
  label: string;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * Type for API mapping config per module
 */
export type TApiMappingConfig = {
  moduleId: string;

  /**
   * Optional: Permission required to see items from this module
   */
  permission?: TPermission | TPermission[];

  /**
   * Transform API item to SearchableItem
   */
  transform: (apiItem: TApiSearchResultItem) => TSearchableItem;

  /**
   * Handle item selection
   */
  onSelect: (apiItem: TApiSearchResultItem, context: TActionContext) => void;

  /**
   * Optional: Filter which API items belong to this module
   */
  filter?: (apiItem: TApiSearchResultItem) => boolean;

  /**
   * Optional: Custom icon mapping
   */
  getIcon?: (apiItem: TApiSearchResultItem) => LucideIcon;

  /**
   * Optional: Custom badge mapping
   */
  getBadge?: (apiItem: TApiSearchResultItem) => string;

  /**
   * Optional: Keywords for search
   */
  getKeywords?: (apiItem: TApiSearchResultItem) => string[];

  /**
   * Optional: Get permission for specific API item (for action-based permissions)
   */
  getPermission?: (
    apiItem: TApiSearchResultItem,
  ) => TPermission | TPermission[] | undefined;
};

/**
 * Type for adaptive search config (per module)
 */
export type TAdaptiveSearchConfig = {
  // Static actions
  actions?: TSearchActionDefinition[];

  // API mapping for dynamic data
  apiMapping?: TApiMappingConfig;
};

/**
 * Type for module option (filter dropdown)
 */
export type TModuleOption = {
  value: string;
  label: string;
};

/**
 * Type for search tracking data (stored in localStorage)
 */
export type TSearchTrackingData = {
  recent: string[];
  accessCount: Record<string, number>;
  searchKeywords?: Record<string, string>;
  lastUpdated: number;
};

/**
 * Type for parsed search query (with identifier)
 */
export type TParsedSearchQuery = {
  hasIdentifier: boolean;
  identifier: string | null;
  query: string;
};

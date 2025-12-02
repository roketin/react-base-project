/**
 * Adaptive Search Module
 *
 * A modular, reusable search system that combines:
 * - Static actions from local config files (*.config.search.ts)
 * - Dynamic data from API
 * - Fuzzy search with Fuse.js
 * - Recent history tracking
 * - Module filtering
 *
 * @example
 * ```tsx
 * import { RAdaptiveSearch, RAdaptiveSearchTrigger } from '@/modules/adaptive-search';
 *
 * function AppLayout() {
 *   return (
 *     <>
 *       <RAdaptiveSearchTrigger />
 *       <RAdaptiveSearch apiEnabled={true} />
 *     </>
 *   );
 * }
 * ```
 */

// Components
export { RAdaptiveSearch } from './components/r-adaptive-search';
export { RAdaptiveSearchTrigger } from './components/r-adaptive-search-trigger';
export { RSearchResultItem } from './components/r-search-result-item';

// Hooks
export { useSearchEngine } from './hooks/use-search-engine';

// Store
export { useAdaptiveSearchStore } from './stores/adaptive-search.store';

// Services
export { useSearchAdaptiveData } from './services/adaptive-search.service';

// Types
export type {
  TSearchableItem,
  TSearchActionDefinition,
  TApiSearchResultItem,
  TApiMappingConfig,
  TAdaptiveSearchConfig,
  TActionContext,
  TModuleOption,
  TSearchTrackingData,
} from './types/adaptive-search.type';

import { useEffect } from 'react';
import {
  type BreadcrumbType,
  type ResolverFn,
  useBreadcrumbStore,
} from '@/modules/app/stores/breadcrumbs.store';

/**
 * Registers a breadcrumb label resolver for the given type and cleans it up automatically.
 *
 * @example
 * useBreadcrumbLabel('user', (id) => userMap[id]?.name ?? id);
 */
export function useBreadcrumbLabel(
  type: BreadcrumbType,
  resolver?: ResolverFn | null,
) {
  const register = useBreadcrumbStore((state) => state.register);
  const unregister = useBreadcrumbStore((state) => state.unregister);

  useEffect(() => {
    if (resolver) {
      register(type, resolver);
      return () => unregister(type);
    }

    unregister(type);
    return undefined;
  }, [type, resolver, register, unregister]);
}

/**
 * Clears all breadcrumb resolvers. Helpful when you need a clean slate after leaving a section.
 */
export function useResetBreadcrumbResolvers(trigger?: unknown) {
  const clear = useBreadcrumbStore((state) => state.clear);

  useEffect(() => {
    clear();
  }, [clear, trigger]);
}

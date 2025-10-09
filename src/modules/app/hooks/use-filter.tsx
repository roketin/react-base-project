/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TFilterItem } from '@/modules/app/libs/filter-utils';
import type { TRoketinFilterPersistenceConfig } from '@/modules/app/types/app.type';
import roketinConfig from '@config';
import { useCallback, useMemo, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';

type FilterValues = Record<string, any>;

type Action =
  | { type: 'SET'; id: string; value: any }
  | { type: 'RESET'; initial: FilterValues };

function safeParse<T>(str: string | null): T | null {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

const defaultEnabledPersistence = {
  enabled: true,
  strategy: 'local-storage' as const,
  keyPrefix: 'filter_',
  debounceMs: 200,
};

type ResolvedPersistence =
  | { enabled: false }
  | {
      enabled: true;
      strategy: 'local-storage' | 'session-storage' | 'query-params';
      keyPrefix: string;
      debounceMs: number;
    };

function resolvePersistenceConfig(
  config: TRoketinFilterPersistenceConfig | undefined,
): ResolvedPersistence {
  if (!config) {
    return { ...defaultEnabledPersistence };
  }

  if (!config.enabled) {
    return { enabled: false };
  }

  return {
    enabled: true,
    strategy: config.strategy,
    keyPrefix: config.keyPrefix ?? defaultEnabledPersistence.keyPrefix,
    debounceMs: config.debounceMs ?? defaultEnabledPersistence.debounceMs,
  };
}

const resolvedPersistence = resolvePersistenceConfig(
  roketinConfig.filters?.persistence,
);

const persistenceEnabled = resolvedPersistence.enabled;
const persistenceKeyPrefix = resolvedPersistence.enabled
  ? resolvedPersistence.keyPrefix
  : defaultEnabledPersistence.keyPrefix;
const persistenceDebounce = resolvedPersistence.enabled
  ? resolvedPersistence.debounceMs
  : defaultEnabledPersistence.debounceMs;
const persistenceStrategy = resolvedPersistence.enabled
  ? resolvedPersistence.strategy
  : undefined;

function generateStorageKey(custom: string | undefined) {
  if (custom) return `${persistenceKeyPrefix}${custom}`;
  if (typeof window === 'undefined') {
    return `${persistenceKeyPrefix}default`;
  }
  const pathname = window.location?.pathname.replace(/\//g, '_') || 'root';
  return `${persistenceKeyPrefix}${pathname}`;
}

export function useFilter(items: TFilterItem[], persistKey?: string) {
  const storageKey = useMemo(
    () => generateStorageKey(persistKey),
    [persistKey],
  );

  const initialValues = useMemo<FilterValues>(() => {
    const init: FilterValues = {};
    for (const item of items) init[item.id] = item.defaultValue ?? null;
    return init;
  }, [items]);

  const [values, dispatch] = useImmerReducer<
    FilterValues,
    Action,
    FilterValues
  >(
    (draft, action) => {
      switch (action.type) {
        case 'SET':
          if (draft[action.id] === action.value) return;
          draft[action.id] = action.value;
          break;
        case 'RESET':
          Object.keys(draft).forEach((k) => {
            draft[k] = action.initial[k] ?? null;
          });
          break;
      }
    },
    initialValues,
    (init: FilterValues) => {
      if (!persistenceEnabled || typeof window === 'undefined') return init;
      const strategy =
        persistenceStrategy ?? defaultEnabledPersistence.strategy;

      if (strategy === 'query-params') {
        const params = new URLSearchParams(window.location.search);
        const stored = safeParse<FilterValues>(params.get(storageKey));
        return stored ? { ...init, ...stored } : init;
      }

      const storage =
        strategy === 'session-storage'
          ? window.sessionStorage
          : window.localStorage;
      const stored = safeParse<FilterValues>(storage.getItem(storageKey));
      return stored ? { ...init, ...stored } : init;
    },
  );

  const setValue = useCallback(
    (id: string, value: any) => {
      dispatch({ type: 'SET', id, value });
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', initial: initialValues });
    if (typeof window !== 'undefined' && persistenceEnabled) {
      const strategy =
        persistenceStrategy ?? defaultEnabledPersistence.strategy;
      if (strategy === 'query-params') {
        const url = new URL(window.location.href);
        url.searchParams.delete(storageKey);
        window.history.replaceState(
          null,
          '',
          `${url.pathname}${url.search}${url.hash}`,
        );
      } else {
        const storage =
          strategy === 'session-storage'
            ? window.sessionStorage
            : window.localStorage;
        storage.removeItem(storageKey);
      }
    }
    return { ...initialValues };
  }, [dispatch, initialValues, storageKey]);

  const getParams = useCallback(() => {
    return Object.entries(values)
      .filter(([, value]) => value != null)
      .reduce<Record<string, any>>((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
  }, [values]);

  // persist effect
  useEffect(() => {
    if (!persistenceEnabled || typeof window === 'undefined') return undefined;
    const strategy = persistenceStrategy ?? defaultEnabledPersistence.strategy;
    const delay = persistenceDebounce ?? defaultEnabledPersistence.debounceMs;

    const timeout = window.setTimeout(() => {
      const serialized = JSON.stringify(values);
      if (strategy === 'query-params') {
        const url = new URL(window.location.href);
        if (Object.keys(values).some((key) => values[key] != null)) {
          url.searchParams.set(storageKey, serialized);
        } else {
          url.searchParams.delete(storageKey);
        }
        window.history.replaceState(
          null,
          '',
          `${url.pathname}${url.search}${url.hash}`,
        );
        return;
      }

      const storage =
        strategy === 'session-storage'
          ? window.sessionStorage
          : window.localStorage;
      storage.setItem(storageKey, serialized);
    }, delay);

    return () => clearTimeout(timeout);
  }, [values, storageKey]);

  return useMemo(
    () => ({
      values,
      setValue,
      reset,
      getParams,
      storageKey,
    }),
    [values, setValue, reset, getParams, storageKey],
  );
}

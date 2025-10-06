/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TFilterItem } from '@/modules/app/libs/filter-utils';
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

function generateStorageKey(custom?: string) {
  if (custom) return `filter_${custom}`;
  if (typeof window === 'undefined') return 'filter_default';
  const pathname = window.location?.pathname.replace(/\//g, '_') || 'root';
  return `filter${pathname}`;
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
      if (typeof window === 'undefined') return init;
      const stored = safeParse<FilterValues>(
        window.localStorage.getItem(storageKey),
      );
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
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
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
    if (typeof window === 'undefined') return undefined;
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    }, 200);
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

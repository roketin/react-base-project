import { useReducer, useCallback } from 'react';
import { produce } from 'immer';

type Updater<T> = Partial<T> | ((draft: T) => void);

export function useObjectState<T extends object>(
  initialValues: T,
): [T, (updater: Updater<T>) => void] {
  const [state, dispatch] = useReducer((prev: T, updater: Updater<T>): T => {
    if (typeof updater === 'function') {
      return produce(prev, updater as (draft: T) => void);
    }
    return { ...prev, ...updater };
  }, initialValues);

  const setState = useCallback((updater: Updater<T>) => dispatch(updater), []);

  return [state, setState];
}

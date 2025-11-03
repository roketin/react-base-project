import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFilter } from '@/modules/app/hooks/use-filter';
import type { TFilterItem } from '@/modules/app/libs/filter-utils';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import { ChevronDown, Filter as FilterIcon } from 'lucide-react';

type BaseProps = {
  schema: TFilterItem[];
  storageKey?: string;
  keyMap?: ((key: string) => string) | Record<string, string>;
};

export type RFilterMenuProps = BaseProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReset?: (values: Record<string, any>) => void;
  buttonText?: string;
};

export type RFilterBarProps = BaseProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (values: Record<string, any>) => void;
  layout?: 'stack' | 'grid';
  columns?: 2 | 3 | 4;
};

/**
 * Serialize filter values to JSON string for snapshot comparison.
 * Dates are converted to ISO strings for consistent serialization.
 */
const serialize = (rec: Record<string, unknown>) =>
  JSON.stringify(rec, (_, v) => (v instanceof Date ? v.toISOString() : v));

const useSnapshots = (
  schema: TFilterItem[],
  values: Record<string, unknown>,
) => {
  const defaultSnapshot = useMemo(() => {
    const rec: Record<string, unknown> = {};
    for (const item of schema) rec[item.id] = item.defaultValue ?? null;
    return serialize(rec);
  }, [schema]);

  const currentSnapshot = useMemo(() => serialize(values), [values]);
  return { defaultSnapshot, currentSnapshot };
};

/**
 * Maps filter keys according to the mapKey prop.
 * Supports flattening nested objects into bracket notation keys.
 * Returns a new object with keys transformed by mapKey function or mapping object.
 *
 * @param {Record<string, unknown>} obj - Original filter params.
 * @returns {Record<string, unknown>} Mapped and flattened filter params.
 */
const useMapFilterKeys = (
  keyMap?: ((key: string) => string) | Record<string, string>,
) => {
  return useCallback(
    (obj: Record<string, unknown>): Record<string, unknown> => {
      if (!keyMap) return obj;
      const result: Record<string, unknown> = {};

      const flattenAndMap = (prefix: string, value: unknown) => {
        const isPlainObject =
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          !(value instanceof Date);

        if (isPlainObject) {
          for (const [subKey, subVal] of Object.entries(value)) {
            flattenAndMap(`${prefix}[${subKey}]`, subVal);
          }
        } else {
          let mappedKey = prefix;
          if (typeof keyMap === 'function') {
            mappedKey = keyMap(prefix);
          } else if (typeof keyMap === 'object') {
            if (keyMap[mappedKey]) {
              mappedKey = keyMap[mappedKey];
            } else {
              const baseKey = mappedKey.split('[')[0];
              if (keyMap[baseKey]) {
                mappedKey = mappedKey.replace(baseKey, keyMap[baseKey]);
              }
            }
          }
          result[mappedKey] = value;
        }
      };

      for (const [key, val] of Object.entries(obj)) flattenAndMap(key, val);
      return result;
    },
    [keyMap],
  );
};

/**
 * RFilterField renders a single filter input field based on the filter item.
 * It displays label if provided and invokes item's render method with current value and onChange handler.
 *
 * @param {object} props - Component props.
 * @param {TFilterItem} props.item - Filter item metadata and render function.
 * @param {*} props.value - Current value of the filter field.
 * @param {(id: string, val: any) => void} props.onChange - Callback for value changes.
 * @returns JSX element of the filter field.
 */
const RFilterField = memo(
  ({
    item,
    value,
    onChange,
    withLabel = true,
  }: {
    item: TFilterItem;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (id: string, val: any) => void;
    withLabel?: boolean;
  }) => {
    return (
      <div className={withLabel ? 'space-y-1' : undefined}>
        {withLabel && item.label && (
          <label className='block text-xs font-semibold uppercase text-muted-foreground'>
            {item.label}
          </label>
        )}
        {item.render({
          value,
          onChange: (next) => onChange(item.id, next),
        })}
      </div>
    );
  },
);
RFilterField.displayName = 'RFilterField';

/**
 * RFilterBar renders an inline, auto-applying collection of filter fields.
 * It keeps state via `useFilter`, supports persistence through `storageKey`,
 * transforms outgoing keys with `keyMap`, and emits `onChange` whenever the
 * params change (including a one-time auto-emit on mount if
 * persisted values differ from defaults).
 *
 * Layout can be a responsive grid (2/3/4 columns) or a vertical stack.
 *
 * @param {RFilterBarProps} props - Component props including schema, persistence key,
 * key mapping, live-change handler, and layout options.
 * @returns JSX element rendering inline filter fields that auto-apply.
 */
export function RFilterBar({
  schema,
  storageKey,
  keyMap,
  onChange,
  layout = 'grid',
  columns = 3,
}: RFilterBarProps) {
  // Filter state + utilities
  const { values, setValue, getParams } = useFilter(schema, storageKey);

  // Snapshots used to detect default vs current (for first-run auto-emit)
  const { defaultSnapshot, currentSnapshot } = useSnapshots(schema, values);

  // Optional map of outgoing keys (supports bracket paths)
  const mapFilterKeys = useMapFilterKeys(keyMap);

  // Keep latest onChange without retriggering effects
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Throttle duplicate emits: remember what we already emitted
  const lastEmittedRef = useRef<string>('');
  const isFirstRunRef = useRef(true);

  // Emit mapped params:
  // - once on mount if persisted != default
  // - thereafter whenever the current snapshot changes
  useEffect(() => {
    const params = getParams();
    const mapped = mapFilterKeys(params);

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      if (currentSnapshot !== defaultSnapshot) {
        lastEmittedRef.current = currentSnapshot;
        onChangeRef.current?.(mapped as Record<string, unknown>);
      }
      return;
    }

    if (currentSnapshot !== lastEmittedRef.current) {
      lastEmittedRef.current = currentSnapshot;
      onChangeRef.current?.(mapped as Record<string, unknown>);
    }
  }, [currentSnapshot, defaultSnapshot, getParams, mapFilterKeys]);

  // Prepare fields for rendering
  const fields = useMemo(
    () =>
      schema.map((item) => ({
        item,
        id: item.id,
        value: values[item.id] ?? null,
      })),
    [schema, values],
  );

  // Responsive layout classes
  const gridCls =
    layout === 'grid'
      ? {
          2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
          3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
          4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        }[columns]
      : 'flex flex-col gap-4';

  /**
   * Updates the value of a specific filter field by id.
   *
   * @param {string} id - Filter field identifier.
   * @param {unknown} value - New value to set.
   */
  const handleFieldChange = useCallback(
    (id: string, value: unknown) => setValue(id, value),
    [setValue],
  );

  return (
    <div className={gridCls}>
      {fields.map(({ item, id, value }) => (
        <RFilterField
          key={id}
          item={item}
          value={value}
          onChange={handleFieldChange}
          withLabel={false}
        />
      ))}
    </div>
  );
}

/**
 * RFilter is a reusable popover filter component managing multiple filter fields.
 * It maintains filter state, supports persistence via a storage key, and triggers callbacks on apply/reset.
 * It auto-applies filters on mount if persisted values exist.
 *
 * @param {TRFilterMenuProps} props - Component props including filter items, callbacks, persistence key, and key mapping.
 * @returns JSX element rendering a filter button and popover with filter fields.
 */
export function RFilterMenu({
  schema,
  storageKey,
  keyMap,
  onSubmit,
  onReset,
  buttonText = 'Filter',
}: RFilterMenuProps) {
  const { values, setValue, reset, getParams } = useFilter(schema, storageKey);
  const { defaultSnapshot, currentSnapshot } = useSnapshots(schema, values);
  const mapFilterKeys = useMapFilterKeys(keyMap);

  const [lastAppliedSnapshot, setLastAppliedSnapshot] =
    useState(currentSnapshot);

  const [open, setOpen] = useState(false);

  // Track whether filters have been applied beyond their defaults
  const [applied, setApplied] = useState(currentSnapshot !== defaultSnapshot);

  // Detect if there are unsaved changes by comparing snapshots
  const hasChanges = currentSnapshot !== lastAppliedSnapshot;

  /**
   * Auto-apply persisted filters on component mount.
   * Calls onApply with mapped keys if any persisted filters exist.
   */
  useEffect(() => {
    const params = getParams();
    if (Object.keys(params).length > 0 && currentSnapshot !== defaultSnapshot) {
      const mapped = mapFilterKeys(params);
      onSubmit?.(mapped);
      setApplied(true);
      setLastAppliedSnapshot(currentSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Updates the value of a specific filter field by id.
   *
   * @param {string} id - Filter field identifier.
   * @param {unknown} value - New value to set.
   */
  const handleFieldChange = useCallback(
    (id: string, value: unknown) => setValue(id, value),
    [setValue],
  );

  // Prepare fields data for rendering filter inputs
  const fields = useMemo(
    () =>
      schema.map((item) => ({
        item,
        id: item.id,
        value: values[item.id] ?? null,
      })),
    [schema, values],
  );

  /**
   * Applies current filter values.
   * Calls onApply with mapped filter params, closes popover, updates applied state and snapshot.
   */
  const handleApply = useCallback(() => {
    const params = getParams();
    const mapped = mapFilterKeys(params);
    onSubmit?.(mapped);
    setOpen(false);
    setApplied(currentSnapshot !== defaultSnapshot);
    setLastAppliedSnapshot(currentSnapshot);
  }, [onSubmit, getParams, mapFilterKeys, currentSnapshot, defaultSnapshot]);

  /**
   * Resets all filters to default/cleared state.
   * Calls onReset with mapped cleared values, closes popover, updates applied state and snapshot.
   * Ensures all mapped keys exist in cleared values with null if missing.
   */
  const handleReset = useCallback(() => {
    const cleared = reset();
    const mappedCleared = mapFilterKeys(cleared);
    if (typeof keyMap === 'object' && keyMap !== null) {
      for (const targetKey of Object.values(keyMap)) {
        if (!(targetKey in mappedCleared)) {
          (mappedCleared as Record<string, unknown>)[targetKey] = null;
        }
      }
    }
    onReset?.(mappedCleared);
    setOpen(false);
    setApplied(false);
    setLastAppliedSnapshot(serialize(cleared));
  }, [reset, onReset, mapFilterKeys, keyMap]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='relative'>
          <FilterIcon />
          {buttonText}
          <ChevronDown />
          {applied && (
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-primary' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='p-0 border-none shadow-none bg-transparent'
      >
        <div className='space-y-4 rounded-xl border p-4 shadow-sm bg-background'>
          {fields.map(({ item, id, value }) => (
            <RFilterField
              key={id}
              item={item}
              value={value}
              onChange={handleFieldChange}
            />
          ))}

          <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
            <Button variant='outline' onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply} disabled={!hasChanges}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

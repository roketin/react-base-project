import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFilter } from '@/modules/app/hooks/use-filter';
import type { TFilterItem } from '@/modules/app/libs/filter-utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/modules/app/components/ui/popover';
import RBtn from '@/modules/app/components/base/r-btn';
import { ChevronDown, Filter as FilterIcon } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type KeyMapper = ((key: string) => string) | Record<string, string>;

type BaseProps = {
  schema: TFilterItem[];
  storageKey?: string;
  keyMap?: KeyMapper;
};

export type RFilterMenuProps = BaseProps & {
  onSubmit?: (values: Record<string, unknown>) => void;
  onReset?: (values: Record<string, unknown>) => void;
  buttonText?: string;
};

export type RFilterBarProps = BaseProps & {
  onChange?: (values: Record<string, unknown>) => void;
  layout?: 'stack' | 'grid';
  columns?: 2 | 3 | 4;
};

// ============================================================================
// Utilities
// ============================================================================

/**
 * Serialize values to JSON for comparison
 */
const serialize = (values: Record<string, unknown>): string =>
  JSON.stringify(values, (_, v) => (v instanceof Date ? v.toISOString() : v));

/**
 * Get default values from schema
 */
const getDefaultValues = (schema: TFilterItem[]): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const item of schema) {
    defaults[item.id] = item.defaultValue ?? null;
  }
  return defaults;
};

/**
 * Map filter keys according to keyMap
 */
const mapKeys = (
  values: Record<string, unknown>,
  keyMap?: KeyMapper,
): Record<string, unknown> => {
  if (!keyMap) return values;

  const result: Record<string, unknown> = {};

  const processValue = (key: string, value: unknown) => {
    // Handle nested objects (flatten to bracket notation)
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      for (const [subKey, subVal] of Object.entries(value)) {
        processValue(`${key}[${subKey}]`, subVal);
      }
      return;
    }

    // Map the key
    let mappedKey = key;
    if (typeof keyMap === 'function') {
      mappedKey = keyMap(key);
    } else if (key in keyMap) {
      mappedKey = keyMap[key];
    } else {
      // Try to map base key for bracket notation
      const baseKey = key.split('[')[0];
      if (baseKey in keyMap) {
        mappedKey = key.replace(baseKey, keyMap[baseKey]);
      }
    }

    result[mappedKey] = value;
  };

  for (const [key, value] of Object.entries(values)) {
    processValue(key, value);
  }

  return result;
};

/**
 * Count active filters compared to defaults.
 */
const countActiveFilters = (
  values: Record<string, unknown>,
  schema: TFilterItem[],
): number => {
  const defaults = getDefaultValues(schema);

  return Object.entries(values).filter(([key, value]) => {
    const defaultValue = defaults[key];
    if (value === null || value === undefined) return false;
    if (value === defaultValue) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (
      typeof value === 'object' &&
      !(value instanceof Date) &&
      Object.keys(value as Record<string, unknown>).length === 0
    ) {
      return false;
    }
    if (value === false) return false;
    return true;
  }).length;
};

// ============================================================================
// Components
// ============================================================================

/**
 * Single filter field
 */
const RFilterField = memo(
  ({
    item,
    value,
    onChange,
    withLabel = true,
  }: {
    item: TFilterItem;
    value: unknown;
    onChange: (id: string, value: unknown) => void;
    withLabel?: boolean;
  }) => (
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
  ),
);
RFilterField.displayName = 'RFilterField';

/**
 * Inline filter bar with auto-apply
 */
export function RFilterBar({
  schema,
  storageKey,
  keyMap,
  onChange,
  layout = 'grid',
  columns = 3,
}: RFilterBarProps) {
  const { values, setValue, getParams } = useFilter(schema, storageKey);
  const onChangeRef = useRef(onChange);
  const isFirstRender = useRef(true);
  const lastEmitted = useRef('');

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Emit changes
  useEffect(() => {
    const params = getParams();
    const mapped = mapKeys(params, keyMap);
    const snapshot = serialize(mapped);

    // Skip if already emitted
    if (snapshot === lastEmitted.current) return;

    // On first render, only emit if has persisted values
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const defaults = getDefaultValues(schema);
      const defaultSnapshot = serialize(defaults);
      if (snapshot !== defaultSnapshot) {
        lastEmitted.current = snapshot;
        onChangeRef.current?.(mapped);
      }
      return;
    }

    // Emit on subsequent changes
    lastEmitted.current = snapshot;
    onChangeRef.current?.(mapped);
  }, [values, getParams, keyMap, schema]);

  // Grid layout classes
  const gridClass =
    layout === 'grid'
      ? {
          2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
          3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
          4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        }[columns]
      : 'flex flex-col gap-4';

  return (
    <div className={gridClass}>
      {schema.map((item) => (
        <RFilterField
          key={item.id}
          item={item}
          value={values[item.id] ?? null}
          onChange={setValue}
          withLabel={false}
        />
      ))}
    </div>
  );
}

/**
 * Filter menu with popover
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
  const [open, setOpen] = useState(false);
  const [lastApplied, setLastApplied] = useState('');
  const [appliedValues, setAppliedValues] = useState<Record<string, unknown>>(
    () => getDefaultValues(schema),
  );

  const currentSnapshot = useMemo(() => serialize(values), [values]);
  const hasChanges = currentSnapshot !== lastApplied;

  // Count active filters based on last applied values
  const activeFilterCount = useMemo(
    () => countActiveFilters(appliedValues, schema),
    [appliedValues, schema],
  );

  // Auto-apply on mount if has persisted values
  useEffect(() => {
    const params = getParams();
    const defaults = getDefaultValues(schema);
    const defaultSnapshot = serialize(defaults);
    const currentSnapshot = serialize(values);

    if (currentSnapshot !== defaultSnapshot) {
      const mapped = mapKeys(params, keyMap);
      onSubmit?.(mapped);
      setLastApplied(currentSnapshot);
      setAppliedValues(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = useCallback(() => {
    const params = getParams();
    const mapped = mapKeys(params, keyMap);
    onSubmit?.(mapped);
    setOpen(false);
    setLastApplied(currentSnapshot);
    setAppliedValues(params);
  }, [getParams, keyMap, onSubmit, currentSnapshot]);

  const handleReset = useCallback(() => {
    const cleared = reset();
    const mapped = mapKeys(cleared, keyMap);

    // Ensure all mapped keys exist with null
    if (typeof keyMap === 'object') {
      for (const targetKey of Object.values(keyMap)) {
        if (!(targetKey in mapped)) {
          mapped[targetKey] = null;
        }
      }
    }

    onReset?.(mapped);
    setOpen(false);
    setLastApplied(serialize(cleared));
    setAppliedValues(cleared);
  }, [reset, keyMap, onReset]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <RBtn variant='outline'>
          <FilterIcon />
          {buttonText}
          {activeFilterCount > 0 && (
            <span className='ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground'>
              {activeFilterCount}
            </span>
          )}
          <ChevronDown />
        </RBtn>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='p-0 border-none shadow-none bg-transparent w-96'
      >
        <div className='rounded-xl border shadow-sm bg-card flex flex-col max-h-[50vh]'>
          {/* Filter fields */}
          <div className='overflow-y-auto overflow-x-hidden custom-scrollbar p-4 space-y-4 flex-1 min-h-0'>
            {schema.map((item) => (
              <RFilterField
                key={item.id}
                item={item}
                value={values[item.id] ?? null}
                onChange={setValue}
              />
            ))}
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2 px-4 pb-5 rounded-b-lg sticky bottom-0'>
            <RBtn variant='outline' onClick={handleReset}>
              Reset
            </RBtn>
            <RBtn onClick={handleApply} disabled={!hasChanges}>
              Apply
            </RBtn>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

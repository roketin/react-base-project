import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import { useFilter } from '@/modules/app/hooks/use-filter';
import type { TFilterItem } from '@/modules/app/libs/filter-utils';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';

type TRFilterProps = {
  items: TFilterItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onApply?: (values: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReset?: (values: Record<string, any>) => void;
  persistKey?: string;
  /**
   * mapKey can be either a function that maps a key string to another string,
   * or an object that maps keys to new keys.
   */
  mapKey?: ((key: string) => string) | Record<string, string>;
};

export type TAnyFilterItem =
  | TFilterItem<string | null>
  | TFilterItem<string[] | null>
  | TFilterItem<Date | null>;

/**
 * RFilter is a reusable popover filter component managing multiple filter fields.
 * It maintains filter state, supports persistence via a storage key, and triggers callbacks on apply/reset.
 * It auto-applies filters on mount if persisted values exist.
 *
 * @param {TRFilterProps} props - Component props including filter items, callbacks, persistence key, and key mapping.
 * @returns JSX element rendering a filter button and popover with filter fields.
 */
export function RFilter({
  items,
  onApply,
  onReset,
  persistKey,
  mapKey,
}: TRFilterProps) {
  const { values, setValue, reset, getParams, storageKey } = useFilter(
    items,
    persistKey,
  );

  /**
   * Serialize filter values to JSON string for snapshot comparison.
   * Dates are converted to ISO strings for consistent serialization.
   */
  const serializeValues = useCallback(
    (record: Record<string, unknown>) =>
      JSON.stringify(record, (_, value) =>
        value instanceof Date ? value.toISOString() : value,
      ),
    [],
  );

  // Snapshot representing the default values derived from filter configuration
  const defaultValues = useMemo(() => {
    const record: Record<string, unknown> = {};
    for (const item of items) {
      record[item.id] = item.defaultValue ?? null;
    }
    return record;
  }, [items]);

  const defaultSnapshot = useMemo(
    () => serializeValues(defaultValues),
    [defaultValues, serializeValues],
  );

  // Snapshot of last applied filter values as serialized string
  const currentSnapshot = useMemo(
    () => serializeValues(values),
    [values, serializeValues],
  );

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
      const mappedParams = mapFilterKeys(params);
      onApply?.(mappedParams);
      setApplied(true);
      setLastAppliedSnapshot(currentSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Prepare fields data for rendering filter inputs
  const fields = useMemo(
    () =>
      items.map((item) => ({
        item,
        id: item.id,
        value: values[item.id] ?? null,
      })),
    [items, values],
  );

  /**
   * Maps filter keys according to the mapKey prop.
   * Supports flattening nested objects into bracket notation keys.
   * Returns a new object with keys transformed by mapKey function or mapping object.
   *
   * @param {Record<string, unknown>} obj - Original filter params.
   * @returns {Record<string, unknown>} Mapped and flattened filter params.
   */
  const mapFilterKeys = useCallback(
    (obj: Record<string, unknown>): Record<string, unknown> => {
      if (!mapKey) return obj;

      const result: Record<string, unknown> = {};

      const flattenAndMap = (prefix: string, value: unknown) => {
        const isPlainObject =
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          !(value instanceof Date);

        if (isPlainObject) {
          for (const [subKey, subValue] of Object.entries(value)) {
            flattenAndMap(`${prefix}[${subKey}]`, subValue);
          }
        } else {
          let mappedKey = prefix;
          if (typeof mapKey === 'function') {
            mappedKey = mapKey(prefix);
          } else if (typeof mapKey === 'object') {
            // Try exact match first
            if (mapKey[mappedKey]) {
              mappedKey = mapKey[mappedKey];
            } else {
              // If no exact match, try to find a mapping for the base key (before bracket)
              const baseKey = mappedKey.split('[')[0];
              if (mapKey[baseKey]) {
                // Replace base key with mapped base key and keep bracket part
                mappedKey = mappedKey.replace(baseKey, mapKey[baseKey]);
              }
            }
          }
          result[mappedKey] = value;
        }
      };

      for (const [key, value] of Object.entries(obj)) {
        flattenAndMap(key, value);
      }

      return result;
    },
    [mapKey],
  );

  /**
   * Applies current filter values.
   * Calls onApply with mapped filter params, closes popover, updates applied state and snapshot.
   */
  const handleApply = useCallback(() => {
    const params = getParams();
    const mappedParams = mapFilterKeys(params);
    onApply?.(mappedParams);
    setOpen(false);
    setApplied(currentSnapshot !== defaultSnapshot);
    setLastAppliedSnapshot(currentSnapshot);
  }, [
    onApply,
    getParams,
    mapFilterKeys,
    setLastAppliedSnapshot,
    currentSnapshot,
    defaultSnapshot,
  ]);

  /**
   * Resets all filters to default/cleared state.
   * Calls onReset with mapped cleared values, closes popover, updates applied state and snapshot.
   * Ensures all mapped keys exist in cleared values with null if missing.
   */
  const handleReset = useCallback(() => {
    const clearedValues = reset();
    const mappedClearedValues = mapFilterKeys(clearedValues);
    if (typeof mapKey === 'object' && mapKey !== null) {
      for (const targetKey of Object.values(mapKey)) {
        if (!(targetKey in mappedClearedValues)) {
          mappedClearedValues[targetKey] = null;
        }
      }
    }
    onReset?.(mappedClearedValues);
    setOpen(false);
    setApplied(false);
    setLastAppliedSnapshot(serializeValues(clearedValues));
  }, [reset, onReset, mapFilterKeys, mapKey, serializeValues]);

  /**
   * Updates the value of a specific filter field by id.
   *
   * @param {string} id - Filter field identifier.
   * @param {unknown} value - New value to set.
   */
  const handleFieldChange = useCallback(
    (id: string, value: unknown) => {
      setValue(id, value);
    },
    [setValue],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='relative'>
          Filter
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
          <div className='text-xs text-muted-foreground mb-1'>
            Storage key: {storageKey}
          </div>

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
              Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
  }: {
    item: TFilterItem;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (id: string, val: any) => void;
  }) => {
    return (
      <div className='space-y-1'>
        {item.label && (
          <label className='block text-xs font-semibold uppercase text-muted-foreground'>
            {item.label}
          </label>
        )}

        {item.render({
          value,
          onChange: (nextValue) => onChange(item.id, nextValue),
        })}
      </div>
    );
  },
);
RFilterField.displayName = 'FilterField';

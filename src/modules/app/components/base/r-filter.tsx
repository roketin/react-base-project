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
 * RFilter is a reusable filter popover component that manages multiple filter fields.
 * It handles the state of filter values, persistence via a storage key, and provides callbacks
 * for applying and resetting the filters. The component renders a popover with filter inputs
 * dynamically based on the provided items and allows users to apply or reset those filters.
 *
 * @param {TRFilterProps} props - The component props including:
 *   - items: An array of filter items defining each filter field.
 *   - onApply: Optional callback triggered when filters are applied.
 *   - onReset: Optional callback triggered when filters are reset.
 *   - persistKey: Optional key to persist filter state across sessions.
 *   - mapKey: Optional function or object to map filter keys before applying or resetting.
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

  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(() => {
    const params = getParams();
    return Object.keys(params).length > 0;
  });

  useEffect(() => {
    const params = getParams();
    if (Object.keys(params).length > 0) {
      const mappedParams = mapFilterKeys(params);
      onApply?.(mappedParams);
      setApplied(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

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
   * Utility function to map filter keys according to mapKey prop.
   * It returns a new object with keys mapped by mapKey function or object.
   * It also flattens nested objects like { from, to } into keys like 'date_multiple[from]'.
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
   * Handles applying the current filter values.
   * Calls the onApply callback with the current filter parameters.
   */
  const handleApply = useCallback(() => {
    const params = getParams();
    const mappedParams = mapFilterKeys(params);
    onApply?.(mappedParams);
    setOpen(false);
    setApplied(true);
  }, [onApply, getParams, mapFilterKeys]);

  /**
   * Handles resetting all filters to their default or cleared state.
   * Calls the onReset callback with the cleared filter values.
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
  }, [reset, onReset, mapFilterKeys, mapKey]);

  /**
   * Updates the value of a specific filter field identified by its id.
   * @param {string} id - The identifier of the filter field to update.
   * @param {unknown} value - The new value to set for the filter field.
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
        <Button
          variant={applied ? 'secondary' : 'outline'}
          className='relative'
        >
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
            <Button onClick={handleApply}>Filter</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * RFilterField is a memoized component that renders a single filter field.
 * Depending on the filter item's type, it renders either an input field or a select combo box.
 * It accepts the current value and calls the onChange callback whenever the user updates the field,
 * passing the id and new value upward to the parent component.
 *
 * @param {object} props - The component props:
 *   - item: The filter item metadata defining the field type and properties.
 *   - value: The current value of the filter field.
 *   - onChange: Callback function to notify value changes (id, newValue).
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

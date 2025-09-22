import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import React, { useState, useMemo, useCallback } from 'react';

type RMultiComboBoxProps<
  T extends object,
  K extends keyof T,
  V extends keyof T,
> = {
  items?: T[];
  labelKey: K;
  valueKey: V;
  values?: string[];
  defaultValues?: string[];
  onChange?: (values: string[], items: T[]) => void;
  clearable?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
};

export function RMultiComboBox<
  T extends object,
  K extends keyof T,
  V extends keyof T,
>(props: RMultiComboBoxProps<T, K, V>) {
  const {
    items = [],
    labelKey,
    valueKey,
    values,
    defaultValues,
    onChange,
    clearable = false,
    searchValue = '',
    onSearch,
  } = props;

  const [internalValues, setInternalValues] = useState<string[]>(
    defaultValues ?? [],
  );

  const selectedValues = values !== undefined ? values : internalValues;

  const selectedItems = useMemo(() => {
    return (items ?? []).filter((item) =>
      selectedValues.includes(String(item[valueKey])),
    );
  }, [items, selectedValues, valueKey]);

  const toggleValue = useCallback(
    (value: string) => {
      let newValues: string[];
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter((v) => v !== value);
      } else {
        newValues = [...selectedValues, value];
      }

      if (values === undefined) {
        setInternalValues(newValues);
      }

      if (onChange) {
        const newSelectedItems = (items ?? []).filter((item) =>
          newValues.includes(String(item[valueKey])),
        );
        onChange(newValues, newSelectedItems);
      }
    },
    [selectedValues, values, setInternalValues, onChange, items, valueKey],
  );

  const toggleSelectAll = useCallback(() => {
    let newValues: string[];
    if (selectedValues.length === items.length) {
      newValues = [];
    } else {
      newValues = (items ?? []).map((item) => String(item[valueKey]));
    }

    if (values === undefined) {
      setInternalValues(newValues);
    }

    if (onChange) {
      const newSelectedItems = (items ?? []).filter((item) =>
        newValues.includes(String(item[valueKey])),
      );
      onChange(newValues, newSelectedItems);
    }
  }, [selectedValues, items, values, setInternalValues, onChange, valueKey]);

  const clearSelection = useCallback(() => {
    if (values === undefined) {
      setInternalValues([]);
    }
    if (onChange) {
      onChange([], []);
    }
  }, [values, setInternalValues, onChange]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    },
    [onSearch],
  );

  return (
    <div className='relative inline-block w-64 text-left'>
      <div className='flex flex-wrap gap-1 mb-1'>
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <span
              key={String(item[valueKey])}
              className='inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800'
            >
              {String(item[labelKey])}
              <button
                type='button'
                className='ml-1 text-blue-500 hover:text-blue-700 focus:outline-none'
                onClick={() => toggleValue(String(item[valueKey]))}
              >
                <XIcon className='h-4 w-4' />
              </button>
            </span>
          ))
        ) : (
          <span className='text-gray-500'>Select...</span>
        )}
        {clearable && selectedItems.length > 0 && (
          <button
            type='button'
            onClick={clearSelection}
            className='ml-auto text-gray-400 hover:text-gray-600 focus:outline-none'
            aria-label='Clear selection'
          >
            <XIcon className='h-5 w-5' />
          </button>
        )}
      </div>
      <div className='relative'>
        <input
          type='text'
          className='w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Search...'
          value={searchValue}
          onChange={handleSearchChange}
        />
        <ChevronDownIcon className='absolute right-2 top-2 h-5 w-5 text-gray-400 pointer-events-none' />
      </div>
      <ul className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
        <li
          key='select-all'
          className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
            selectedValues.length === items.length
              ? 'text-blue-600 bg-blue-100'
              : 'text-gray-900'
          } hover:bg-blue-50`}
          onClick={toggleSelectAll}
        >
          <span
            className={`block truncate ${selectedValues.length === items.length ? 'font-semibold' : 'font-normal'}`}
          >
            Select All
          </span>
          {selectedValues.length === items.length && (
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
              <CheckIcon className='h-5 w-5' aria-hidden='true' />
            </span>
          )}
        </li>
        {items.map((item) => {
          const itemValue = String(item[valueKey]);
          const isSelected = selectedValues.includes(itemValue);
          return (
            <li
              key={itemValue}
              className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                isSelected ? 'text-blue-600 bg-blue-100' : 'text-gray-900'
              } hover:bg-blue-50`}
              onClick={() => toggleValue(itemValue)}
            >
              <span
                className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}
              >
                {String(item[labelKey])}
              </span>
              {isSelected && (
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
                  <CheckIcon className='h-5 w-5' aria-hidden='true' />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

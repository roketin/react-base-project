import { useEffect, useState } from 'react';

/**
 * Hook to debounce a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 400)
 * @returns Debounced value
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Custom hook to handle search parameter from URL (typically from global search)
 * Reads the search param once, stores it in state, and clears the URL
 *
 * @param paramName - The URL parameter name to read (default: 'search')
 * @returns The search value from URL parameter
 *
 * @example
 * const searchQuery = useSearchParam();
 * // or with custom param name
 * const keyword = useSearchParam('keyword');
 */
export function useSearchParam(paramName: string = 'search'): string {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue] = useState(() => {
    const value = searchParams.get(paramName) || '';
    if (value) {
      console.log(`🔍 Search param "${paramName}" from URL:`, value);
    }
    return value;
  });

  // Clear URL params after reading (delayed to allow components to process)
  useEffect(() => {
    if (searchValue) {
      const timer = setTimeout(() => {
        setSearchParams({});
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return searchValue;
}

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

export type TTheme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'app-theme';

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (effectiveTheme: 'light' | 'dark') => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(effectiveTheme);
};

const getStoredTheme = (): TTheme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(THEME_STORAGE_KEY) as TTheme) || 'system';
};

// System theme subscription using useSyncExternalStore
const subscribeToSystemTheme = (callback: () => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

/**
 * Hook to manage theme (light/dark/system)
 */
export const useTheme = () => {
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    () => 'light', // Server snapshot
  );

  const [theme, setThemeState] = useState<TTheme>(getStoredTheme);

  const effectiveTheme = (theme === 'system' ? systemTheme : theme) as
    | 'light'
    | 'dark';

  const setTheme = useCallback((newTheme: TTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    const effective = (newTheme === 'system' ? getSystemTheme() : newTheme) as
      | 'light'
      | 'dark';
    applyTheme(effective);
  }, []);

  // Apply theme on mount and when effective theme changes
  useEffect(() => {
    applyTheme(effectiveTheme);
  }, [effectiveTheme]);

  return useMemo(
    () => ({
      theme,
      effectiveTheme,
      setTheme,
      isDark: effectiveTheme === 'dark',
      isLight: effectiveTheme === 'light',
      isSystem: theme === 'system',
    }),
    [theme, effectiveTheme, setTheme],
  );
};

import { useCallback, useEffect, useState } from 'react';

export type TTheme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'app-theme';

/**
 * Get the system preferred color scheme
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Apply theme to document
 */
const applyTheme = (theme: TTheme) => {
  const root = document.documentElement;
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(effectiveTheme);
};

/**
 * Hook to manage theme (light/dark/system)
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<TTheme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(THEME_STORAGE_KEY) as TTheme) || 'system';
  });

  const setTheme = useCallback((newTheme: TTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  return {
    theme,
    effectiveTheme,
    setTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    isSystem: theme === 'system',
  };
};

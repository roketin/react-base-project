import { useState, useEffect } from 'react';

type TBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<TBreakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const getBreakpoint = (width: number): TBreakpoint => {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Hook to get current breakpoint based on window width
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<TBreakpoint>(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'md',
  );
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setBreakpoint(getBreakpoint(newWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { breakpoint, width };
};

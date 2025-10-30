import { useEffect, useMemo, useState } from 'react';

export type ViewportBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<ViewportBreakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

function getBreakpoint(width: number): ViewportBreakpoint {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

export type UseViewportValue = {
  width: number;
  height: number;
  breakpoint: ViewportBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useViewport(throttleMs = 150): UseViewportValue {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let frameId: number | null = null;
    let lastRun = Date.now();

    const onResize = () => {
      const now = Date.now();
      const elapsed = now - lastRun;

      const run = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        lastRun = Date.now();
      };

      if (throttleMs <= 0 || elapsed > throttleMs) {
        run();
      } else {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
        frameId = window.requestAnimationFrame(run);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [throttleMs]);

  return useMemo(() => {
    const breakpoint = getBreakpoint(dimensions.width);
    return {
      width: dimensions.width,
      height: dimensions.height,
      breakpoint,
      isMobile: breakpoint === 'xs' || breakpoint === 'sm',
      isTablet: breakpoint === 'md',
      isDesktop:
        breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    } satisfies UseViewportValue;
  }, [dimensions.height, dimensions.width]);
}

export default useViewport;

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

type TRImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  lazy?: boolean;
  fallback?: ReactNode;
  fallbackSrc?: string;
  loader?: ReactNode;
  wrapperClassName?: string;
  imageClassName?: string;
  observerOptions?: IntersectionObserverInit;
};

export const RImg = forwardRef<HTMLImageElement, TRImgProps>(function RImg(
  {
    src,
    alt,
    className,
    imageClassName,
    wrapperClassName,
    fallback,
    fallbackSrc,
    loader,
    lazy = true,
    observerOptions,
    onLoad,
    onError,
    ...rest
  },
  forwardedRef,
) {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalImgRef = useRef<HTMLImageElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLImageElement | null) => {
      internalImgRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const { loading: loadingProp, ...imgRest } = rest;
  const loadingAttr = lazy ? 'lazy' : (loadingProp ?? 'eager');

  useEffect(() => {
    setDisplaySrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (!lazy) {
      setShouldLoad(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(node);

    return () => observer.disconnect();
  }, [lazy, observerOptions]);

  const handleLoad: ImgHTMLAttributes<HTMLImageElement>['onLoad'] = (event) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError: ImgHTMLAttributes<HTMLImageElement>['onError'] = (
    event,
  ) => {
    if (fallbackSrc && displaySrc !== fallbackSrc) {
      setDisplaySrc(fallbackSrc);
      setIsLoaded(false);
      return;
    }

    setHasError(true);
    onError?.(event);
  };

  const fallbackNode = useMemo(() => {
    if (fallback) return fallback;
    const initial =
      typeof alt === 'string' && alt.trim()
        ? alt.trim()[0]?.toUpperCase()
        : '?';
    return (
      <div className='flex size-full items-center justify-center bg-muted text-muted-foreground'>
        <span className='text-sm font-semibold'>{initial}</span>
      </div>
    );
  }, [alt, fallback]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex', className, wrapperClassName)}
      aria-busy={!isLoaded && !hasError}
    >
      {shouldLoad && !hasError ? (
        <img
          ref={setRefs}
          src={displaySrc}
          alt={alt}
          className={cn(
            'block size-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            imageClassName,
          )}
          loading={loadingAttr}
          onLoad={handleLoad}
          onError={handleError}
          {...imgRest}
        />
      ) : null}

      {!isLoaded && !hasError
        ? (loader ?? (
            <div className='absolute inset-0 animate-pulse bg-muted/60' />
          ))
        : null}

      {hasError ? fallbackNode : null}
    </div>
  );
});

RImg.displayName = 'RImg';

export default RImg;

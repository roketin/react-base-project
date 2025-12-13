'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type HTMLAttributes,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

type TCarouselOrientation = 'horizontal' | 'vertical';

type TCarouselContext = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
  orientation: TCarouselOrientation;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  loop: boolean;
  autoPlay: boolean;
  autoPlayInterval: number;
};

// ============================================================================
// CONTEXT
// ============================================================================

const CarouselContext = createContext<TCarouselContext | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel components must be used within RCarousel');
  }
  return context;
}

// ============================================================================
// ROOT COMPONENT
// ============================================================================

type TRCarouselProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: TCarouselOrientation;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
};

const RCarousel = forwardRef<HTMLDivElement, TRCarouselProps>(
  (
    {
      children,
      className,
      orientation = 'horizontal',
      loop = false,
      autoPlay = false,
      autoPlayInterval = 3000,
      defaultIndex = 0,
      onIndexChange,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndexState] = useState(defaultIndex);
    const [itemCount, setItemCount] = useState(0);
    const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

    const setCurrentIndex = useCallback(
      (index: number) => {
        setCurrentIndexState(index);
        onIndexChange?.(index);
      },
      [onIndexChange],
    );

    const canScrollPrev = loop || currentIndex > 0;
    const canScrollNext = loop || currentIndex < itemCount - 1;

    const scrollPrev = useCallback(() => {
      if (!canScrollPrev) return;
      const newIndex =
        currentIndex === 0 ? (loop ? itemCount - 1 : 0) : currentIndex - 1;
      setCurrentIndex(newIndex);
    }, [currentIndex, itemCount, loop, canScrollPrev, setCurrentIndex]);

    const scrollNext = useCallback(() => {
      if (!canScrollNext) return;
      const newIndex =
        currentIndex === itemCount - 1
          ? loop
            ? 0
            : itemCount - 1
          : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, [currentIndex, itemCount, loop, canScrollNext, setCurrentIndex]);

    const scrollTo = useCallback(
      (index: number) => {
        if (index >= 0 && index < itemCount) {
          setCurrentIndex(index);
        }
      },
      [itemCount, setCurrentIndex],
    );

    // Auto play
    useEffect(() => {
      if (!autoPlay || itemCount <= 1) return;

      autoPlayRef.current = setInterval(() => {
        scrollNext();
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }, [autoPlay, autoPlayInterval, scrollNext, itemCount]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (orientation === 'horizontal') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollPrev();
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollNext();
          }
        } else {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollPrev();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            scrollNext();
          }
        }
      },
      [orientation, scrollPrev, scrollNext],
    );

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          setCurrentIndex,
          itemCount,
          setItemCount,
          orientation,
          canScrollPrev,
          canScrollNext,
          scrollPrev,
          scrollNext,
          scrollTo,
          loop,
          autoPlay,
          autoPlayInterval,
        }}
      >
        <div
          ref={ref}
          role='region'
          aria-roledescription='carousel'
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn('relative', className)}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
RCarousel.displayName = 'RCarousel';

// ============================================================================
// CONTENT
// ============================================================================

type TCarouselContentProps = HTMLAttributes<HTMLDivElement>;

const CarouselContent = forwardRef<HTMLDivElement, TCarouselContentProps>(
  ({ children, className, ...props }, ref) => {
    const { currentIndex, setItemCount, orientation } = useCarousel();
    const contentRef = useRef<HTMLDivElement>(null);

    // Count children
    useEffect(() => {
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll(
          '[data-carousel-item]',
        );
        setItemCount(items.length);
      }
    }, [children, setItemCount]);

    const translateValue =
      orientation === 'horizontal'
        ? `translateX(-${currentIndex * 100}%)`
        : `translateY(-${currentIndex * 100}%)`;

    return (
      <div className='overflow-hidden'>
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn(
            'flex transition-transform duration-300 ease-in-out',
            orientation === 'vertical' && 'flex-col',
            className,
          )}
          style={{ transform: translateValue }}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);
CarouselContent.displayName = 'CarouselContent';

// ============================================================================
// ITEM
// ============================================================================

type TCarouselItemProps = HTMLAttributes<HTMLDivElement>;

const CarouselItem = forwardRef<HTMLDivElement, TCarouselItemProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        data-carousel-item
        role='group'
        aria-roledescription='slide'
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'vertical' && 'min-h-0',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

// ============================================================================
// NAVIGATION BUTTONS
// ============================================================================

type TCarouselButtonProps = HTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const CarouselPrevious = forwardRef<HTMLButtonElement, TCarouselButtonProps>(
  ({ className, variant = 'outline', size = 'md', ...props }, ref) => {
    const { scrollPrev, canScrollPrev, orientation } = useCarousel();

    const sizeClasses = {
      sm: 'h-7 w-7',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <button
        ref={ref}
        type='button'
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className={cn(
          'absolute rounded-full flex items-center justify-center',
          'disabled:opacity-50 disabled:pointer-events-none',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          sizeClasses[size],
          variantClasses[variant],
          orientation === 'horizontal'
            ? 'left-2 top-1/2 -translate-y-1/2'
            : 'top-2 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        aria-label='Previous slide'
        {...props}
      >
        <ChevronLeft className='h-4 w-4' />
      </button>
    );
  },
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = forwardRef<HTMLButtonElement, TCarouselButtonProps>(
  ({ className, variant = 'outline', size = 'md', ...props }, ref) => {
    const { scrollNext, canScrollNext, orientation } = useCarousel();

    const sizeClasses = {
      sm: 'h-7 w-7',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <button
        ref={ref}
        type='button'
        disabled={!canScrollNext}
        onClick={scrollNext}
        className={cn(
          'absolute rounded-full flex items-center justify-center',
          'disabled:opacity-50 disabled:pointer-events-none',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          sizeClasses[size],
          variantClasses[variant],
          orientation === 'horizontal'
            ? 'right-2 top-1/2 -translate-y-1/2'
            : 'bottom-2 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        aria-label='Next slide'
        {...props}
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    );
  },
);
CarouselNext.displayName = 'CarouselNext';

// ============================================================================
// DOTS INDICATOR
// ============================================================================

type TCarouselDotsProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'line';
};

const CarouselDots = forwardRef<HTMLDivElement, TCarouselDotsProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const { currentIndex, itemCount, scrollTo, orientation } = useCarousel();

    if (itemCount <= 1) return null;

    return (
      <div
        ref={ref}
        role='tablist'
        className={cn(
          'flex gap-1.5 justify-center',
          orientation === 'vertical' && 'flex-col',
          className,
        )}
        {...props}
      >
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            type='button'
            role='tab'
            aria-selected={currentIndex === index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              variant === 'default' && [
                'rounded-full',
                currentIndex === index
                  ? 'bg-primary w-2.5 h-2.5'
                  : 'bg-muted hover:bg-muted-foreground/50 w-2 h-2',
              ],
              variant === 'line' && [
                'rounded-full h-1',
                currentIndex === index
                  ? 'bg-primary w-6'
                  : 'bg-muted hover:bg-muted-foreground/50 w-4',
              ],
            )}
          />
        ))}
      </div>
    );
  },
);
CarouselDots.displayName = 'CarouselDots';

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RCarousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};

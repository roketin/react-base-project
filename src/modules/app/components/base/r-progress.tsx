import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  feedbackVariants,
  type TFeedbackVariant,
} from '@/modules/app/libs/ui-variants';

// Linear Progress
export type TRProgressProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  variant?: TFeedbackVariant;
  size?: 'sm' | 'default' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
  /** Auto animate from 0 to 100% using CSS animation */
  autoAnimate?: boolean;
  /** Duration for autoAnimate in milliseconds */
  animationDuration?: number;
};

export const RProgress = forwardRef<HTMLDivElement, TRProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size = 'default',
      showValue = false,
      animated = false,
      striped = false,
      autoAnimate = false,
      animationDuration = 4000,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className='w-full space-y-1'>
        <div
          ref={ref}
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-muted',
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full',
              !autoAnimate && 'transition-all duration-300 ease-in-out',
              feedbackVariants.solid[variant],
              striped &&
                'bg-linear-to-r from-transparent via-white/20 to-transparent bg-size-[20px_100%]',
              animated && striped && 'animate-progress-stripes',
            )}
            style={
              autoAnimate
                ? {
                    width: '100%',
                    animation: `progress-auto-animate ${animationDuration}ms linear forwards`,
                  }
                : { width: `${percentage}%` }
            }
          />
        </div>
        {showValue && (
          <div className='flex justify-end'>
            <span className='text-xs text-muted-foreground'>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  },
);

RProgress.displayName = 'RProgress';

// Circular Progress
export type TRProgressCircularProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: TFeedbackVariant;
  showValue?: boolean;
  indeterminate?: boolean;
};

export const RProgressCircular = forwardRef<
  HTMLDivElement,
  TRProgressCircularProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 64,
      strokeWidth = 4,
      variant = 'default',
      showValue = false,
      indeterminate = false,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const strokeVariants: Record<TFeedbackVariant, string> = {
      default: 'stroke-primary',
      success: 'stroke-success',
      warning: 'stroke-warning',
      error: 'stroke-destructive',
      info: 'stroke-info',
    };

    return (
      <div
        ref={ref}
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          'relative inline-flex items-center justify-center',
          className,
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className={cn(indeterminate && 'animate-spin')}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='currentColor'
            strokeWidth={strokeWidth}
            className='text-muted'
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            className={cn(
              'transition-all duration-300 ease-in-out',
              strokeVariants[variant],
            )}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: indeterminate ? circumference * 0.75 : offset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        {showValue && !indeterminate && (
          <span className='absolute text-xs font-medium text-foreground'>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  },
);

RProgressCircular.displayName = 'RProgressCircular';

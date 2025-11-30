import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';

// Linear Progress
export type TRProgressProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
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
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
    };

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
            'relative w-full overflow-hidden rounded-full bg-slate-200',
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out',
              variantClasses[variant],
              striped &&
                'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]',
              animated && striped && 'animate-progress-stripes',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className='flex justify-end'>
            <span className='text-xs text-slate-600'>
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
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
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

    const variantColors = {
      default: 'stroke-primary',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-600',
      error: 'stroke-red-600',
      info: 'stroke-blue-600',
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
            className='text-slate-200'
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
              variantColors[variant],
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
          <span className='absolute text-xs font-medium text-slate-700'>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  },
);

RProgressCircular.displayName = 'RProgressCircular';

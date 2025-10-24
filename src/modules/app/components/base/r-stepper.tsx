import React, { useMemo } from 'react';
import { Check, Loader2 } from 'lucide-react';

import { cn } from '@/modules/app/libs/utils';

export { RPanelHeader } from './r-panel-header';
export type { RPanelHeaderProps } from './r-panel-header';

export interface Step<StepId extends string = string, StepData = unknown> {
  id: StepId;
  label: string;
  data?: StepData;
  disabled?: boolean; // optional disabled state for individual step
  onClick?: (index: number, step: Step<StepId, StepData>) => void;
  loading?: boolean;
}

export type StepperVariant =
  | 'horizontal'
  | 'vertical'
  | 'minimal'
  | 'card'
  | 'line';

/** Stepper Component */
export interface RStepperProps<
  StepId extends string = string,
  StepData = unknown,
> {
  steps: Step<StepId, StepData>[];
  currentIndex: number;
  variant?: StepperVariant;
  className?: string;
}

/** Stepper Component */
export function RStepper<StepId extends string = string, StepData = unknown>({
  steps,
  currentIndex,
  variant = 'horizontal',
  className,
}: RStepperProps<StepId, StepData>) {
  const percent = useMemo(() => {
    if (steps.length === 0) return 0;
    const clampedIndex = Math.min(Math.max(currentIndex, 0), steps.length - 1);
    const completed = clampedIndex + 1;
    return Math.min((completed / steps.length) * 100, 100);
  }, [steps.length, currentIndex]);

  const renderStepLabel = (
    s: Step<StepId, StepData>,
    idx: number,
    state: string,
  ) => {
    const isDisabled = s.disabled;
    const isLoading = s.loading;

    const icon = isLoading ? (
      <Loader2 className='size-4 animate-spin text-primary/50' />
    ) : isDisabled ? (
      <span className='text-xs font-bold text-gray-400'>×</span>
    ) : state === 'completed' ? (
      <Check className='size-4' />
    ) : (
      idx + 1
    );

    const baseCircle =
      'grid size-6 place-items-center rounded-full border text-xs font-semibold transition-all';

    return (
      <div
        className={`${baseCircle} ${
          isDisabled
            ? 'bg-gray-100 text-gray-300 border-gray-300 cursor-not-allowed'
            : state === 'completed'
              ? 'bg-primary text-white border-primary'
              : state === 'current'
                ? 'bg-white text-primary border-primary'
                : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        {icon}
      </div>
    );
  };

  if (variant === 'vertical') {
    return (
      <ol className={cn('space-y-4 border-l-2 border-primary p-3', className)}>
        {steps.map((s, idx) => {
          const completed = idx < currentIndex;
          const current = idx === currentIndex;
          const state = completed
            ? 'completed'
            : current
              ? 'current'
              : 'upcoming';
          const isDisabled = s.disabled;
          const isClickable = !isDisabled && s.onClick;
          return (
            <li
              key={s.id}
              className={`relative flex items-start gap-3 ${isClickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              {renderStepLabel(s, idx, state)}

              <span
                className={`text-sm ${
                  isDisabled
                    ? 'text-gray-400'
                    : current
                      ? 'text-primary'
                      : completed
                        ? 'text-primary'
                        : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex gap-5', className)}>
        {steps.map((s, idx) => {
          const completed = idx < currentIndex;
          const current = idx === currentIndex;
          const state = completed
            ? 'completed'
            : current
              ? 'current'
              : 'upcoming';
          const isDisabled = s.disabled;
          const isClickable = !isDisabled && s.onClick;
          return (
            <div
              key={s.id}
              className={`flex-1 flex  gap-3 items-center rounded-md border-2 p-3 text-center transition ${
                isDisabled
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : completed
                    ? 'border-primary bg-primary/10 text-primary'
                    : current
                      ? 'border-primary bg-white text-primary'
                      : 'border-gray-200 text-gray-400'
              } ${isClickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              {renderStepLabel(s, idx, state)}
              <span className='block text-sm font-medium'>{s.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <ol
        className={cn(
          'grid grid-cols-[repeat(var(--count),minmax(0,1fr))] gap-3',
          className,
        )}
        style={{ '--count': steps.length } as React.CSSProperties}
      >
        {steps.map((s, idx) => {
          const completed = idx < currentIndex;
          const current = idx === currentIndex;
          const state = completed
            ? 'completed'
            : current
              ? 'current'
              : 'upcoming';
          const isDisabled = s.disabled;
          const isClickable = !isDisabled && s.onClick;

          return (
            <li
              key={s.id}
              className={`flex flex-col items-center gap-1 border-t-4 p-3 transition ${
                isDisabled
                  ? ' border-gray-200 text-gray-400 cursor-not-allowed '
                  : completed
                    ? 'border-primary text-primary bg-teal-50/40'
                    : current
                      ? 'border-primary text-primary'
                      : 'border-gray-200 text-gray-400'
              } ${isClickable ? 'cursor-pointer hover:border-primary hover:primary' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              <div className='flex gap-3 items-center'>
                {renderStepLabel(s, idx, state)}
                <span
                  className={`text-sm ${
                    isDisabled
                      ? 'text-gray-400'
                      : current
                        ? 'text-primary font-medium'
                        : completed
                          ? 'text-primary'
                          : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex gap-4 justify-center p-4', className)}>
        {steps.map((s, idx) => {
          const current = idx === currentIndex;
          const isDisabled = s.disabled;
          const isLoading = s.loading;
          const isClickable = !isDisabled && s.onClick;
          return (
            <div
              key={s.id}
              className={`h-2 w-16 rounded-full transition-all ${
                isDisabled
                  ? 'bg-gray-300 opacity-60 cursor-not-allowed'
                  : current
                    ? 'bg-primary'
                    : 'bg-gray-300'
              } ${isClickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              {isLoading && (
                <Loader2 className='size-4 animate-spin text-gray-400' />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className='relative h-2 rounded-full bg-gray-200'>
        <div
          className='absolute inset-y-0 left-0 rounded-full bg-primary'
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol
        className='mt-3 grid grid-cols-[repeat(var(--count),minmax(0,1fr))] items-center gap-2'
        style={{ '--count': steps.length } as React.CSSProperties}
      >
        {steps.map((s, idx) => {
          const completed = idx < currentIndex;
          const current = idx === currentIndex;
          const state = completed
            ? 'completed'
            : current
              ? 'current'
              : 'upcoming';
          const isDisabled = s.disabled;
          const isClickable = !isDisabled && s.onClick;
          return (
            <li
              key={s.id}
              className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              {renderStepLabel(s, idx, state)}
              <span
                className={`truncate text-sm ${
                  isDisabled
                    ? 'text-gray-400'
                    : completed || current
                      ? 'text-primary'
                      : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

import React, { useMemo } from 'react';
import { Check, Loader2 } from 'lucide-react';

import { cn } from '@/modules/app/libs/utils';

export { RPanelHeader } from './r-panel-header';
export type { TRPanelHeaderProps } from './r-panel-header';

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
export interface TRStepperProps<
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
}: TRStepperProps<StepId, StepData>) {
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
      <span className='text-xs font-bold text-muted-foreground'>×</span>
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
            ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
            : state === 'completed'
              ? 'bg-primary text-primary-foreground border-primary'
              : state === 'current'
                ? 'bg-background text-primary border-primary'
                : 'bg-muted text-muted-foreground border-border'
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
                    ? 'text-muted-foreground'
                    : current
                      ? 'text-primary'
                      : completed
                        ? 'text-primary'
                        : 'text-muted-foreground'
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
                  ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                  : completed
                    ? 'border-primary bg-primary/10 text-primary'
                    : current
                      ? 'border-primary bg-background text-primary'
                      : 'border-border text-muted-foreground'
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
                  ? ' border-border text-muted-foreground cursor-not-allowed '
                  : completed
                    ? 'border-primary text-primary bg-primary/5'
                    : current
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
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
                      ? 'text-muted-foreground'
                      : current
                        ? 'text-primary font-medium'
                        : completed
                          ? 'text-primary'
                          : 'text-muted-foreground'
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
                  ? 'bg-muted opacity-60 cursor-not-allowed'
                  : current
                    ? 'bg-primary'
                    : 'bg-muted'
              } ${isClickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
              onClick={() => {
                if (isClickable && s.onClick) s.onClick(idx, s);
              }}
              aria-disabled={isDisabled}
            >
              {isLoading && (
                <Loader2 className='size-4 animate-spin text-muted-foreground' />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className='relative h-2 rounded-full bg-muted'>
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
                    ? 'text-muted-foreground'
                    : completed || current
                      ? 'text-primary'
                      : 'text-muted-foreground'
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

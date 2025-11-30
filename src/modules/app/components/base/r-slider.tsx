import {
  forwardRef,
  type InputHTMLAttributes,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRSliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'size'
> & {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
};

export const RSlider = forwardRef<HTMLInputElement, TRSliderProps>(
  (
    {
      label,
      error,
      helperText,
      wrapperClassName,
      disabled,
      id,
      value: controlledValue,
      defaultValue = 50,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      showValue = false,
      showMinMax = false,
      formatValue = (val) => val.toString(),
      ...props
    },
    ref,
  ) => {
    const sliderId =
      id || `slider-${Math.random().toString(36).substring(2, 11)}`;
    const hasError = !!error;

    const [internalValue, setInternalValue] = useState(
      controlledValue ?? defaultValue,
    );
    const [isDragging, setIsDragging] = useState(false);

    const currentValue = controlledValue ?? internalValue;

    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);

      if (onValueChange) {
        onValueChange(newValue);
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    const updateValueFromPosition = useCallback(
      (clientX: number, rect: DOMRect) => {
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const rawValue = min + percentage * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        setInternalValue(clampedValue);
        if (onValueChange) {
          onValueChange(clampedValue);
        }
      },
      [max, min, onValueChange, step],
    );

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      updateValueFromPosition(e.clientX, rect);
    };

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        const track = document.getElementById(`${sliderId}-track`);
        if (!track) return;
        const rect = track.getBoundingClientRect();
        updateValueFromPosition(e.clientX, rect);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [
      isDragging,
      min,
      max,
      step,
      onValueChange,
      sliderId,
      disabled,
      updateValueFromPosition,
    ]);

    // Calculate percentage for styling
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={cn('flex flex-col gap-2', wrapperClassName)}>
        {label && (
          <div className='flex items-center justify-between'>
            <label
              htmlFor={sliderId}
              className={cn(
                'text-sm font-medium text-slate-700',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {label}
            </label>
            {showValue && (
              <span className='text-sm font-medium text-slate-900'>
                {formatValue(currentValue)}
              </span>
            )}
          </div>
        )}

        <div className='relative'>
          <input
            ref={ref}
            type='range'
            id={sliderId}
            disabled={disabled}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            {...props}
            className='hidden'
          />

          {/* Custom slider track */}
          <div
            id={`${sliderId}-track`}
            className={cn(
              'relative h-2 w-full rounded-full',
              hasError ? 'bg-destructive/20' : 'bg-slate-200',
              disabled && 'opacity-50 cursor-not-allowed',
              !disabled && 'cursor-pointer',
            )}
            onMouseDown={handleMouseDown}
          >
            {/* Filled track */}
            <div
              className={cn(
                'absolute h-full rounded-full pointer-events-none',
                isDragging ? '' : 'transition-all',
                hasError ? 'bg-destructive' : 'bg-primary',
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Thumb */}
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
                'h-5 w-5 rounded-full bg-white shadow-md border-2 pointer-events-none',
                isDragging ? 'scale-110' : 'transition-all',
                hasError ? 'border-destructive' : 'border-primary',
                disabled && 'cursor-not-allowed',
                !disabled && !isDragging && 'hover:scale-110',
              )}
              style={{ left: `${percentage}%` }}
            />
          </div>
        </div>

        {showMinMax && (
          <div className='flex justify-between text-xs text-slate-500'>
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
              hasError ? 'text-destructive' : 'text-slate-500',
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

RSlider.displayName = 'RSlider';

import {
  RadioGroup,
  RadioGroupItem,
} from '@/modules/app/components/ui/radio-group';
import type {
  TAriaInvalidProp,
  TDescriptiveOption,
  TDisableable,
  TLayoutOrientation,
} from '@/modules/app/types/component.type';
import { cn } from '@/modules/app/libs/utils';
import { useMemo, useState } from 'react';

export type RRadioOption = TDescriptiveOption<string>;

export type RRadioProps = TDisableable &
  TAriaInvalidProp & {
    options: RRadioOption[];
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string | null) => void;
    layout?: TLayoutOrientation;
    name?: string;
    className?: string;
  };

export function RRadio({
  options,
  value,
  defaultValue = null,
  onChange,
  disabled,
  layout = 'vertical',
  name,
  className,
}: RRadioProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(
    isControlled ? (value ?? null) : defaultValue,
  );

  const currentValue = isControlled ? (value ?? null) : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next ?? null);
    }
    onChange?.(next ?? null);
  };

  const groupClassName = useMemo(() => {
    if (layout === 'horizontal') {
      return cn('flex flex-wrap items-center gap-4', className);
    }
    return cn('grid gap-3', className);
  }, [className, layout]);

  return (
    <RadioGroup
      name={name}
      value={currentValue ?? undefined}
      onValueChange={handleChange}
      disabled={disabled}
      className={groupClassName}
    >
      {options.map((option, index) => {
        const id = `${name ?? 'radio'}-${index}`;
        const labelNode = option.description ? (
          <div className='flex flex-col'>
            <span>{option.label}</span>
            <span className='text-sm text-muted-foreground'>
              {option.description}
            </span>
          </div>
        ) : (
          option.label
        );

        return (
          <RadioGroupItem
            key={option.value}
            id={id}
            value={option.value}
            label={labelNode}
            disabled={disabled}
          />
        );
      })}
    </RadioGroup>
  );
}

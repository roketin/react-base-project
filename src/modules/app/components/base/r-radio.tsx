import {
  RRadioGroup,
  RRadio as RRadioItem,
} from '@/modules/app/components/base/r-radio-group';
import type {
  TAriaInvalidProp,
  TDescriptiveOption,
  TDisableable,
  TLayoutOrientation,
} from '@/modules/app/types/component.type';
import { useId } from 'react';

export type TRRadioOption = TDescriptiveOption<string>;

export type TRRadioProps = TDisableable &
  TAriaInvalidProp & {
    options: TRRadioOption[];
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
}: TRRadioProps) {
  const baseId = useId();
  const groupName = name ?? `${baseId}-group`;

  return (
    <RRadioGroup
      name={groupName}
      value={value ?? undefined}
      defaultValue={defaultValue ?? undefined}
      onChange={(val) => onChange?.(val)}
      orientation={layout}
      disabled={disabled}
      wrapperClassName={className}
    >
      {options.map((option) => (
        <RRadioItem
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </RRadioGroup>
  );
}

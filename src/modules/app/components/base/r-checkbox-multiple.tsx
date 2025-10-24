import { useCallback } from 'react';
import { Checkbox } from '@/modules/app/components/ui/checkbox';
import type {
  TDisableable,
  TLabelValueOption,
  TLayoutOrientation,
} from '@/modules/app/types/component.type';
import { cn } from '@/modules/app/libs/utils';

type TCheckboxMultipleProps = TDisableable & {
  options: TLabelValueOption<string, string>[];
  checked?: string[];
  onCheckedChange?: (values: string[]) => void;
  layout?: TLayoutOrientation;
  className?: string;
};

export function RCheckboxMultiple({
  options,
  checked,
  onCheckedChange,
  disabled,
  layout = 'horizontal',
  className,
}: TCheckboxMultipleProps) {
  /**
   * Toggles the checked state of a checkbox value.
   * If the value is already checked, it will be removed; otherwise, it will be added.
   * Calls onCheckedChange callback with the updated array of checked values.
   *
   * @param {string} value - The value of the checkbox to toggle
   */
  const handleToggle = useCallback(
    (value: string) => {
      if (checked?.includes(value)) {
        onCheckedChange?.(checked.filter((v) => v !== value));
      } else {
        onCheckedChange?.([...(checked ?? []), value]);
      }
    },
    [checked, onCheckedChange],
  );

  // Render the checkboxes in specified layout with appropriate props
  return (
    <div
      className={cn(
        layout === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2',
        'flex-wrap',
        className,
      )}
    >
      {options.map(({ label, value }, index) => {
        const id = `${name ?? 'radio'}-${index}`;
        return (
          <Checkbox
            id={id}
            key={value}
            label={label}
            value={value}
            checked={checked?.includes(value)}
            onCheckedChange={() => handleToggle(value)}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}

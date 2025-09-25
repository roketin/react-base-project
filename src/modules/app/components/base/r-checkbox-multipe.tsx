import { Checkbox } from '@/modules/app/components/ui/checkbox';
import { useCallback } from 'react';

type TCheckboxMultipleProps = {
  options: { label: string; value: string }[];
  checked?: string[];
  onCheckedChange?: (values: string[]) => void;
};

export function RCheckboxMultiple({
  options,
  checked,
  onCheckedChange,
}: TCheckboxMultipleProps) {
  /**
   * Handle toggle
   * @param value
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

  return (
    <div className='flex flex-col gap-2'>
      {options.map(({ label, value }) => (
        <Checkbox
          key={value}
          label={label}
          value={value}
          checked={checked?.includes(value)}
          onCheckedChange={() => handleToggle(value)}
        />
      ))}
    </div>
  );
}

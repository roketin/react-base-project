import { Input, type TInputProps } from '@/modules/app/components/ui/input';
import type { TBaseInputDefaultProps } from '@/modules/app/types/component.type';
import type { MaskitoOptions } from '@maskito/core';
import { useMaskito } from '@maskito/react';

export const RInputFormat = ({
  format,
  ...rest
}: React.ComponentProps<'input'> &
  TBaseInputDefaultProps &
  TInputProps & { format: MaskitoOptions }) => {
  // Test maskito
  const inputRef = useMaskito({ options: format });

  return <Input {...rest} ref={inputRef} />;
};

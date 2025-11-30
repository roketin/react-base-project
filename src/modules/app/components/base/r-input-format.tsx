import {
  RInput,
  type TRInputProps,
} from '@/modules/app/components/base/r-input';
import type { TBaseInputDefaultProps } from '@/modules/app/types/component.type';
import type { MaskitoOptions } from '@maskito/core';
import { useMaskito } from '@maskito/react';

export const RInputFormat = ({
  format,
  ...rest
}: React.ComponentProps<'input'> &
  TBaseInputDefaultProps &
  TRInputProps & { format: MaskitoOptions }) => {
  // Test maskito
  const inputRef = useMaskito({ options: format });

  return <RInput {...rest} ref={inputRef} />;
};

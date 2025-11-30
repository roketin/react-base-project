import { useState } from 'react';
import {
  RInput,
  type TRInputProps,
} from '@/modules/app/components/base/r-input';
import RBtn from '@/modules/app/components/base/r-btn';
import type { TBaseInputDefaultProps } from '@/modules/app/types/component.type';
import { Eye, EyeOff } from 'lucide-react';

export const RInputPassword = (
  props: React.ComponentProps<'input'> & TBaseInputDefaultProps & TRInputProps,
) => {
  const [show, setShow] = useState(false);

  return (
    <RInput
      type={show ? 'text' : 'password'}
      {...props}
      rightIcon={
        <RBtn
          type='button'
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
        </RBtn>
      }
    />
  );
};

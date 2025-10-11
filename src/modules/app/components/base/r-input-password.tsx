import { useState } from 'react';
import { Input, type TInputProps } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import type { TBaseInputDefaultProps } from '@/modules/app/types/component.type';
import { Eye, EyeOff } from 'lucide-react';

export const RInputPassword = (
  props: React.ComponentProps<'input'> & TBaseInputDefaultProps & TInputProps,
) => {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? 'text' : 'password'}
      {...props}
      append={
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='flex-none'
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff /> : <Eye />}
        </Button>
      }
    />
  );
};

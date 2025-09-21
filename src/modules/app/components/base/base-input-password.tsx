import { useState } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import type { TBaseInputDefaultProps } from '@/modules/app/types/component.type';
import { Eye, EyeOff } from 'lucide-react';

export const BaseInputPassword = ({
  id,
  value,
  onChange,
  placeholder,
  ...rest
}: React.ComponentProps<'input'> & TBaseInputDefaultProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className='flex'>
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className='flex-1'
        {...rest}
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
    </div>
  );
};

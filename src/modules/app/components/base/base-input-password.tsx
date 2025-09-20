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
}: TBaseInputDefaultProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className='pr-8'
        {...rest}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-1 top-1/2 -translate-y-1/2'
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

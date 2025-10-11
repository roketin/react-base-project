import Select, { type SelectProps, type BaseSelectRef } from 'rc-select';
import { forwardRef } from 'react';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';

const RSelect = forwardRef<BaseSelectRef, SelectProps>(
  function RSelect(props, ref) {
    return (
      <Select
        ref={ref}
        placeholder={props.placeholder || 'Choose..'}
        {...props}
        menuItemSelectedIcon={
          props.mode === 'multiple' ? <Check size={14} /> : null
        }
        suffixIcon={
          <div role='img'>
            {props.loading ? (
              <LoaderCircle className='animate-spin' size={20} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
          </div>
        }
      />
    );
  },
);

export default RSelect;

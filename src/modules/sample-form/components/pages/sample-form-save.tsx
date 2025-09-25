import { RCard } from '@/modules/app/components/base/r-card';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multipe';
import { RComboBox } from '@/modules/app/components/base/r-combobox';
import { RMultiComboBox } from '@/modules/app/components/base/r-combobox-multiple';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputNumber } from '@/modules/app/components/base/r-input-number';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import Button from '@/modules/app/components/ui/button';
import { Checkbox } from '@/modules/app/components/ui/checkbox';
import { Input } from '@/modules/app/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/modules/app/components/ui/radio-group';
import { Switch } from '@/modules/app/components/ui/switch';
import { Textarea } from '@/modules/app/components/ui/textarea';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

const formSchema = Yup.object().shape({
  checkbox_single: Yup.bool().default(false).label('Checkbox Single'),
  checkbox_multiple: Yup.array()
    .of(Yup.string())
    .default([])
    .min(1)
    .label('Checkbox Multiple'),
  radio: Yup.string().default('').required().label('Radio'),
  input: Yup.string().default('').required().label('Input'),
  input_password: Yup.string().default('').required().label('Input Password'),
  input_number: Yup.number().default(0).min(0.0001).label('Input Number'),
  select: Yup.string().default('').required().label('Select'),
  select_multiple: Yup.array()
    .of(Yup.string())
    .default([])
    .min(1)
    .label('Select Multiple'),
  text_area: Yup.string().default('').required().label('Textarea'),
  switch: Yup.bool().default(false).label('Switch'),
  date_picker: Yup.date().required().default(undefined).label('Date Picker'),
  image: Yup.mixed<File>().required().default(undefined).label('Image'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const items = [
  { value: 'A', label: 'Item A' },
  { value: 'B', label: 'Item B' },
  { value: 'C', label: 'Item C' },
  { value: 'D', label: 'Item D' },
];

const TodoSave = () => {
  const form = useForm<TFormSchema>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: formSchema.getDefault(),
  });

  // Watch all values
  const watchAllValues = form.watch();

  /**
   * Handle submit
   * @param values
   */
  const handleSubmit = useCallback((values: TFormSchema) => {
    console.log('values', values);
  }, []);

  return (
    <div className='md:max-w-[1000px] md:mx-auto'>
      <div className='flex gap-4'>
        <RCard>
          <pre className='text-sm'>
            {JSON.stringify(watchAllValues, null, 2)}
          </pre>
        </RCard>
        <RCard>
          <RForm
            form={form}
            onSubmit={handleSubmit}
            className='gap-3'
            labelWidth='300px'
            showErrorPopup
          >
            {/* Checkbox Single */}
            <RFormField
              control={form.control}
              name='checkbox_single'
              label='Checkbox'
              valuePropName='checked'
            >
              <Checkbox label='Checkbox Single' className='mt-2' />
            </RFormField>

            {/* Checkbox Multiple */}
            <RFormField
              control={form.control}
              name='checkbox_multiple'
              label='Checkbox Multiple'
              valuePropName='checked'
            >
              <RCheckboxMultiple options={items} />
            </RFormField>

            {/* Radio */}
            <RFormField
              control={form.control}
              name='radio'
              label='Radio'
              valuePropName='radio'
            >
              <RadioGroup>
                <RadioGroupItem value='A'>A</RadioGroupItem>
                <RadioGroupItem value='B'>B</RadioGroupItem>
                <RadioGroupItem value='C'>C</RadioGroupItem>
              </RadioGroup>
            </RFormField>

            {/* Combobox */}
            <RFormField control={form.control} name='select' label='Select'>
              <RComboBox items={items} labelKey='label' valueKey='value' />
            </RFormField>

            {/* Combobox */}
            <RFormField
              control={form.control}
              name='select_multiple'
              label='Select Multiple'
            >
              <RMultiComboBox items={items} labelKey='label' valueKey='value' />
            </RFormField>

            {/* Switch */}
            <RFormField
              control={form.control}
              name='switch'
              label='Switch'
              valuePropName='checked'
            >
              <Switch className='mt-2' />
            </RFormField>

            {/* Input */}
            <RFormField
              control={form.control}
              name='input'
              label='Input'
              withPlaceholder
            >
              <Input />
            </RFormField>

            {/* Input Password */}
            <RFormField
              control={form.control}
              name='input_password'
              label='Input Password'
              withPlaceholder
            >
              <RInputPassword />
            </RFormField>

            {/* Input Number */}
            <RFormField
              control={form.control}
              name='input_number'
              label='Input Number'
            >
              <RInputNumber isOnBlurFormat placeholder='0' />
            </RFormField>

            {/* Textarea */}
            <RFormField
              control={form.control}
              name='text_area'
              label='Text Area'
            >
              <Textarea />
            </RFormField>

            <div>
              <Button type='submit'>Submit</Button>
            </div>
          </RForm>
        </RCard>
      </div>
    </div>
  );
};
export default TodoSave;

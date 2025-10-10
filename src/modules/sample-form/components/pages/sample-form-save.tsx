import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';
import { RComboBox } from '@/modules/app/components/base/r-combobox';
import { RMultiComboBox } from '@/modules/app/components/base/r-combobox-multiple';
import { RDatePicker } from '@/modules/app/components/base/r-datepicker';
import RFileUploader from '@/modules/app/components/base/r-file-uploader';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputNumber } from '@/modules/app/components/base/r-input-number';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import { Checkbox } from '@/modules/app/components/ui/checkbox';
import { Input } from '@/modules/app/components/ui/input';
import { RRadio } from '@/modules/app/components/base/r-radio';
import { Slider } from '@/modules/app/components/ui/slider';
import { Switch } from '@/modules/app/components/ui/switch';
import { Textarea } from '@/modules/app/components/ui/textarea';
import { fileOrStringRule } from '@/modules/app/validators/file.validator';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import RBtn from '@/modules/app/components/base/r-btn';
import { AlertTriangle, Save } from 'lucide-react';
import RStickyWrapper from '@/modules/app/components/base/r-sticky-wrapper';
import { cn } from '@/modules/app/libs/utils';
import type { MaskitoOptions } from '@maskito/core';
import { useMaskito } from '@maskito/react';

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
  date_picker_range: Yup.object()
    .shape({
      from: Yup.date().required().default(undefined).label('Date From'),
      to: Yup.date().required().default(undefined).label('Date To'),
    })
    .default(undefined)
    .required()
    .label('Date Picker Range'),
  image: fileOrStringRule('Image').required().default(undefined),
  slider: Yup.array().of(Yup.number()).default([0]).label('Slider'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const items = [
  { value: 'A', label: 'Item A' },
  { value: 'B', label: 'Item B' },
  { value: 'C', label: 'Item C' },
  { value: 'D', label: 'Item D' },
];

const digitsOnlyMask: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

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

  // Test maskito
  const inputRef = useMaskito({ options: digitsOnlyMask });

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10'>
        <RForm
          form={form}
          onSubmit={handleSubmit}
          className='gap-4'
          labelWidth='200px'
          showErrorPopup
        >
          <RStickyWrapper
            position='top'
            offset={10}
            offsetElements='#app-header'
          >
            {(isSticky) => (
              <div
                className={cn('wrapper-fly text-sm flex gap-3', {
                  'fly-active text-destructive': isSticky,
                })}
              >
                <AlertTriangle
                  className='flex-none relative top-0.5'
                  size={20}
                />
                <div className='flex-1'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis illo voluptatem hic nam facilis voluptatum possimus
                  illum ipsum eligendi at, facere accusamus minus explicabo iure
                  aspernatur praesentium consectetur atque quas?
                </div>
              </div>
            )}
          </RStickyWrapper>

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
          <RFormField control={form.control} name='radio' label='Radio'>
            <RRadio options={items} layout='horizontal' />
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
            <Input ref={inputRef} />
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
          <RFormField control={form.control} name='text_area' label='Text Area'>
            <Textarea />
          </RFormField>

          {/* DatePicker */}
          <RFormField
            control={form.control}
            name='date_picker'
            label='Date Picker Single'
          >
            <RDatePicker mode='single' disabledDate={{ before: new Date() }} />
          </RFormField>

          {/* DatePicker */}
          <RFormField
            control={form.control}
            name='date_picker_range'
            label='Date Picker Range'
          >
            <RDatePicker mode='range' />
          </RFormField>

          {/* File Uploader */}
          <RFormField
            control={form.control}
            name='image'
            label='Image Uploader'
          >
            <RFileUploader />
          </RFormField>

          {/* Slider */}
          <RFormField
            control={form.control}
            name='slider'
            label='Slider'
            valuePropName='slider'
          >
            <Slider min={0} max={100} step={1} className='mt-2' />
          </RFormField>

          <RStickyWrapper position='bottom' offset={10}>
            {(isSticky) => (
              <div className={cn('wrapper-fly', { 'fly-active': isSticky })}>
                <RBtn type='submit' iconStart={<Save />}>
                  Submit
                </RBtn>
              </div>
            )}
          </RStickyWrapper>
        </RForm>

        <RStickyWrapper position='top' offset={10} offsetElements='#app-header'>
          {(isSticky) => (
            <pre
              className={cn('text-sm p-4', {
                'bg-primary/30 rounded-xl': isSticky,
              })}
            >
              {JSON.stringify(watchAllValues, null, 2)}
            </pre>
          )}
        </RStickyWrapper>
      </div>
    </>
  );
};
export default TodoSave;

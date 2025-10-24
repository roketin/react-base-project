import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';
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
import { Save } from 'lucide-react';
import RStickyWrapper from '@/modules/app/components/base/r-sticky-wrapper';
import { cn } from '@/modules/app/libs/utils';
import type { MaskitoOptions } from '@maskito/core';
import { RInputFormat } from '@/modules/app/components/base/r-input-format';
import RSelect from '@/modules/app/components/base/r-select';
import { RFormDatePicker } from '@/modules/app/components/base/r-picker';
import { RFormRangePicker } from '@/modules/app/components/base/r-range-picker';
import { yupDateRangeRequired } from '@/modules/app/validators/date.validator';
import SampleStepper from '@/modules/sample-form/components/elements/sample-stepper';

const formSchema = Yup.object().shape({
  checkbox_single: Yup.bool().default(false).label('Checkbox Single'),
  checkbox_multiple: Yup.array()
    .of(Yup.string())
    .default([])
    .min(1)
    .label('Checkbox Multiple'),
  radio: Yup.string().default('').required().label('Radio'),
  input: Yup.string().default('').required().label('Input'),
  input_format: Yup.string().default('').required().label('Input Format'),
  input_password: Yup.string().default('').required().label('Input Password'),
  input_number: Yup.number().default(0).min(0.0001).label('Input Number'),
  select_new: Yup.string().required().label('Select'),
  select_new_multiple: Yup.array()
    .of(Yup.string())
    .default([])
    .min(1)
    .label('Select Multiple'),
  text_area: Yup.string().default('').required().label('Textarea'),
  switch: Yup.bool().default(false).label('Switch'),
  image: fileOrStringRule('Image').required().default(undefined),
  slider: Yup.array().of(Yup.number()).default([0]).label('Slider'),
  date_picker: Yup.date().required().label('Date Picker'),
  date_picker_range: yupDateRangeRequired('Date Picker Range'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const items = [
  { value: 'A', label: 'Item A' },
  { value: 'B', label: 'Item B' },
  { value: 'C', label: 'Item C' },
  { value: 'D', label: 'Item D' },
  { value: 'E', label: 'Item E' },
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

  return (
    <>
      <SampleStepper />

      <div className='grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10'>
        <RForm
          id='myFormId'
          form={form}
          onSubmit={handleSubmit}
          className='gap-4'
          labelWidth='200px'
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
            <RCheckboxMultiple options={items} className='mt-2' />
          </RFormField>

          {/* Radio */}
          <RFormField control={form.control} name='radio' label='Radio'>
            <RRadio options={items} layout='horizontal' className='mt-2' />
          </RFormField>

          {/* New: Combobox */}
          <RFormField
            control={form.control}
            name='select_new'
            label='Select'
            labelDescription='Updated Version'
          >
            <RSelect allowClear showSearch options={items} />
          </RFormField>

          {/* New: Combobox */}
          <RFormField
            control={form.control}
            name='select_new_multiple'
            label='Select Multiple'
            labelDescription='Updated Version'
          >
            <RSelect allowClear mode='multiple' options={items} />
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

          {/* Input Format */}
          <RFormField
            control={form.control}
            name='input_format'
            label='Input Format'
            description='The format does not yet contain validation. Please perform validation in yup.'
          >
            <RInputFormat
              placeholder='__-___-____-____'
              format={digitsOnlyMask}
              clearable
            />
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

          {/* Date Picker */}
          <RFormField
            control={form.control}
            name='date_picker'
            label='Date Picker'
          >
            <RFormDatePicker placeholder='Choose date' className='w-full' />
          </RFormField>

          {/* Date Picker Range */}
          <RFormField
            control={form.control}
            name='date_picker_range'
            label='Date Picker Range'
          >
            <RFormRangePicker
              placeholder={['Start date', 'End date']}
              className='w-full'
            />
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
        </RForm>

        <pre
          className={cn(
            'text-sm p-4 overflow-auto bg-primary/5 rounded border border-primary/20 shadow-md',
          )}
        >
          {JSON.stringify(watchAllValues, null, 2)}
        </pre>
      </div>

      <RStickyWrapper position='bottom' offset={10}>
        {(isSticky) => (
          <div className={cn('wrapper-fly mt-6', { 'fly-active': isSticky })}>
            <RBtn iconStart={<Save />} form='myFormId' type='submit'>
              Submit
            </RBtn>
          </div>
        )}
      </RStickyWrapper>
    </>
  );
};
export default TodoSave;

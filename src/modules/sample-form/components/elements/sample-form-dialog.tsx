import RBtn from '@/modules/app/components/base/r-btn';
import RDialog from '@/modules/app/components/base/r-dialog';
import RForm from '@/modules/app/components/base/r-form';
import RInput from '@/modules/app/components/base/r-input';
import { RFormDatePicker } from '@/modules/app/components/base/r-picker';
import { RFormRangePicker } from '@/modules/app/components/base/r-range-picker';
import RSelect from '@/modules/app/components/base/r-select';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { yupDateRangeRequired } from '@/modules/app/validators/date.validator';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

type TCountryOption = { id: string; name: string };

const testDialogSchema = Yup.object({
  name: Yup.string().default('').required().label('Name'),
  country: Yup.string().required().label('Country'),
  date_picker: Yup.date().required().label('Date Picker'),
  date_picker_range: yupDateRangeRequired('Date Picker Range'),
});

export type TTestDialogSchema = Yup.InferType<typeof testDialogSchema>;

type SampleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countries: TCountryOption[];
  onSubmit?: (values: TTestDialogSchema) => void;
};

const SampleFormDialog = ({
  open,
  onOpenChange,
  countries,
  onSubmit,
}: SampleFormDialogProps) => {
  const form = useForm<TTestDialogSchema>({
    mode: 'onTouched',
    resolver: yupResolver(testDialogSchema),
    defaultValues: testDialogSchema.getDefault(),
  });

  const handleSubmit = useCallback(
    (values: TTestDialogSchema) => {
      onSubmit?.(values);
      onOpenChange(false);
      form.reset();
    },
    [form, onOpenChange, onSubmit],
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    form.reset();
  }, [form, onOpenChange]);

  return (
    <RDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Test Dialog Z-Index'
      contentClassName='w-[250px] max-w-[250px]'
      footer={
        <>
          <RBtn variant='outline' onClick={handleCancel}>
            Cancel
          </RBtn>
          <RBtn onClick={form.handleSubmit(handleSubmit)}>Submit</RBtn>
        </>
      }
    >
      <RForm form={form} onSubmit={handleSubmit} layout='vertical'>
        <RFormField control={form.control} name='name' label='Name'>
          <RInput placeholder='Enter name' />
        </RFormField>

        <RFormField control={form.control} name='country' label='Country'>
          <RSelect
            showSearch
            options={countries}
            fieldNames={{ label: 'name', value: 'id' }}
            placeholder='Select country'
          />
        </RFormField>

        <RFormField control={form.control} name='date_picker' label='Date'>
          <RFormDatePicker placeholder='Pick a date' className='w-full' />
        </RFormField>

        <RFormField
          control={form.control}
          name='date_picker_range'
          label='Date Range'
        >
          <RFormRangePicker
            placeholder={['Start date', 'End date']}
            className='w-full'
          />
        </RFormField>
      </RForm>
    </RDialog>
  );
};

export default SampleFormDialog;

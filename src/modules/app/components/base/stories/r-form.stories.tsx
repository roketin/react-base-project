import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RForm, { type TRFormProps } from '../r-form';
import { RFormField } from '../r-form-field';
import { RInput } from '../r-input';
import RBtn from '../r-btn';
import Yup from '@/plugins/yup';

const schema = Yup.object({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters.')
    .required('Full name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

type FormValues = Yup.InferType<typeof schema>;

type StoryProps = Pick<
  TRFormProps<FormValues>,
  | 'layout'
  | 'labelWidth'
  | 'spacing'
  | 'disabled'
  | 'showErrorPopup'
  | 'hideHorizontalLine'
>;

const FormStory = (props: StoryProps) => {
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
    },
    mode: 'onBlur',
  });

  return (
    <div className='w-[420px] space-y-4 rounded-xl border bg-background p-6 shadow-sm'>
      <RForm<FormValues>
        {...props}
        form={form}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted', values);
        }}
      >
        <RFormField
          control={form.control}
          name='fullName'
          label='Full Name'
          withPlaceholder
        >
          <RInput />
        </RFormField>
        <RFormField
          control={form.control}
          name='email'
          label='Email Address'
          withPlaceholder
        >
          <RInput type='email' />
        </RFormField>

        {!props.hideHorizontalLine && <hr className='col-span-full my-4' />}

        <div className='flex justify-end pt-2'>
          <RBtn type='submit' disabled={props.disabled}>
            Submit
          </RBtn>
        </div>
      </RForm>
    </div>
  );
};

const meta: Meta<typeof FormStory> = {
  title: 'Components/Layout/RForm',
  component: FormStory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['horizontal', 'vertical'] },
    labelWidth: { control: 'text' },
    spacing: { control: 'text' },
    disabled: { control: 'boolean' },
    showErrorPopup: { control: 'boolean' },
    hideHorizontalLine: { control: 'boolean' },
  },
  args: {
    layout: 'horizontal',
    labelWidth: '140px',
    spacing: '1rem',
    disabled: false,
    showErrorPopup: false,
    hideHorizontalLine: false,
  },
};

export default meta;

type Story = StoryObj<typeof FormStory>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    layout: 'vertical',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithErrorPopup: Story = {
  args: {
    showErrorPopup: true,
  },
};

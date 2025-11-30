import type { Meta, StoryObj } from '@storybook/react-vite';
import { RLabel } from '../r-label';
import { RInput } from '../r-input';

const meta = {
  title: 'Components/Other/RLabel',
  component: RLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label Text',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='space-y-3'>
      <RLabel variant='default'>Default Label</RLabel>
      <RLabel variant='error'>Error Label</RLabel>
      <RLabel variant='success'>Success Label</RLabel>
      <RLabel variant='muted'>Muted Label</RLabel>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='space-y-3'>
      <RLabel size='sm'>Small Label</RLabel>
      <RLabel size='default'>Default Label</RLabel>
      <RLabel size='lg'>Large Label</RLabel>
    </div>
  ),
};

export const Required: Story = {
  args: {
    children: 'Required Field',
    required: true,
  },
};

export const WithInput: Story = {
  render: () => (
    <div className='space-y-4 w-80'>
      <div className='space-y-2'>
        <RLabel htmlFor='email'>Email</RLabel>
        <input
          id='email'
          type='email'
          placeholder='Enter email'
          className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
        />
      </div>

      <div className='space-y-2'>
        <RLabel htmlFor='name' required>
          Full Name
        </RLabel>
        <input
          id='name'
          type='text'
          placeholder='Enter name'
          className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
        />
      </div>

      <div className='space-y-2'>
        <RLabel htmlFor='error-field' variant='error' required>
          Field with Error
        </RLabel>
        <input
          id='error-field'
          type='text'
          placeholder='Enter value'
          className='flex h-10 w-full rounded-md border border-red-500 bg-white px-3 py-2 text-sm'
        />
        <p className='text-xs text-red-500'>This field is required</p>
      </div>
    </div>
  ),
};

export const WithRInput: Story = {
  render: () => (
    <div className='space-y-4 w-80'>
      <div className='space-y-2'>
        <RLabel htmlFor='username'>Username</RLabel>
        <RInput id='username' placeholder='Enter username' />
      </div>

      <div className='space-y-2'>
        <RLabel htmlFor='password' required>
          Password
        </RLabel>
        <RInput id='password' type='password' placeholder='Enter password' />
      </div>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-3'>Default Variant</h3>
        <div className='space-y-2'>
          <RLabel size='sm'>Small</RLabel>
          <RLabel size='default'>Default</RLabel>
          <RLabel size='lg'>Large</RLabel>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Error Variant</h3>
        <div className='space-y-2'>
          <RLabel variant='error' size='sm'>
            Small Error
          </RLabel>
          <RLabel variant='error' size='default'>
            Default Error
          </RLabel>
          <RLabel variant='error' size='lg'>
            Large Error
          </RLabel>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Required Labels</h3>
        <div className='space-y-2'>
          <RLabel required size='sm'>
            Small Required
          </RLabel>
          <RLabel required size='default'>
            Default Required
          </RLabel>
          <RLabel required size='lg'>
            Large Required
          </RLabel>
        </div>
      </div>
    </div>
  ),
};

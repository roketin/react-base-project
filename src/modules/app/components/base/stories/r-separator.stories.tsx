import type { Meta, StoryObj } from '@storybook/react-vite';
import { RSeparator } from '../r-separator';

const meta = {
  title: 'Components/Layout/RSeparator',
  component: RSeparator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className='w-80'>
      <div className='space-y-1'>
        <h4 className='text-sm font-medium leading-none'>Radix Primitives</h4>
        <p className='text-sm text-slate-500'>
          An open-source UI component library.
        </p>
      </div>
      <RSeparator className='my-4' />
      <div className='flex h-5 items-center space-x-4 text-sm'>
        <div>Blog</div>
        <RSeparator orientation='vertical' />
        <div>Docs</div>
        <RSeparator orientation='vertical' />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className='flex h-20 items-center space-x-4'>
      <div>Item 1</div>
      <RSeparator orientation='vertical' />
      <div>Item 2</div>
      <RSeparator orientation='vertical' />
      <div>Item 3</div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className='w-96 rounded-lg border border-slate-200 p-6'>
      <div className='space-y-1'>
        <h3 className='text-lg font-semibold'>Account Settings</h3>
        <p className='text-sm text-slate-500'>
          Manage your account settings and preferences.
        </p>
      </div>
      <RSeparator className='my-4' />
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Email notifications</span>
          <span className='text-sm text-slate-500'>Enabled</span>
        </div>
        <RSeparator />
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Marketing emails</span>
          <span className='text-sm text-slate-500'>Disabled</span>
        </div>
        <RSeparator />
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Security alerts</span>
          <span className='text-sm text-slate-500'>Enabled</span>
        </div>
      </div>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <div>
        <p className='text-sm'>Default color</p>
        <RSeparator className='my-2' />
      </div>
      <div>
        <p className='text-sm'>Primary color</p>
        <RSeparator className='my-2 bg-primary' />
      </div>
      <div>
        <p className='text-sm'>Red color</p>
        <RSeparator className='my-2 bg-red-500' />
      </div>
      <div>
        <p className='text-sm'>Green color</p>
        <RSeparator className='my-2 bg-green-500' />
      </div>
    </div>
  ),
};

export const DifferentThickness: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <div>
        <p className='text-sm'>Thin (default)</p>
        <RSeparator className='my-2' />
      </div>
      <div>
        <p className='text-sm'>Medium</p>
        <RSeparator className='my-2 h-0.5' />
      </div>
      <div>
        <p className='text-sm'>Thick</p>
        <RSeparator className='my-2 h-1' />
      </div>
    </div>
  ),
};

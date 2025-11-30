import type { Meta, StoryObj } from '@storybook/react-vite';
import { RSkeleton } from '../r-skeleton';

const meta = {
  title: 'Components/Feedback/RSkeleton',
  component: RSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-12 w-64',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='space-y-4'>
      <div>
        <p className='text-sm mb-2'>Default</p>
        <RSkeleton className='h-12 w-64' />
      </div>
      <div>
        <p className='text-sm mb-2'>Circular</p>
        <RSkeleton variant='circular' className='h-12 w-12' />
      </div>
      <div>
        <p className='text-sm mb-2'>Rectangular</p>
        <RSkeleton variant='rectangular' className='h-12 w-64' />
      </div>
      <div>
        <p className='text-sm mb-2'>Text</p>
        <RSkeleton variant='text' className='w-64' />
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div className='space-y-4'>
      <div>
        <p className='text-sm mb-2'>Pulse (default)</p>
        <RSkeleton animation='pulse' className='h-12 w-64' />
      </div>
      <div>
        <p className='text-sm mb-2'>Wave</p>
        <RSkeleton animation='wave' className='h-12 w-64' />
      </div>
      <div>
        <p className='text-sm mb-2'>None</p>
        <RSkeleton animation='none' className='h-12 w-64' />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className='w-80 rounded-lg border border-slate-200 p-6 space-y-4'>
      <div className='flex items-center space-x-4'>
        <RSkeleton variant='circular' className='h-12 w-12' />
        <div className='space-y-2 flex-1'>
          <RSkeleton variant='text' className='w-3/4' />
          <RSkeleton variant='text' className='w-1/2' />
        </div>
      </div>
      <RSkeleton className='h-32 w-full' />
      <div className='space-y-2'>
        <RSkeleton variant='text' className='w-full' />
        <RSkeleton variant='text' className='w-5/6' />
        <RSkeleton variant='text' className='w-4/6' />
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className='w-96 space-y-3'>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className='flex items-center space-x-4'>
          <RSkeleton variant='circular' className='h-10 w-10' />
          <div className='space-y-2 flex-1'>
            <RSkeleton variant='text' className='w-3/4' />
            <RSkeleton variant='text' className='w-1/2' />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className='w-full max-w-2xl space-y-2'>
      <RSkeleton className='h-10 w-full' />
      {[1, 2, 3, 4, 5].map((i) => (
        <RSkeleton key={i} className='h-16 w-full' />
      ))}
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div className='w-80 rounded-lg border border-slate-200 p-6'>
      <div className='flex flex-col items-center space-y-4'>
        <RSkeleton variant='circular' className='h-24 w-24' />
        <div className='space-y-2 w-full'>
          <RSkeleton variant='text' className='w-2/3 mx-auto' />
          <RSkeleton variant='text' className='w-1/2 mx-auto' />
        </div>
        <div className='w-full space-y-2 pt-4'>
          <RSkeleton className='h-10 w-full' />
          <RSkeleton className='h-10 w-full' />
        </div>
      </div>
    </div>
  ),
};

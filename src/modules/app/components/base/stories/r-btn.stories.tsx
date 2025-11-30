import type { Meta, StoryObj } from '@storybook/react-vite';
import RBtn from '../r-btn';
import { Mail, Download, Trash2, Plus } from 'lucide-react';

const meta = {
  title: 'Components/Buttons/RBtn',
  component: RBtn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <RBtn variant='default'>Default</RBtn>
      <RBtn variant='destructive'>Destructive</RBtn>
      <RBtn variant='outline'>Outline</RBtn>
      <RBtn variant='secondary'>Secondary</RBtn>
      <RBtn variant='ghost'>Ghost</RBtn>
      <RBtn variant='link'>Link</RBtn>
      <RBtn variant='info'>Info</RBtn>
      <RBtn variant='success'>Success</RBtn>
      <RBtn variant='warning'>Warning</RBtn>
      <RBtn variant='error'>Error</RBtn>
      <RBtn variant='confirm'>Confirm</RBtn>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <RBtn variant='default' soft>
        Default
      </RBtn>
      <RBtn variant='destructive' soft>
        Destructive
      </RBtn>
      <RBtn variant='info' soft>
        Info
      </RBtn>
      <RBtn variant='success' soft>
        Success
      </RBtn>
      <RBtn variant='warning' soft>
        Warning
      </RBtn>
      <RBtn variant='error' soft>
        Error
      </RBtn>
      <RBtn variant='confirm' soft>
        Confirm
      </RBtn>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <RBtn size='sm'>Small</RBtn>
      <RBtn size='default'>Default</RBtn>
      <RBtn size='lg'>Large</RBtn>
    </div>
  ),
};

export const WithIconStart: Story = {
  args: {
    children: 'Send Email',
    iconStart: <Mail className='h-4 w-4' />,
  },
};

export const WithIconEnd: Story = {
  args: {
    children: 'Download',
    iconEnd: <Download className='h-4 w-4' />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Action',
    iconStart: <Plus className='h-4 w-4' />,
    iconEnd: <Download className='h-4 w-4' />,
  },
};

export const IconOnly: Story = {
  render: () => (
    <div className='flex gap-3'>
      <RBtn size='icon' variant='default'>
        <Mail className='h-4 w-4' />
      </RBtn>
      <RBtn size='icon' variant='outline'>
        <Download className='h-4 w-4' />
      </RBtn>
      <RBtn size='icon' variant='destructive'>
        <Trash2 className='h-4 w-4' />
      </RBtn>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    loading: true,
  },
};

export const LoadingWithLabel: Story = {
  args: {
    children: 'Submit',
    loading: true,
    loadingLabel: 'Submitting...',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    className: 'w-full',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AsLink: Story = {
  render: () => (
    <div className='flex gap-3'>
      <RBtn variant='link'>Link Button</RBtn>
      <RBtn variant='link' iconStart={<Mail className='h-4 w-4' />}>
        With Icon
      </RBtn>
    </div>
  ),
};

export const Debounced: Story = {
  args: {
    children: 'Click Me (Debounced)',
    debounceMs: 1000,
    onClick: () => alert('Clicked!'),
  },
};

export const AllSizesAllVariants: Story = {
  render: () => (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Small</h3>
        <div className='flex flex-wrap gap-2'>
          <RBtn size='sm' variant='default'>
            Default
          </RBtn>
          <RBtn size='sm' variant='destructive'>
            Destructive
          </RBtn>
          <RBtn size='sm' variant='outline'>
            Outline
          </RBtn>
          <RBtn size='sm' variant='secondary'>
            Secondary
          </RBtn>
          <RBtn size='sm' variant='ghost'>
            Ghost
          </RBtn>
        </div>
      </div>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Default</h3>
        <div className='flex flex-wrap gap-2'>
          <RBtn size='default' variant='default'>
            Default
          </RBtn>
          <RBtn size='default' variant='destructive'>
            Destructive
          </RBtn>
          <RBtn size='default' variant='outline'>
            Outline
          </RBtn>
          <RBtn size='default' variant='secondary'>
            Secondary
          </RBtn>
          <RBtn size='default' variant='ghost'>
            Ghost
          </RBtn>
        </div>
      </div>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Large</h3>
        <div className='flex flex-wrap gap-2'>
          <RBtn size='lg' variant='default'>
            Default
          </RBtn>
          <RBtn size='lg' variant='destructive'>
            Destructive
          </RBtn>
          <RBtn size='lg' variant='outline'>
            Outline
          </RBtn>
          <RBtn size='lg' variant='secondary'>
            Secondary
          </RBtn>
          <RBtn size='lg' variant='ghost'>
            Ghost
          </RBtn>
        </div>
      </div>
    </div>
  ),
};

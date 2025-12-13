import type { Meta, StoryObj } from '@storybook/react-vite';
import { RTooltip } from '../r-tooltip';
import RBtn from '@/modules/app/components/base/r-btn';
import { Info, Settings, HelpCircle, Bell } from 'lucide-react';

const meta: Meta<typeof RTooltip> = {
  title: 'Components/Feedback/RTooltip',
  component: RTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
    },
    withArrow: {
      control: 'boolean',
    },
    delayDuration: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
    },
  },
  args: {
    content: 'Tooltip with bounce animation',
    side: 'top',
    align: 'center',
    withArrow: true,
    delayDuration: 0,
  },
};

export default meta;

type Story = StoryObj<typeof RTooltip>;

export const Playground: Story = {
  render: (args) => (
    <RTooltip {...args}>
      <RBtn variant='default'>Hover me</RBtn>
    </RTooltip>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className='flex flex-col items-center gap-16 p-8'>
      <RTooltip content='Tooltip on top' side='top'>
        <RBtn variant='outline'>Top</RBtn>
      </RTooltip>

      <div className='flex items-center gap-16'>
        <RTooltip content='Tooltip on left' side='left'>
          <RBtn variant='outline'>Left</RBtn>
        </RTooltip>

        <RTooltip content='Tooltip on right' side='right'>
          <RBtn variant='outline'>Right</RBtn>
        </RTooltip>
      </div>

      <RTooltip content='Tooltip on bottom' side='bottom'>
        <RBtn variant='outline'>Bottom</RBtn>
      </RTooltip>
    </div>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex items-center gap-4'>
        <span className='w-20 text-sm text-muted-foreground'>Top:</span>
        <RTooltip content='Aligned to start' side='top' align='start'>
          <RBtn variant='outline' size='sm'>
            Start
          </RBtn>
        </RTooltip>
        <RTooltip content='Aligned to center' side='top' align='center'>
          <RBtn variant='outline' size='sm'>
            Center
          </RBtn>
        </RTooltip>
        <RTooltip content='Aligned to end' side='top' align='end'>
          <RBtn variant='outline' size='sm'>
            End
          </RBtn>
        </RTooltip>
      </div>

      <div className='flex items-center gap-4'>
        <span className='w-20 text-sm text-muted-foreground'>Bottom:</span>
        <RTooltip content='Aligned to start' side='bottom' align='start'>
          <RBtn variant='outline' size='sm'>
            Start
          </RBtn>
        </RTooltip>
        <RTooltip content='Aligned to center' side='bottom' align='center'>
          <RBtn variant='outline' size='sm'>
            Center
          </RBtn>
        </RTooltip>
        <RTooltip content='Aligned to end' side='bottom' align='end'>
          <RBtn variant='outline' size='sm'>
            End
          </RBtn>
        </RTooltip>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <RTooltip content='Information'>
        <button className='p-2 rounded-md hover:bg-accent transition-colors'>
          <Info size={20} />
        </button>
      </RTooltip>

      <RTooltip content='Settings'>
        <button className='p-2 rounded-md hover:bg-accent transition-colors'>
          <Settings size={20} />
        </button>
      </RTooltip>

      <RTooltip content='Help & Support'>
        <button className='p-2 rounded-md hover:bg-accent transition-colors'>
          <HelpCircle size={20} />
        </button>
      </RTooltip>

      <RTooltip content='3 new notifications' side='bottom'>
        <button className='relative p-2 rounded-md hover:bg-accent transition-colors'>
          <Bell size={20} />
          <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
        </button>
      </RTooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <RTooltip content='No delay (instant)' delayDuration={0}>
        <RBtn variant='outline' size='sm'>
          0ms
        </RBtn>
      </RTooltip>

      <RTooltip content='Short delay' delayDuration={200}>
        <RBtn variant='outline' size='sm'>
          200ms
        </RBtn>
      </RTooltip>

      <RTooltip content='Medium delay' delayDuration={500}>
        <RBtn variant='outline' size='sm'>
          500ms
        </RBtn>
      </RTooltip>

      <RTooltip content='Long delay' delayDuration={1000}>
        <RBtn variant='outline' size='sm'>
          1000ms
        </RBtn>
      </RTooltip>
    </div>
  ),
};

export const WithoutArrow: Story = {
  args: {
    content: 'Tooltip without arrow',
    withArrow: false,
  },
  render: (args) => (
    <RTooltip {...args}>
      <RBtn variant='outline'>No arrow</RBtn>
    </RTooltip>
  ),
};

export const RichContent: Story = {
  args: {
    side: 'right',
    align: 'center',
    content: (
      <div className='space-y-1'>
        <p className='text-xs font-semibold uppercase tracking-wide opacity-80'>
          Pro Tip
        </p>
        <p className='text-xs'>
          Press{' '}
          <kbd className='rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono'>
            ⌘K
          </kbd>{' '}
          to open the command palette.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <RTooltip {...args}>
      <RBtn variant='outline'>Keyboard shortcuts</RBtn>
    </RTooltip>
  ),
};

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip message that demonstrates how the tooltip handles multiple lines of text content gracefully.',
    side: 'top',
  },
  render: (args) => (
    <RTooltip {...args}>
      <RBtn variant='outline'>Long tooltip</RBtn>
    </RTooltip>
  ),
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    disabled: true,
  },
  render: (args) => (
    <RTooltip {...args}>
      <RBtn variant='outline'>Disabled tooltip</RBtn>
    </RTooltip>
  ),
};

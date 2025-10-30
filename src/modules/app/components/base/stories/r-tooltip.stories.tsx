import type { Meta, StoryObj } from '@storybook/react-vite';
import { RTooltip } from '../r-tooltip';
import RBtn from '@/modules/app/components/base/r-btn';

const meta: Meta<typeof RTooltip> = {
  title: 'Base/RTooltip',
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
  },
  args: {
    content:
      'Use tooltips to provide lightweight context for critical actions.',
    side: 'top',
    align: 'center',
    withArrow: true,
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

export const RichContent: Story = {
  args: {
    side: 'right',
    align: 'center',
    content: (
      <div className='max-w-[220px] space-y-1'>
        <p className='text-xs font-semibold uppercase tracking-wide text-primary-foreground/80'>
          Tip
        </p>
        <p className='text-xs font-medium text-primary-foreground/90'>
          You can press{' '}
          <kbd className='rounded bg-primary-foreground px-1 py-0.5 text-[10px] text-primary'>
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

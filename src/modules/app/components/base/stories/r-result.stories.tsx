import type { Meta, StoryObj } from '@storybook/react-vite';
import { RResult } from '../r-result';
import RBtn from '@/modules/app/components/base/r-btn';

const meta: Meta<typeof RResult> = {
  title: 'Base/RResult',
  component: RResult,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['empty', 'info', 'success', 'warning', 'error'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    align: {
      control: 'inline-radio',
      options: ['center', 'start'],
    },
    subdued: {
      control: 'boolean',
    },
    fullHeight: {
      control: 'boolean',
    },
  },
  args: {
    status: 'empty',
    title: 'Nothing here yet',
    description:
      'Start by creating a new record or import existing data to populate this view.',
    size: 'md',
    align: 'center',
    subdued: false,
    fullHeight: false,
    action: <RBtn variant='default'>Create new item</RBtn>,
  },
};

export default meta;

type Story = StoryObj<typeof RResult>;

export const Playground: Story = {};

export const EmptyState: Story = {
  args: {
    status: 'empty',
    title: 'No projects found',
    description:
      'Projects you create or join will appear here. Invite teammates or create a project to get started.',
    action: (
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <RBtn>Create project</RBtn>
        <RBtn variant='outline'>Invite teammates</RBtn>
      </div>
    ),
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Payment successful',
    description:
      'We have emailed your receipt and updated your billing information.',
    action: <RBtn variant='outline'>View invoice</RBtn>,
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Storage almost full',
    description:
      'You are using 95% of your available storage. Consider upgrading to avoid interruptions.',
    action: <RBtn variant='default'>Upgrade plan</RBtn>,
  },
};

export const ErrorState: Story = {
  args: {
    status: 'error',
    title: 'Failed to process request',
    description:
      'Something unexpected happened while processing your request. Please try again in a moment.',
    action: (
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <RBtn>Try again</RBtn>
        <RBtn variant='outline'>Contact support</RBtn>
      </div>
    ),
  },
};

export const WithCustomIcon: Story = {
  args: {
    status: 'info',
    title: 'Maintenance window scheduled',
    description:
      'System maintenance will occur on Saturday at 2:00 AM UTC. Expect up to 20 minutes of downtime.',
    iconWrapperClassName: 'bg-primary/10 text-primary border-primary/20',
    action: <RBtn variant='outline'>Remind me</RBtn>,
  },
};

export const StartAligned: Story = {
  args: {
    align: 'start',
    status: 'info',
    size: 'lg',
    title: 'Quarterly report ready',
    description:
      'Download the latest financial report to review performance and share insights with your stakeholders.',
    action: <RBtn variant='default'>Download report</RBtn>,
  },
};

export const Subdued: Story = {
  args: {
    status: 'empty',
    subdued: true,
    fullHeight: true,
    title: 'Waiting for next step',
    description:
      'Once you complete the previous task, we will unlock the next section automatically.',
  },
};

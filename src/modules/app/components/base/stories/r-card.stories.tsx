import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Trash2 } from 'lucide-react';
import RBtn from '@/modules/app/components/base/r-btn';
import { RCard } from '@/modules/app/components/base/r-card';

const meta = {
  title: 'Components/Data Display/RCard',
  component: RCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic card using title, description, and body content.
 */
export const Default: Story = {
  render: () => (
    <RCard
      className='w-[360px]'
      title='Card Title'
      description='Card description goes here.'
    >
      <p>This is the main content of the card.</p>
    </RCard>
  ),
};

/**
 * Card that uses header, action, body, and footer slots.
 */
export const WithActionsAndFooter: Story = {
  render: () => (
    <RCard
      className='w-[460px]'
      header={<p className='text-sm font-medium text-primary'>Project</p>}
      title='Complete Card'
      description='This card showcases all available sections including actions.'
      action={
        <>
          <RBtn variant='outline' size='iconSm'>
            <Settings className='h-4 w-4' />
          </RBtn>
          <RBtn size='iconSm'>Edit</RBtn>
        </>
      }
      footer={
        <div className='flex w-full justify-between'>
          <RBtn variant='ghost' className='text-destructive'>
            <Trash2 className='mr-2 h-4 w-4' /> Delete
          </RBtn>
          <RBtn>Save Changes</RBtn>
        </div>
      }
    >
      <div className='space-y-4'>
        <p>Important data or forms can be placed inside the content area.</p>
        <p>You can add any React components here.</p>
      </div>
    </RCard>
  ),
};

/**
 * Card with a custom header layout for extra context.
 */
export const CustomHeader: Story = {
  render: () => (
    <RCard
      className='w-[380px]'
      header={
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
            Q4
          </div>
          <div className='space-y-0.5'>
            <p className='text-sm font-medium leading-none'>Weekly Report</p>
            <p className='text-xs text-muted-foreground'>Oct 2025</p>
          </div>
        </div>
      }
      title='Revenue Snapshot'
      description="Summary of this week's performance."
      footer={
        <RBtn variant='link' className='px-0'>
          View Details
        </RBtn>
      }
    >
      <ul className='space-y-2 text-sm text-muted-foreground'>
        <li>• New subscriptions increased by 8%.</li>
        <li>• Average order value is up to $82.</li>
        <li>• Customer satisfaction holds at 4.7/5.</li>
      </ul>
    </RCard>
  ),
};

/**
 * Simple card with only content.
 */
export const ContentOnly: Story = {
  render: () => (
    <RCard className='w-[320px]'>
      <div className='space-y-3 pt-6'>
        <p>A simple card with only content, no header or footer.</p>
        <p className='text-sm text-muted-foreground'>
          Add your own padding or layout inside the content area when no header
          is provided.
        </p>
      </div>
    </RCard>
  ),
};

/**
 * Multiple cards in a grid layout.
 */
export const GridLayout: Story = {
  render: () => (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <RCard title='Card 1' description='First card in grid' className='h-full'>
        <p>Content for card 1</p>
      </RCard>
      <RCard
        title='Card 2'
        description='Second card in grid'
        className='h-full'
      >
        <p>Content for card 2</p>
      </RCard>
      <RCard title='Card 3' description='Third card in grid' className='h-full'>
        <p>Content for card 3</p>
      </RCard>
      <RCard
        title='Card 4'
        description='Fourth card in grid'
        className='h-full'
      >
        <p>Content for card 4</p>
      </RCard>
    </div>
  ),
};

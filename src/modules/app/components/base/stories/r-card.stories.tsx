import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Trash2 } from 'lucide-react';
import Button from '@/modules/app/components/ui/button';
import { RCard } from '@/modules/app/components/base/r-card';

const meta: Meta<typeof RCard> = {
  title: 'Base/RCard',
  component: RCard,
  tags: ['autodocs'], // Enable automatic Docs page
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    children: { control: 'text' },
    wrapperClassName: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof RCard>;

/**
 * Main story showing the most basic use of RCard with Title and Content.
 */
export const Default: Story = {
  args: {
    title: 'Simple Card Title',
    description: 'A brief description for this card.',
    children: (
      <div>
        <p>Main card content is here.</p>
        <p>
          You can place JSX elements, text, or other components inside children.
        </p>
      </div>
    ),
  },
};

/**
 * Story displaying all slot props, including Action, Footer, and Wrapper Class.
 */
export const WithAllSlots: Story = {
  args: {
    title: 'Complete Card with All Slots',
    description:
      'This is an example card utilizing header, action, and footer.',
    children: (
      <div className='space-y-4'>
        <p>Important data or forms are placed inside Content.</p>
        <p>Props `children` are placed inside `CardContent`.</p>
      </div>
    ),
    action: (
      <Button variant='outline' size='icon'>
        <Settings className='h-4 w-4' />
      </Button>
    ),
    footer: (
      <div className='flex justify-between w-full'>
        <Button variant='ghost' className='text-red-500'>
          <Trash2 className='w-4 h-4 mr-2' /> Delete
        </Button>
        <Button>Save Changes</Button>
      </div>
    ),
    // Adding Tailwind class for custom card size
    wrapperClassName: 'w-[450px]',
  },
};

/**
 * Story that only uses the `header` prop for a highly custom layout.
 */
export const CustomHeader: Story = {
  args: {
    header: (
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Weekly Report</h2>
        <span className='text-sm text-muted-foreground'>Oct 2025</span>
      </div>
    ),
    children: (
      <p>Report data is displayed here without built-in Title/Description.</p>
    ),
    footer: <Button variant='link'>View Details</Button>,
    wrapperClassName: 'w-[300px]',
  },
};

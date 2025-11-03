import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, Clock, PackagePlus } from 'lucide-react';
import { RTimeline, type TRTimelineItem } from '../r-timeline';
import RBtn from '@/modules/app/components/base/r-btn';

const items: TRTimelineItem[] = [
  {
    id: '1',
    title: 'Order received',
    description:
      'We have received your order and it’s currently being validated.',
    timestamp: '08:12 AM',
    status: 'completed',
    icon: <PackagePlus className='size-4 text-primary' />,
    metadata: (
      <div className='flex items-center justify-between'>
        <span>Order #2910</span>
        <span className='text-muted-foreground'>via Web checkout</span>
      </div>
    ),
  },
  {
    id: '2',
    title: 'Processing payment',
    description: 'Payment verification is underway with your bank provider.',
    timestamp: '08:25 AM',
    status: 'current',
    icon: <Clock className='size-4 text-primary' />,
    actions: <RBtn size='sm'>View details</RBtn>,
  },
  {
    id: '3',
    title: 'Preparing shipment',
    description:
      'Our warehouse team is packing your items. You will receive a tracking number soon.',
    timestamp: 'Scheduled',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Out for delivery',
    description: 'The courier will deliver the package to your address.',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Delivered',
    description: 'Package delivered to destination. Please confirm receipt.',
    status: 'upcoming',
  },
];

const meta: Meta<typeof RTimeline> = {
  title: 'Base/RTimeline',
  component: RTimeline,
  tags: ['autodocs'],
  args: {
    items,
    variant: 'solid',
    align: 'left',
    showLine: true,
    compact: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'ghost'],
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'alternate'],
    },
    showLine: {
      control: 'boolean',
    },
    compact: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RTimeline>;

export const Default: Story = {};

export const Alternate: Story = {
  args: {
    align: 'alternate',
    items: items.map((item, index) =>
      index === 4
        ? {
            ...item,
            status: 'completed',
            icon: <CheckCircle2 className='size-4 text-emerald-500' />,
          }
        : item,
    ),
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    variant: 'ghost',
  },
};

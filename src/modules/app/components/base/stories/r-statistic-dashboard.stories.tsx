import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpRight, Users, Wallet, Zap } from 'lucide-react';
import { RStatisticDashboard } from '../r-statistic-dashboard';
import RBtn from '@/modules/app/components/base/r-btn';

const metrics = [
  {
    id: 'revenue',
    label: 'Monthly revenue',
    value: '$128,400',
    description: 'Net revenue processed across all payment providers.',
    trend: {
      value: '18% MoM',
      direction: 'up' as const,
      label: 'vs last month',
    },
    icon: <Wallet className='size-5 text-primary' />,
    tags: (
      <>
        <RBtn size='xs' variant='outline'>
          View invoices
        </RBtn>
        <RBtn size='xs' variant='ghost'>
          Export
        </RBtn>
      </>
    ),
    accentColor: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)',
  },
  {
    id: 'customers',
    label: 'Active customers',
    value: '5,430',
    description:
      'Customer accounts with at least one purchase in the last 30 days.',
    trend: {
      value: '3.7%',
      direction: 'up' as const,
      label: 'New signups this week',
    },
    icon: <Users className='size-5 text-primary' />,
    footer: 'The churn rate decreased by 1.2% compared to last month.',
  },
  {
    id: 'uptime',
    label: 'Service uptime',
    value: '99.98%',
    description: 'Aggregate uptime across critical services.',
    trend: {
      value: '0.02%',
      direction: 'up' as const,
      label: 'Improvement over 30-day baseline',
    },
    icon: <Zap className='size-5 text-primary' />,
  },
  {
    id: 'expansion',
    label: 'Expansion ARR',
    value: '$24,500',
    description:
      'Additional recurring revenue generated from existing customers.',
    trend: {
      value: '4.5%',
      direction: 'down' as const,
      label: 'Due to seasonal contraction',
    },
    icon: <ArrowUpRight className='size-5 text-primary' />,
  },
];

const meta: Meta<typeof RStatisticDashboard> = {
  title: 'Base/RStatisticDashboard',
  component: RStatisticDashboard,
  tags: ['autodocs'],
  args: {
    metrics,
    columns: 3,
    minimal: false,
  },
  argTypes: {
    columns: {
      control: 'inline-radio',
      options: [1, 2, 3, 4],
    },
    minimal: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RStatisticDashboard>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    minimal: true,
    columns: 2,
  },
};

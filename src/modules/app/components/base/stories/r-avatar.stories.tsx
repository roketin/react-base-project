import type { Meta, StoryObj } from '@storybook/react-vite';
import RAvatar from '../r-avatar';
import { Badge } from '@/modules/app/components/ui/badge';

const meta: Meta<typeof RAvatar> = {
  title: 'Base/RAvatar',
  component: RAvatar,
  tags: ['autodocs'],
  args: {
    name: 'Alex Johnson',
    size: 'md',
    gradient: true,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'rounded', 'square'],
    },
    presence: {
      control: 'inline-radio',
      options: ['online', 'offline', 'busy', 'away', undefined],
    },
  },
};

export default meta;

type Story = StoryObj<typeof RAvatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/160?img=35',
    alt: 'Leslie Alexander',
    name: 'Leslie Alexander',
    presence: 'online',
  },
};

export const WithBadge: Story = {
  args: {
    name: 'Marketing team',
    size: 'lg',
    badge: (
      <Badge
        variant='secondary'
        className='rounded-full px-1.5 py-0 text-[10px]'
      >
        NEW
      </Badge>
    ),
  },
};

export const Group: Story = {
  render: () => (
    <div className='flex items-center -space-x-2'>
      <RAvatar
        size='sm'
        name='Arlene Mccoy'
        src='https://i.pravatar.cc/160?img=21'
      />
      <RAvatar
        size='sm'
        name='Ralph Edwards'
        src='https://i.pravatar.cc/160?img=26'
      />
      <RAvatar size='sm' name='Courtney Henry' />
      <RAvatar
        size='sm'
        name='Design Guild'
        fallback={
          <span className='rounded-full bg-primary px-2 py-1 text-xs text-white'>
            +4
          </span>
        }
      />
    </div>
  ),
};

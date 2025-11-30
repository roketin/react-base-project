import type { Meta, StoryObj } from '@storybook/react-vite';
import { RBadge } from '../r-badge';
import { useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const meta = {
  title: 'Components/Data Display/RBadge',
  component: RBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <RBadge variant='default'>Default</RBadge>
      <RBadge variant='secondary'>Secondary</RBadge>
      <RBadge variant='destructive'>Destructive</RBadge>
      <RBadge variant='outline'>Outline</RBadge>
      <RBadge variant='success'>Success</RBadge>
      <RBadge variant='warning'>Warning</RBadge>
      <RBadge variant='info'>Info</RBadge>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <RBadge variant='soft-default'>Default</RBadge>
      <RBadge variant='soft-secondary'>Secondary</RBadge>
      <RBadge variant='soft-destructive'>Destructive</RBadge>
      <RBadge variant='soft-success'>Success</RBadge>
      <RBadge variant='soft-warning'>Warning</RBadge>
      <RBadge variant='soft-info'>Info</RBadge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <RBadge size='sm'>Small</RBadge>
      <RBadge size='default'>Default</RBadge>
      <RBadge size='lg'>Large</RBadge>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <RBadge dot variant='default'>
        Active
      </RBadge>
      <RBadge dot variant='success'>
        Online
      </RBadge>
      <RBadge dot variant='warning'>
        Pending
      </RBadge>
      <RBadge dot variant='destructive'>
        Offline
      </RBadge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <RBadge variant='success'>
        <Check className='h-3 w-3' />
        Verified
      </RBadge>
      <RBadge variant='destructive'>
        <X className='h-3 w-3' />
        Failed
      </RBadge>
      <RBadge variant='warning'>
        <AlertCircle className='h-3 w-3' />
        Warning
      </RBadge>
      <RBadge variant='info'>
        <Info className='h-3 w-3' />
        Info
      </RBadge>
    </div>
  ),
};

export const Removable: Story = {
  render: () => {
    const [badges, setBadges] = useState([
      { id: 1, label: 'React' },
      { id: 2, label: 'TypeScript' },
      { id: 3, label: 'Tailwind' },
    ]);

    return (
      <div className='flex flex-wrap gap-2'>
        {badges.map((badge) => (
          <RBadge
            key={badge.id}
            variant='soft-default'
            removable
            onRemove={() => setBadges(badges.filter((b) => b.id !== badge.id))}
          >
            {badge.label}
          </RBadge>
        ))}
      </div>
    );
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>Order Status:</span>
        <RBadge variant='soft-warning' dot>
          Pending
        </RBadge>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>Payment Status:</span>
        <RBadge variant='soft-success' dot>
          Paid
        </RBadge>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>Delivery Status:</span>
        <RBadge variant='soft-info' dot>
          In Transit
        </RBadge>
      </div>
    </div>
  ),
};

export const CountBadges: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <div className='relative'>
        <button className='px-4 py-2 bg-slate-100 rounded-md'>Messages</button>
        <RBadge
          variant='destructive'
          size='sm'
          className='absolute -top-2 -right-2'
        >
          5
        </RBadge>
      </div>
      <div className='relative'>
        <button className='px-4 py-2 bg-slate-100 rounded-md'>
          Notifications
        </button>
        <RBadge
          variant='destructive'
          size='sm'
          className='absolute -top-2 -right-2'
        >
          12
        </RBadge>
      </div>
      <div className='relative'>
        <button className='px-4 py-2 bg-slate-100 rounded-md'>Cart</button>
        <RBadge
          variant='destructive'
          size='sm'
          className='absolute -top-2 -right-2'
        >
          3
        </RBadge>
      </div>
    </div>
  ),
};

export const TagList: Story = {
  render: () => {
    const [tags, setTags] = useState([
      'JavaScript',
      'React',
      'TypeScript',
      'Node.js',
      'Tailwind CSS',
      'Next.js',
    ]);

    return (
      <div className='space-y-3 w-96'>
        <h3 className='text-sm font-semibold'>Skills</h3>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <RBadge
              key={tag}
              variant='soft-default'
              removable
              onRemove={() => setTags(tags.filter((t) => t !== tag))}
            >
              {tag}
            </RBadge>
          ))}
        </div>
      </div>
    );
  },
};

export const CategoryBadges: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='text-sm font-semibold'>Article Categories</h3>
        <div className='flex flex-wrap gap-2'>
          <RBadge variant='soft-info'>Technology</RBadge>
          <RBadge variant='soft-success'>Tutorial</RBadge>
          <RBadge variant='soft-warning'>Featured</RBadge>
        </div>
      </div>
      <div className='space-y-2'>
        <h3 className='text-sm font-semibold'>Product Tags</h3>
        <div className='flex flex-wrap gap-2'>
          <RBadge variant='outline'>New</RBadge>
          <RBadge variant='outline'>Sale</RBadge>
          <RBadge variant='outline'>Limited</RBadge>
        </div>
      </div>
    </div>
  ),
};

export const AllSizesAllVariants: Story = {
  render: () => (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Small</h3>
        <div className='flex flex-wrap gap-2'>
          <RBadge size='sm' variant='default'>
            Default
          </RBadge>
          <RBadge size='sm' variant='secondary'>
            Secondary
          </RBadge>
          <RBadge size='sm' variant='success'>
            Success
          </RBadge>
          <RBadge size='sm' variant='warning'>
            Warning
          </RBadge>
          <RBadge size='sm' variant='destructive'>
            Destructive
          </RBadge>
        </div>
      </div>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Default</h3>
        <div className='flex flex-wrap gap-2'>
          <RBadge variant='default'>Default</RBadge>
          <RBadge variant='secondary'>Secondary</RBadge>
          <RBadge variant='success'>Success</RBadge>
          <RBadge variant='warning'>Warning</RBadge>
          <RBadge variant='destructive'>Destructive</RBadge>
        </div>
      </div>
      <div>
        <h3 className='text-sm font-semibold mb-2'>Large</h3>
        <div className='flex flex-wrap gap-2'>
          <RBadge size='lg' variant='default'>
            Default
          </RBadge>
          <RBadge size='lg' variant='secondary'>
            Secondary
          </RBadge>
          <RBadge size='lg' variant='success'>
            Success
          </RBadge>
          <RBadge size='lg' variant='warning'>
            Warning
          </RBadge>
          <RBadge size='lg' variant='destructive'>
            Destructive
          </RBadge>
        </div>
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { RHoverCard } from '../r-hover-card';
import { RAvatar } from '../r-avatar';
import { RBadge } from '../r-badge';
import { CalendarDays, MapPin, Link as LinkIcon, Users } from 'lucide-react';

const meta: Meta<typeof RHoverCard> = {
  title: 'Components/Overlay/RHoverCard',
  component: RHoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RHoverCard>;

export const Default: Story = {
  render: () => (
    <RHoverCard
      content={
        <div className='space-y-2'>
          <h4 className='text-sm font-semibold'>@johndoe</h4>
          <p className='text-sm text-muted-foreground'>
            Software engineer passionate about building great products.
          </p>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <CalendarDays className='h-3 w-3' />
            Joined December 2021
          </div>
        </div>
      }
    >
      <span className='cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline'>
        @johndoe
      </span>
    </RHoverCard>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <RHoverCard
      openDelay={100}
      content={
        <div className='flex gap-4'>
          <RAvatar name='Sarah Wilson' size='lg' />
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>Sarah Wilson</h4>
            <p className='text-xs text-muted-foreground'>Product Designer</p>
            <div className='flex items-center gap-4 pt-2'>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Users className='h-3 w-3' />
                <span>1.2k followers</span>
              </div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <MapPin className='h-3 w-3' />
                <span>San Francisco</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className='flex items-center gap-2 cursor-pointer'>
        <RAvatar name='Sarah Wilson' size='sm' />
        <span className='text-sm font-medium'>Sarah Wilson</span>
      </div>
    </RHoverCard>
  ),
};

export const LinkPreview: Story = {
  render: () => (
    <p className='max-w-md text-sm text-muted-foreground'>
      Check out this amazing article about{' '}
      <RHoverCard
        side='top'
        content={
          <div className='space-y-2'>
            <div className='aspect-video w-full overflow-hidden rounded-md bg-muted'>
              <img
                src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
                alt='Code'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>Modern Web Development</h4>
              <p className='text-xs text-muted-foreground line-clamp-2'>
                Learn the latest techniques and best practices for building
                modern web applications.
              </p>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <LinkIcon className='h-3 w-3' />
                example.com
              </div>
            </div>
          </div>
        }
      >
        <a href='#' className='text-primary underline-offset-4 hover:underline'>
          modern web development
        </a>
      </RHoverCard>{' '}
      that I found really helpful.
    </p>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <div className='flex gap-4'>
      {[
        {
          name: 'Pro Plan',
          price: '$29/mo',
          features: ['Unlimited projects', 'Priority support'],
        },
        {
          name: 'Team Plan',
          price: '$99/mo',
          features: ['Everything in Pro', 'Team collaboration'],
        },
      ].map((plan) => (
        <RHoverCard
          key={plan.name}
          side='right'
          content={
            <div className='space-y-3'>
              <div>
                <h4 className='font-semibold'>{plan.name}</h4>
                <p className='text-2xl font-bold text-primary'>{plan.price}</p>
              </div>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-2'>
                    <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <div className='cursor-pointer rounded-lg border p-4 hover:border-primary transition-colors'>
            <h3 className='font-medium'>{plan.name}</h3>
            <p className='text-sm text-muted-foreground'>{plan.price}</p>
          </div>
        </RHoverCard>
      ))}
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-8'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <RHoverCard
          key={side}
          side={side}
          content={
            <p className='text-sm'>
              This hover card appears on the <strong>{side}</strong> side.
            </p>
          }
        >
          <div className='flex h-20 w-32 items-center justify-center rounded-lg border cursor-pointer hover:bg-muted'>
            {side}
          </div>
        </RHoverCard>
      ))}
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <RHoverCard
      content={
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <RAvatar name='React' size='md' />
            <div>
              <h4 className='font-semibold'>React</h4>
              <p className='text-xs text-muted-foreground'>
                JavaScript Library
              </p>
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>
            A JavaScript library for building user interfaces.
          </p>
          <div className='flex flex-wrap gap-1'>
            <RBadge variant='secondary' size='sm'>
              UI
            </RBadge>
            <RBadge variant='secondary' size='sm'>
              Frontend
            </RBadge>
            <RBadge variant='secondary' size='sm'>
              JavaScript
            </RBadge>
          </div>
        </div>
      }
    >
      <RBadge className='cursor-pointer'>React</RBadge>
    </RHoverCard>
  ),
};

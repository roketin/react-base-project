import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RFloatButton,
  RFloatButtonGroup,
  RFloatButtonMenu,
} from '../r-float-button';
import {
  Plus,
  MessageCircle,
  Phone,
  Mail,
  ArrowUp,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Buttons/RFloatButton',
  component: RFloatButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RFloatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8'>
        <h2 className='text-2xl font-bold mb-4'>
          Scroll down to see the float button
        </h2>
        <p className='text-muted-foreground'>
          The float button is positioned at the bottom-right corner of the
          screen.
        </p>
      </div>
      <RFloatButton icon={<Plus />} tooltip='Add new item' />
    </div>
  ),
  args: {},
};

export const Variants: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button Variants</h2>
        <p className='text-muted-foreground'>Different style variants</p>
      </div>

      <RFloatButton icon={<Plus />} position='bottom-right' tooltip='Default' />

      <RFloatButton
        icon={<MessageCircle />}
        variant='secondary'
        position='bottom-right'
        style={{ right: '5.5rem' }}
        tooltip='Secondary'
      />

      <RFloatButton
        icon={<Phone />}
        variant='outline'
        position='bottom-right'
        style={{ right: '10rem' }}
        tooltip='Outline'
      />

      <RFloatButton
        icon={<Mail />}
        variant='ghost'
        position='bottom-right'
        style={{ right: '14.5rem' }}
        tooltip='Ghost'
      />
    </div>
  ),
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button Sizes</h2>
        <p className='text-muted-foreground'>Small, default, and large sizes</p>
      </div>

      <RFloatButton
        icon={<Plus />}
        size='sm'
        position='bottom-right'
        tooltip='Small'
      />

      <RFloatButton
        icon={<Plus />}
        size='default'
        position='bottom-right'
        style={{ right: '4rem' }}
        tooltip='Default'
      />

      <RFloatButton
        icon={<Plus />}
        size='lg'
        position='bottom-right'
        style={{ right: '8.5rem' }}
        tooltip='Large'
      />
    </div>
  ),
  args: {},
};

export const Positions: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button Positions</h2>
        <p className='text-muted-foreground'>Positioned at all four corners</p>
      </div>

      <RFloatButton
        icon={<Plus />}
        position='bottom-right'
        tooltip='Bottom Right'
      />

      <RFloatButton
        icon={<MessageCircle />}
        position='bottom-left'
        tooltip='Bottom Left'
      />

      <RFloatButton icon={<Phone />} position='top-right' tooltip='Top Right' />

      <RFloatButton icon={<Mail />} position='top-left' tooltip='Top Left' />
    </div>
  ),
  args: {},
};

export const WithBadge: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button with Badge</h2>
        <p className='text-muted-foreground'>Shows notification count</p>
      </div>

      <RFloatButton
        icon={<MessageCircle />}
        badge='5'
        tooltip='5 new messages'
      />

      <RFloatButton
        icon={<Mail />}
        badge='99+'
        position='bottom-right'
        style={{ right: '5.5rem' }}
        tooltip='99+ unread emails'
      />
    </div>
  ),
  args: {},
};

export const Animations: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button Animations</h2>
        <p className='text-muted-foreground'>Different animation effects</p>
      </div>

      <RFloatButton
        icon={<Plus />}
        animation='pulse'
        position='bottom-right'
        tooltip='Pulse animation'
      />

      <RFloatButton
        icon={<MessageCircle />}
        animation='bounce'
        position='bottom-right'
        style={{ right: '5.5rem' }}
        tooltip='Bounce animation'
      />

      <RFloatButton
        icon={<Settings />}
        animation='spin'
        position='bottom-right'
        style={{ right: '10rem' }}
        tooltip='Spin animation'
      />
    </div>
  ),
  args: {},
};

export const ButtonGroup: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Button Group</h2>
        <p className='text-muted-foreground'>
          Multiple buttons grouped together
        </p>
      </div>

      <RFloatButtonGroup position='bottom-right'>
        <RFloatButton icon={<Plus />} position='none' tooltip='Add' />
        <RFloatButton
          icon={<MessageCircle />}
          position='none'
          badge='3'
          tooltip='Messages'
        />
        <RFloatButton icon={<Phone />} position='none' tooltip='Call' />
        <RFloatButton icon={<Mail />} position='none' tooltip='Email' />
      </RFloatButtonGroup>
    </div>
  ),
  args: {},
};

export const HorizontalGroup: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Horizontal Float Button Group</h2>
        <p className='text-muted-foreground'>Buttons arranged horizontally</p>
      </div>

      <RFloatButtonGroup position='bottom-right' direction='horizontal'>
        <RFloatButton icon={<Plus />} position='none' tooltip='Add' />
        <RFloatButton
          icon={<MessageCircle />}
          position='none'
          badge='3'
          tooltip='Messages'
        />
        <RFloatButton icon={<Phone />} position='none' tooltip='Call' />
      </RFloatButtonGroup>
    </div>
  ),
  args: {},
};

export const ScrollToTop: Story = {
  render: () => {
    const [showButton, setShowButton] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      setShowButton(target.scrollTop > 300);
    };

    const scrollToTop = () => {
      document.getElementById('scroll-container')?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    return (
      <div
        id='scroll-container'
        className='h-screen overflow-auto relative'
        onScroll={handleScroll}
      >
        <div className='p-8 space-y-4'>
          <h2 className='text-2xl font-bold'>Scroll to Top Button</h2>
          <p className='text-muted-foreground'>
            Scroll down to see the button appear
          </p>

          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className='text-muted-foreground'>
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit.
            </p>
          ))}
        </div>

        {showButton && (
          <RFloatButton
            icon={<ArrowUp />}
            onClick={scrollToTop}
            tooltip='Scroll to top'
            className='transition-opacity duration-300'
          />
        )}
      </div>
    );
  },
  args: {},
};

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <div className='h-screen relative'>
        <div className='p-8 space-y-4'>
          <h2 className='text-2xl font-bold'>Interactive Float Button</h2>
          <p className='text-muted-foreground'>
            Click the button to increment counter
          </p>
          <div className='text-4xl font-bold text-primary'>{count}</div>
        </div>

        <RFloatButton
          icon={<Plus />}
          onClick={() => setCount((c) => c + 1)}
          badge={count > 0 ? count : undefined}
          tooltip='Click to increment'
        />
      </div>
    );
  },
  args: {},
};

export const FloatMenu: Story = {
  render: () => (
    <div className='h-screen relative'>
      <div className='p-8 space-y-4'>
        <h2 className='text-2xl font-bold'>Float Menu</h2>
        <p className='text-muted-foreground'>
          Click the main button to expand/collapse menu upward
        </p>
      </div>

      <RFloatButtonMenu
        mainButton={
          <RFloatButton icon={<Plus />} position='none' tooltip='Menu' />
        }
        position='bottom-right'
      >
        <RFloatButton
          icon={<MessageCircle />}
          size='sm'
          position='none'
          variant='secondary'
          tooltip='Messages'
        />
        <RFloatButton
          icon={<Phone />}
          size='sm'
          position='none'
          variant='secondary'
          tooltip='Call'
        />
        <RFloatButton
          icon={<Mail />}
          size='sm'
          position='none'
          variant='secondary'
          tooltip='Email'
        />
        <RFloatButton
          icon={<Settings />}
          size='sm'
          position='none'
          variant='secondary'
          tooltip='Settings'
        />
      </RFloatButtonMenu>
    </div>
  ),
  args: {},
};

export const FloatMenuControlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='h-screen relative'>
        <div className='p-8 space-y-4'>
          <h2 className='text-2xl font-bold'>Controlled Float Menu</h2>
          <p className='text-muted-foreground'>
            Menu state controlled externally. Click outside or press Escape to
            close.
          </p>
          <p className='text-sm'>
            Menu is: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
          </p>
          <button
            className='px-4 py-2 bg-primary text-primary-foreground rounded'
            onClick={() => setIsOpen(!isOpen)}
          >
            Toggle Menu
          </button>
        </div>

        <RFloatButtonMenu
          mainButton={
            <RFloatButton icon={<Plus />} position='none' tooltip='Menu' />
          }
          position='bottom-right'
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <RFloatButton
            icon={<MessageCircle />}
            size='sm'
            position='none'
            variant='secondary'
            tooltip='Messages'
          />
          <RFloatButton
            icon={<Phone />}
            size='sm'
            position='none'
            variant='secondary'
            tooltip='Call'
          />
          <RFloatButton
            icon={<Mail />}
            size='sm'
            position='none'
            variant='secondary'
            tooltip='Email'
          />
        </RFloatButtonMenu>
      </div>
    );
  },
  args: {},
};

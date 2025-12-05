import type { Meta, StoryObj } from '@storybook/react-vite';
import { RButtonGroup, RButtonGroupItem } from '../r-button-group';
import { useState } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';

const meta = {
  title: 'Components/Buttons/RButtonGroup',
  component: RButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RButtonGroup>
      <RButtonGroupItem>Left</RButtonGroupItem>
      <RButtonGroupItem>Center</RButtonGroupItem>
      <RButtonGroupItem>Right</RButtonGroupItem>
    </RButtonGroup>
  ),
  args: {},
};

export const WithActive: Story = {
  render: () => {
    const [active, setActive] = useState('center');

    return (
      <RButtonGroup>
        <RButtonGroupItem
          active={active === 'left'}
          onClick={() => setActive('left')}
        >
          Left
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'center'}
          onClick={() => setActive('center')}
        >
          Center
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'right'}
          onClick={() => setActive('right')}
        >
          Right
        </RButtonGroupItem>
      </RButtonGroup>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [align, setAlign] = useState('left');

    return (
      <RButtonGroup>
        <RButtonGroupItem
          active={align === 'left'}
          onClick={() => setAlign('left')}
        >
          <AlignLeft className='h-4 w-4' />
        </RButtonGroupItem>
        <RButtonGroupItem
          active={align === 'center'}
          onClick={() => setAlign('center')}
        >
          <AlignCenter className='h-4 w-4' />
        </RButtonGroupItem>
        <RButtonGroupItem
          active={align === 'right'}
          onClick={() => setAlign('right')}
        >
          <AlignRight className='h-4 w-4' />
        </RButtonGroupItem>
      </RButtonGroup>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [active, setActive] = useState('option1');

    return (
      <RButtonGroup orientation='vertical'>
        <RButtonGroupItem
          active={active === 'option1'}
          onClick={() => setActive('option1')}
        >
          Option 1
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'option2'}
          onClick={() => setActive('option2')}
        >
          Option 2
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'option3'}
          onClick={() => setActive('option3')}
        >
          Option 3
        </RButtonGroupItem>
      </RButtonGroup>
    );
  },
};

export const Detached: Story = {
  render: () => {
    const [active, setActive] = useState('option1');

    return (
      <RButtonGroup attached={false}>
        <RButtonGroupItem
          active={active === 'option1'}
          onClick={() => setActive('option1')}
        >
          Option 1
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'option2'}
          onClick={() => setActive('option2')}
        >
          Option 2
        </RButtonGroupItem>
        <RButtonGroupItem
          active={active === 'option3'}
          onClick={() => setActive('option3')}
        >
          Option 3
        </RButtonGroupItem>
      </RButtonGroup>
    );
  },
};

export const TextFormatting: Story = {
  render: () => {
    const [formats, setFormats] = useState<string[]>([]);

    const toggleFormat = (format: string) => {
      setFormats((prev) =>
        prev.includes(format)
          ? prev.filter((f) => f !== format)
          : [...prev, format],
      );
    };

    return (
      <RButtonGroup>
        <RButtonGroupItem
          active={formats.includes('bold')}
          onClick={() => toggleFormat('bold')}
        >
          <Bold className='h-4 w-4' />
        </RButtonGroupItem>
        <RButtonGroupItem
          active={formats.includes('italic')}
          onClick={() => toggleFormat('italic')}
        >
          <Italic className='h-4 w-4' />
        </RButtonGroupItem>
        <RButtonGroupItem
          active={formats.includes('underline')}
          onClick={() => toggleFormat('underline')}
        >
          <Underline className='h-4 w-4' />
        </RButtonGroupItem>
      </RButtonGroup>
    );
  },
};

export const WithDisabled: Story = {
  render: () => (
    <RButtonGroup>
      <RButtonGroupItem>Active</RButtonGroupItem>
      <RButtonGroupItem disabled>Disabled</RButtonGroupItem>
      <RButtonGroupItem>Active</RButtonGroupItem>
    </RButtonGroup>
  ),
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Extra Small (xs)</p>
        <RButtonGroup>
          <RButtonGroupItem size='xs'>Left</RButtonGroupItem>
          <RButtonGroupItem size='xs'>Center</RButtonGroupItem>
          <RButtonGroupItem size='xs'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Small (sm)</p>
        <RButtonGroup>
          <RButtonGroupItem size='sm'>Left</RButtonGroupItem>
          <RButtonGroupItem size='sm'>Center</RButtonGroupItem>
          <RButtonGroupItem size='sm'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Default</p>
        <RButtonGroup>
          <RButtonGroupItem size='default'>Left</RButtonGroupItem>
          <RButtonGroupItem size='default'>Center</RButtonGroupItem>
          <RButtonGroupItem size='default'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Large (lg)</p>
        <RButtonGroup>
          <RButtonGroupItem size='lg'>Left</RButtonGroupItem>
          <RButtonGroupItem size='lg'>Center</RButtonGroupItem>
          <RButtonGroupItem size='lg'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Default</p>
        <RButtonGroup>
          <RButtonGroupItem variant='default'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='default'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='default'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Outline</p>
        <RButtonGroup>
          <RButtonGroupItem variant='outline'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='outline'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='outline'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Secondary</p>
        <RButtonGroup>
          <RButtonGroupItem variant='secondary'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='secondary'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='secondary'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Ghost</p>
        <RButtonGroup>
          <RButtonGroupItem variant='ghost'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='ghost'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='ghost'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Destructive</p>
        <RButtonGroup>
          <RButtonGroupItem variant='destructive'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='destructive'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='destructive'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Info</p>
        <RButtonGroup>
          <RButtonGroupItem variant='info'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='info'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='info'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Success</p>
        <RButtonGroup>
          <RButtonGroupItem variant='success'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='success'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='success'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Warning</p>
        <RButtonGroup>
          <RButtonGroupItem variant='warning'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='warning'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='warning'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Error</p>
        <RButtonGroup>
          <RButtonGroupItem variant='error'>Left</RButtonGroupItem>
          <RButtonGroupItem variant='error'>Center</RButtonGroupItem>
          <RButtonGroupItem variant='error'>Right</RButtonGroupItem>
        </RButtonGroup>
      </div>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Soft Default</p>
        <RButtonGroup>
          <RButtonGroupItem variant='default' soft>
            Left
          </RButtonGroupItem>
          <RButtonGroupItem variant='default' soft>
            Center
          </RButtonGroupItem>
          <RButtonGroupItem variant='default' soft>
            Right
          </RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Soft Info</p>
        <RButtonGroup>
          <RButtonGroupItem variant='info' soft>
            Left
          </RButtonGroupItem>
          <RButtonGroupItem variant='info' soft>
            Center
          </RButtonGroupItem>
          <RButtonGroupItem variant='info' soft>
            Right
          </RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Soft Success</p>
        <RButtonGroup>
          <RButtonGroupItem variant='success' soft>
            Left
          </RButtonGroupItem>
          <RButtonGroupItem variant='success' soft>
            Center
          </RButtonGroupItem>
          <RButtonGroupItem variant='success' soft>
            Right
          </RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Soft Warning</p>
        <RButtonGroup>
          <RButtonGroupItem variant='warning' soft>
            Left
          </RButtonGroupItem>
          <RButtonGroupItem variant='warning' soft>
            Center
          </RButtonGroupItem>
          <RButtonGroupItem variant='warning' soft>
            Right
          </RButtonGroupItem>
        </RButtonGroup>
      </div>
      <div>
        <p className='mb-2 text-sm text-muted-foreground'>Soft Error</p>
        <RButtonGroup>
          <RButtonGroupItem variant='error' soft>
            Left
          </RButtonGroupItem>
          <RButtonGroupItem variant='error' soft>
            Center
          </RButtonGroupItem>
          <RButtonGroupItem variant='error' soft>
            Right
          </RButtonGroupItem>
        </RButtonGroup>
      </div>
    </div>
  ),
};

export const MixedVariantsWithActive: Story = {
  render: () => {
    const [active, setActive] = useState('center');

    return (
      <div className='flex flex-col gap-4'>
        <div>
          <p className='mb-2 text-sm text-muted-foreground'>
            Outline with Active State
          </p>
          <RButtonGroup>
            <RButtonGroupItem
              variant='outline'
              active={active === 'left'}
              onClick={() => setActive('left')}
            >
              Left
            </RButtonGroupItem>
            <RButtonGroupItem
              variant='outline'
              active={active === 'center'}
              onClick={() => setActive('center')}
            >
              Center
            </RButtonGroupItem>
            <RButtonGroupItem
              variant='outline'
              active={active === 'right'}
              onClick={() => setActive('right')}
            >
              Right
            </RButtonGroupItem>
          </RButtonGroup>
        </div>
        <div>
          <p className='mb-2 text-sm text-muted-foreground'>
            Ghost with Active State
          </p>
          <RButtonGroup>
            <RButtonGroupItem
              variant='ghost'
              active={active === 'left'}
              onClick={() => setActive('left')}
            >
              Left
            </RButtonGroupItem>
            <RButtonGroupItem
              variant='ghost'
              active={active === 'center'}
              onClick={() => setActive('center')}
            >
              Center
            </RButtonGroupItem>
            <RButtonGroupItem
              variant='ghost'
              active={active === 'right'}
              onClick={() => setActive('right')}
            >
              Right
            </RButtonGroupItem>
          </RButtonGroup>
        </div>
      </div>
    );
  },
};

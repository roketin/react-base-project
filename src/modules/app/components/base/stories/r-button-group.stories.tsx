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

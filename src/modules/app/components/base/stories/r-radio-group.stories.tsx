import type { Meta, StoryObj } from '@storybook/react-vite';
import { RRadioGroup, RRadio } from '../r-radio-group';
import { useState } from 'react';

const meta = {
  title: 'Components/Form Controls/RRadioGroup',
  component: RRadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'default',
    children: (
      <>
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
        <RRadio value='option3' label='Option 3' />
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    name: 'with-label',
    label: 'Choose an option',
    children: (
      <>
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
        <RRadio value='option3' label='Option 3' />
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    name: 'default-value',
    label: 'Select your preference',
    defaultValue: 'option2',
    children: (
      <>
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
        <RRadio value='option3' label='Option 3' />
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    name: 'with-error',
    label: 'Required field',
    error: 'Please select an option',
    children: (
      <>
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    name: 'with-helper',
    label: 'Subscription plan',
    helperText: 'You can change this later in settings',
    children: (
      <>
        <RRadio value='free' label='Free' />
        <RRadio value='pro' label='Pro' />
        <RRadio value='enterprise' label='Enterprise' />
      </>
    ),
  },
};

export const WithDescriptions: Story = {
  args: {
    name: 'with-descriptions',
    label: 'Choose a plan',
    children: (
      <>
        <RRadio
          value='free'
          label='Free'
          description='Perfect for personal projects'
        />
        <RRadio value='pro' label='Pro' description='Best for professionals' />
        <RRadio
          value='enterprise'
          label='Enterprise'
          description='For large organizations'
        />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    name: 'horizontal',
    label: 'Select size',
    orientation: 'horizontal',
    children: (
      <>
        <RRadio value='small' label='Small' />
        <RRadio value='medium' label='Medium' />
        <RRadio value='large' label='Large' />
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled group',
    disabled: true,
    defaultValue: 'option2',
    children: (
      <>
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
        <RRadio value='option3' label='Option 3' />
      </>
    ),
  },
};

export const DisabledItem: Story = {
  args: {
    name: 'disabled-item',
    label: 'Some options disabled',
    children: (
      <>
        <RRadio value='option1' label='Available' />
        <RRadio value='option2' label='Sold out' disabled />
        <RRadio value='option3' label='Available' />
      </>
    ),
  },
};

const InteractiveComponent = () => {
  const [value, setValue] = useState('option1');
  return (
    <div className='space-y-4'>
      <RRadioGroup
        name='interactive'
        label='Choose an option'
        value={value}
        onChange={setValue}
      >
        <RRadio value='option1' label='Option 1' />
        <RRadio value='option2' label='Option 2' />
        <RRadio value='option3' label='Option 3' />
      </RRadioGroup>
      <p className='text-sm text-slate-600'>Selected: {value}</p>
    </div>
  );
};

export const Interactive: Story = {
  args: {
    name: 'interactive',
    children: null,
  },
  render: () => <InteractiveComponent />,
};

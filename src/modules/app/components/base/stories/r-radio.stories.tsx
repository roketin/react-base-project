import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { RRadio, type TRRadioOption } from '../r-radio';

const options: TRRadioOption[] = [
  {
    label: 'Monthly Plan',
    description: 'Best for trying things out.',
    value: 'monthly',
  },
  {
    label: 'Annual Plan',
    description: 'Save 15% vs monthly billing.',
    value: 'annual',
  },
  {
    label: 'Enterprise Plan',
    description: 'Custom limits and dedicated support.',
    value: 'enterprise',
  },
];

const meta: Meta<typeof RRadio> = {
  title: 'Components/Form Controls/RRadio',
  component: RRadio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    layout: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    options,
    value: 'monthly',
    layout: 'vertical',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof RRadio>;

export const Default: Story = {};

const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value ?? null);

    return (
      <RRadio
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const Vertical: Story = {
  ...Template,
};

export const Horizontal: Story = {
  ...Template,
  args: {
    layout: 'horizontal',
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
};

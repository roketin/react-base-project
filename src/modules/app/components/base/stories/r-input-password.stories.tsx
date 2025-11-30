import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { RInputPassword } from '../r-input-password';

const meta: Meta<typeof RInputPassword> = {
  title: 'Components/Inputs/RInputPassword',
  component: RInputPassword,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    density: {
      control: 'radio',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter password',
    density: 'default',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof RInputPassword>;

const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 'demo-password');

    return (
      <RInputPassword
        {...args}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          args.onChange?.(event);
        }}
        className='w-72'
      />
    );
  },
};

export const Default: Story = {
  ...Template,
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
    value: 'cannot-edit',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { MaskitoOptions } from '@maskito/core';

import { RInputFormat } from '../r-input-format';

const phoneMask: MaskitoOptions = {
  mask: [
    '+',
    '6',
    '2',
    ' ',
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

const cardMask: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

const meta: Meta<typeof RInputFormat> = {
  title: 'Components/Inputs/RInputFormat',
  component: RInputFormat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    format: { control: false },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    density: {
      control: 'radio',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
  args: {
    placeholder: '+62 (___) ___-____',
    format: phoneMask,
  },
};

export default meta;

type Story = StoryObj<typeof RInputFormat>;
const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '');

    return (
      <RInputFormat
        {...args}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value);
          if (typeof args.onChange === 'function') {
            args.onChange(event);
          }
        }}
        className='w-64'
      />
    );
  },
};

export const PhoneNumber: Story = {
  ...Template,
};

export const CreditCard: Story = {
  ...Template,
  args: {
    placeholder: '1234 5678 9012 3456',
    format: cardMask,
  },
};

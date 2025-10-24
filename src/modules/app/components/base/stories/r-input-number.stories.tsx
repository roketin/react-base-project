import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { RInputNumber, type TRInputNumberProps } from '../r-input-number';

const meta: Meta<typeof RInputNumber> = {
  title: 'Base/Form/RInputNumber',
  component: RInputNumber,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    decimalLimit: { control: { type: 'number', min: 0, max: 6 } },
    negative: { control: 'boolean' },
    allowDecimal: { control: 'boolean' },
    hasPercentRestriction: { control: 'boolean' },
    allowExtraDecimal: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: 12500.5,
    decimalLimit: 2,
    allowDecimal: true,
    negative: false,
    allowExtraDecimal: false,
    hasPercentRestriction: false,
    placeholder: 'Enter amount',
  },
};

export default meta;

type Story = StoryObj<typeof RInputNumber>;

const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>(Number(args.value ?? 0));

    const handleChange: TRInputNumberProps['onChange'] = (nextValue) => {
      setValue(nextValue);
      args.onChange?.(nextValue);
    };

    return (
      <RInputNumber
        {...args}
        value={value}
        onChange={handleChange}
        className='w-64'
      />
    );
  },
};

export const Currency: Story = {
  ...Template,
};

export const PercentRestriction: Story = {
  ...Template,
  args: {
    value: 45,
    hasPercentRestriction: true,
    allowDecimal: true,
    decimalLimit: 1,
    placeholder: '0 - 100%',
  },
};

export const AllowNegative: Story = {
  ...Template,
  args: {
    value: -3200,
    negative: true,
  },
};

export const IntegerOnly: Story = {
  ...Template,
  args: {
    value: 42,
    allowDecimal: false,
  },
};

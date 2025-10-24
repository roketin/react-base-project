import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import RSelect from '../r-select';

type Option = {
  label: string;
  value: string;
  description?: string;
};

const options: Option[] = [
  {
    label: 'Analytics',
    value: 'analytics',
    description: 'Reports and dashboards',
  },
  { label: 'Billing', value: 'billing', description: 'Invoices and payments' },
  {
    label: 'Marketing',
    value: 'marketing',
    description: 'Campaign automation',
  },
];

const meta: Meta<typeof RSelect> = {
  title: 'Base/Form/RSelect',
  component: RSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: [undefined, 'multiple'],
    },
    allowClear: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    options,
    placeholder: 'Select module',
    allowClear: true,
    showSearch: true,
    disabled: false,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof RSelect>;

const TemplateSingle: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(
      args.value as string,
    );

    return (
      <RSelect
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next as string | undefined);
          args.onChange?.(next);
        }}
        className='w-72'
      />
    );
  },
};

export const Single: Story = {
  ...TemplateSingle,
};

const TemplateMultiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(() =>
      Array.isArray(args.value) ? (args.value as string[]) : [],
    );

    return (
      <RSelect
        {...args}
        mode='multiple'
        value={value}
        onChange={(next) => {
          const nextValues = (next ?? []) as string[];
          setValue(nextValues);
          args.onChange?.(nextValues);
        }}
        className='w-72'
      />
    );
  },
};

export const Multiple: Story = {
  ...TemplateMultiple,
  args: {
    value: ['analytics'],
  },
};

export const Loading: Story = {
  ...TemplateSingle,
  args: {
    loading: true,
    placeholder: 'Loading options…',
  },
};

export const Disabled: Story = {
  ...TemplateSingle,
  args: {
    disabled: true,
    placeholder: 'Disabled select',
  },
};

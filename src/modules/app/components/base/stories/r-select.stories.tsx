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

const longOptions: Option[] = Array.from({ length: 60 }).map((_, index) => ({
  label: `Module ${index + 1}`,
  value: `module-${index + 1}`,
  description: `Module description ${index + 1}`,
}));

export const InfiniteLoading: Story = {
  render: (args) => {
    const pageSize = 10;
    const [optionsList, setOptionsList] = useState<Option[]>(() =>
      longOptions.slice(0, pageSize),
    );
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(longOptions.length > pageSize);

    const handleLoadMore = () => {
      if (isFetching || !hasMore) {
        return;
      }

      setIsFetching(true);

      setTimeout(() => {
        setOptionsList((prev) => {
          const nextCount = Math.min(
            prev.length + pageSize,
            longOptions.length,
          );
          const nextOptions = longOptions.slice(0, nextCount);
          setHasMore(nextCount < longOptions.length);
          setIsFetching(false);
          return nextOptions;
        });
      }, 750);
    };

    return (
      <RSelect
        {...args}
        className='w-72'
        options={optionsList}
        loading={isFetching}
        infiniteScroll={{
          onLoadMore: handleLoadMore,
          isLoading: isFetching,
          hasMore,
        }}
      />
    );
  },
  args: {
    placeholder: 'Scroll to load more modules',
    allowClear: true,
    showSearch: true,
  },
};

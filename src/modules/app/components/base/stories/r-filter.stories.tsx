import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { RFilter } from '../r-filter';
import {
  filterInput,
  filterSelect,
  filterSwitch,
} from '@/modules/app/libs/filter-utils';

const items = [
  filterInput({
    id: 'search',
    label: 'Search term',
    placeholder: 'Type keyword…',
  }),
  filterSelect({
    id: 'status',
    label: 'Status',
    items: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
    ],
    placeholder: 'All statuses',
  }),
  filterSwitch({
    id: 'featured',
    label: 'Featured only',
    defaultValue: false,
  }),
];

const meta: Meta<typeof RFilter> = {
  title: 'Base/RFilter',
  component: RFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    persistKey: {
      control: 'text',
      description:
        'Storage key used to persist filters. Leave blank to disable persistence.',
    },
    onApply: { action: 'apply' },
    onReset: { action: 'reset' },
  },
  args: {
    items,
    persistKey: undefined,
  },
};

export default meta;

type Story = StoryObj<typeof RFilter>;

export const Playground: Story = {
  render: (args) => {
    const [appliedValues, setAppliedValues] = useState<Record<string, unknown>>(
      {},
    );

    return (
      <div className='w-[320px] space-y-4'>
        <RFilter
          {...args}
          onApply={(values) => {
            args.onApply?.(values);
            setAppliedValues(values);
          }}
          onReset={(values) => {
            args.onReset?.(values);
            setAppliedValues(values);
          }}
        />

        <div className='rounded-lg border bg-muted/30 p-3 text-xs'>
          <div className='mb-1 font-semibold text-muted-foreground'>
            Applied filters
          </div>
          <pre className='whitespace-pre-wrap break-all text-muted-foreground'>
            {JSON.stringify(appliedValues, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

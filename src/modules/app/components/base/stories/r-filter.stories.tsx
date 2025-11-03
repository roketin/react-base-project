import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import { RFilter } from '../r-filter';
import {
  filterInput,
  filterSelect,
  filterSwitch,
  filterCheckboxMultiple,
  filterSlider,
  filterDatepickerMultiple,
} from '@/modules/app/libs/filter-utils';
import { Badge } from '@/modules/app/components/ui/badge';
import { Separator } from '@/modules/app/components/ui/separator';

const filterItems = [
  filterInput({
    id: 'search',
    label: 'Search keyword',
    placeholder: 'e.g. invoice, campaign',
  }),
  filterSelect({
    id: 'status',
    label: 'Status',
    items: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
      { label: 'Flagged', value: 'flagged' },
    ],
    placeholder: 'All statuses',
    allowSearch: false,
    clearable: true,
  }),
  filterCheckboxMultiple({
    id: 'tags',
    label: 'Tags',
    options: [
      { label: 'Marketing', value: 'marketing' },
      { label: 'Finance', value: 'finance' },
      { label: 'Internal', value: 'internal' },
      { label: 'External', value: 'external' },
    ],
    layout: 'vertical',
  }),
  filterSlider({
    id: 'score',
    label: 'Customer score',
    defaultValue: [40, 80],
    min: 0,
    max: 100,
    step: 5,
    formatValue: ([from = 0, to = 0]) => `${from} - ${to}`,
  }),
  filterDatepickerMultiple({
    id: 'createdAt',
    label: 'Created between',
    placeholder: ['Start', 'End'],
  }),
  filterSwitch({
    id: 'featured',
    label: 'Featured only',
    description: 'Limit result to highlighted entries.',
    defaultValue: false,
  }),
];

const defaultMapKey: Record<string, string> = {
  search: 'q',
  status: 'status',
  tags: 'filters[tags]',
  score: 'score_range',
  createdAt: 'created_at',
  featured: 'is_featured',
};

function countActiveFilters(values: Record<string, unknown>) {
  return Object.values(values).reduce((count, value) => {
    if (value == null) return count;
    if (Array.isArray(value)) {
      return value.length > 0 ? count + 1 : count;
    }
    if (typeof value === 'object') {
      const hasValue = Object.values(value as Record<string, unknown>).some(
        (inner) =>
          inner !== null &&
          inner !== undefined &&
          inner !== '' &&
          inner !== false,
      );
      return hasValue ? count + 1 : count;
    }
    if (value === '' || value === false) return count;
    return count + 1;
  }, 0);
}

function toQueryString(values: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null && item !== '') {
          params.append(key, String(item));
        }
      });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(
        ([subKey, subValue]) => {
          if (subValue == null || subValue === '') return;
          params.append(`${key}.${subKey}`, String(subValue));
        },
      );
      return;
    }

    if (value === '' || value === false) return;
    params.set(key, String(value));
  });

  return params.toString();
}

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
    items: { control: false },
    mapKey: {
      control: 'object',
      description:
        'Optional key mapping object or mapper function invoked before callbacks/fire.',
    },
  },
  args: {
    items: filterItems,
    persistKey: 'storybook_rfilter_demo',
    mapKey: defaultMapKey,
  },
};

export default meta;

type Story = StoryObj<typeof RFilter>;

export const Playground: Story = {
  render: (args) => {
    const [appliedValues, setAppliedValues] = useState<Record<string, unknown>>(
      {},
    );
    const [lastAppliedAt, setLastAppliedAt] = useState<Date | null>(null);

    const activeFilters = useMemo(
      () => countActiveFilters(appliedValues),
      [appliedValues],
    );

    const queryString = useMemo(
      () => toQueryString(appliedValues),
      [appliedValues],
    );

    return (
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h3 className='text-lg font-semibold text-foreground'>
              Explore filter combinations
            </h3>
            <p className='text-sm text-muted-foreground'>
              Apply filters, observe mapped query parameters, and reset to
              defaults.
            </p>
          </div>
          <Badge variant='outline'>
            Active filters&nbsp;
            <span className='font-semibold text-foreground'>
              {activeFilters}
            </span>
          </Badge>
        </div>

        <div className='grid gap-6 md:grid-cols-[320px_1fr]'>
          <div className='space-y-2'>
            <RFilter
              {...args}
              onApply={(values) => {
                args.onApply?.(values);
                setAppliedValues(values);
                setLastAppliedAt(new Date());
              }}
              onReset={(values) => {
                args.onReset?.(values);
                setAppliedValues(values);
                setLastAppliedAt(null);
              }}
            />
            <p className='text-xs text-muted-foreground'>
              Persist key:{' '}
              <code className='rounded bg-muted px-1 py-0.5 text-[11px]'>
                {args.persistKey ?? '(auto)'}
              </code>
            </p>
            {args.mapKey ? (
              <div className='rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground'>
                <p className='mb-2 font-semibold text-foreground'>
                  Key mapping preview
                </p>
                <ul className='space-y-1'>
                  {Object.entries(
                    typeof args.mapKey === 'object'
                      ? args.mapKey
                      : defaultMapKey,
                  ).map(([source, target]) => (
                    <li key={source} className='flex justify-between gap-2'>
                      <span>{source}</span>
                      <span className='text-foreground'>{String(target)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className='rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground'>
            <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-foreground'>
              <span className='font-semibold'>Applied payload</span>
              <span className='text-xs text-muted-foreground'>
                {lastAppliedAt
                  ? `Last applied at ${lastAppliedAt.toLocaleTimeString()}`
                  : 'No filters applied yet'}
              </span>
            </div>
            <Separator className='my-3' />
            <pre className='whitespace-pre-wrap break-all rounded-md bg-background/80 p-3 text-[11px] text-muted-foreground'>
              {JSON.stringify(appliedValues, null, 2)}
            </pre>
            <Separator className='my-3' />
            <div className='space-y-1'>
              <p className='text-xs font-semibold text-foreground'>
                Query string
              </p>
              <code className='block min-h-[32px] break-all rounded bg-background/80 px-2 py-1 text-[11px] text-muted-foreground'>
                {queryString || '(empty)'}
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

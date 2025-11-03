import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { RFilterMenu, type RFilterMenuProps, RFilterBar } from '../r-filter';
import { filterItem } from '@/modules/app/libs/filter-utils';
import { Badge } from '@/modules/app/components/ui/badge';
import { Separator } from '@/modules/app/components/ui/separator';
import roketinConfig from '@config';

const baseSchema = [
  filterItem.input({
    id: 'search',
    label: 'Search keyword',
    placeholder: 'e.g. invoice, campaign',
  }),
  filterItem.select({
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
  filterItem.checkboxMultiple({
    id: 'tags',
    label: 'Tags',
    layout: 'vertical',
    options: [
      { label: 'Marketing', value: 'marketing' },
      { label: 'Finance', value: 'finance' },
      { label: 'Internal', value: 'internal' },
      { label: 'External', value: 'external' },
    ],
  }),
  filterItem.slider({
    id: 'score',
    label: 'Customer score',
    defaultValue: [40, 80],
    min: 0,
    max: 100,
    step: 5,
    formatValue: ([from = 0, to = 0]) => `${from}-${to}`,
  }),
  filterItem.datepickerRange({
    id: 'createdAt',
    label: 'Created between',
    placeholder: ['Start', 'End'],
  }),
  filterItem.switch({
    id: 'featured',
    label: 'Featured only',
    description: 'Limit result to highlighted entries.',
    defaultValue: false,
  }),
];

const defaultKeyMap: Record<string, string> = {
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

const persistenceConfig = roketinConfig.filters?.persistence;

const meta: Meta<typeof RFilterMenu> = {
  title: 'Base/RFilter',
  component: RFilterMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    schema: { control: false },
    keyMap: { control: false },
    storageKey: {
      control: 'text',
      description:
        'Storage key used to persist filters. Leave empty to use the current pathname.',
    },
    buttonText: {
      control: 'text',
      description: 'Text displayed on the popover trigger button.',
    },
    onSubmit: { action: 'submit' },
    onReset: { action: 'reset' },
  },
  args: {
    schema: baseSchema,
    keyMap: defaultKeyMap,
    storageKey: persistenceConfig?.enabled
      ? 'storybook_rfilter_menu'
      : undefined,
    buttonText: 'Filters',
  },
};

export default meta;

type Story = StoryObj<typeof RFilterMenu>;

export const MenuPlayground: Story = {
  name: 'Popover Filter Menu',
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

    const schema = args.schema ?? baseSchema;

    const handleSubmit: NonNullable<RFilterMenuProps['onSubmit']> = (
      values,
    ) => {
      args.onSubmit?.(values);
      setAppliedValues(values);
      setLastAppliedAt(new Date());
    };

    const handleReset: NonNullable<RFilterMenuProps['onReset']> = (values) => {
      args.onReset?.(values);
      setAppliedValues(values);
      setLastAppliedAt(null);
    };

    return (
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h3 className='text-lg font-semibold text-foreground'>
              Explore filter combinations
            </h3>
            <p className='text-sm text-muted-foreground'>
              Apply filters, observe mapped query parameters, and reset to
              defaults.
            </p>
            <p className='text-xs text-muted-foreground'>
              Persistence config:&nbsp;
              {persistenceConfig?.enabled ? 'enabled' : 'disabled'} • strategy{' '}
              {persistenceConfig?.strategy ?? 'local-storage'} • prefix{' '}
              {persistenceConfig?.keyPrefix ?? 'filter_'} • debounce{' '}
              {persistenceConfig?.debounceMs ?? 0}ms
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
            <RFilterMenu
              {...args}
              schema={schema}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
            <p className='text-xs text-muted-foreground'>
              Storage key:{' '}
              <code className='rounded bg-muted px-1 py-0.5 text-[11px]'>
                {args.storageKey ?? '(derived)'}
              </code>
              {persistenceConfig?.enabled === false ? (
                <span> (persistence disabled globally)</span>
              ) : (
                <span>
                  {' '}
                  (global prefix {persistenceConfig?.keyPrefix ?? 'filter_'},
                  debounce {persistenceConfig?.debounceMs ?? 0}ms)
                </span>
              )}
            </p>
            {typeof args.keyMap === 'object' ? (
              <div className='rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground'>
                <p className='mb-2 font-semibold text-foreground'>
                  Key mapping preview
                </p>
                <ul className='space-y-1'>
                  {Object.entries(args.keyMap).map(([source, target]) => (
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

export const InlineBar: Story = {
  name: 'Auto-apply Inline Bar',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => {
    const [params, setParams] = useState<Record<string, unknown>>({});

    const inlineSchema = useMemo(
      () => [
        filterItem.input({
          id: 'keyword',
          label: 'Keyword',
          placeholder: 'Search…',
        }),
        filterItem.select({
          id: 'type',
          label: 'Type',
          items: [
            { label: 'All', value: '' },
            { label: 'Campaign', value: 'campaign' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Lead', value: 'lead' },
          ],
          placeholder: 'All types',
        }),
        filterItem.switch({
          id: 'isActive',
          label: 'Active only',
          defaultValue: true,
        }),
        filterItem.datepicker({
          id: 'since',
          label: 'Updated since',
        }),
      ],
      [],
    );

    const activeInline = useMemo(() => countActiveFilters(params), [params]);

    return (
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h3 className='text-lg font-semibold text-foreground'>
              Inline auto-applying filter bar
            </h3>
            <p className='text-sm text-muted-foreground'>
              Values emit automatically after each change. Persistence and key
              mapping behaviour mirrors the menu variant.
            </p>
            <p className='text-xs text-muted-foreground'>
              Persistence config:&nbsp;
              {persistenceConfig?.enabled ? 'enabled' : 'disabled'} • strategy{' '}
              {persistenceConfig?.strategy ?? 'local-storage'} • prefix{' '}
              {persistenceConfig?.keyPrefix ?? 'filter_'} • debounce{' '}
              {persistenceConfig?.debounceMs ?? 0}ms
            </p>
          </div>
          <Badge variant='outline'>
            Active filters&nbsp;
            <span className='font-semibold text-foreground'>
              {activeInline}
            </span>
          </Badge>
        </div>

        <RFilterBar
          schema={inlineSchema}
          storageKey={
            persistenceConfig?.enabled ? 'storybook_rfilter_bar' : undefined
          }
          keyMap={{
            keyword: 'q',
            type: 'type',
            isActive: 'is_active',
            since: 'updated_since',
          }}
          onChange={(values) => setParams(values)}
          columns={4}
        />
        <p className='text-xs text-muted-foreground'>
          Storage key:{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-[11px]'>
            {persistenceConfig?.enabled
              ? 'storybook_rfilter_bar'
              : '(disabled)'}
          </code>{' '}
          {persistenceConfig?.enabled
            ? `(global prefix ${persistenceConfig?.keyPrefix ?? 'filter_'}, debounce ${persistenceConfig?.debounceMs ?? 0}ms)`
            : '(persistence disabled globally)'}
        </p>

        <div className='rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground'>
          <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-foreground'>
            <span className='font-semibold'>Live payload</span>
          </div>
          <Separator className='my-3' />
          <pre className='whitespace-pre-wrap break-all rounded-md bg-background/80 p-3 text-[11px] text-muted-foreground'>
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

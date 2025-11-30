import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { RDataTable, type TRDataTableSelected } from '../r-data-table';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Editor' | 'Viewer';
};

const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ getValue }) => (
      <span className='font-medium text-foreground'>{getValue<string>()}</span>
    ),
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: ({ getValue }) => (
      <span className='inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary'>
        {getValue<string>()}
      </span>
    ),
  },
];

const data: User[] = [
  { id: 1, name: 'Alice Fox', email: 'alice@demo.com', role: 'Owner' },
  { id: 2, name: 'Ben Stone', email: 'ben@demo.com', role: 'Editor' },
  { id: 3, name: 'Chloe Li', email: 'chloe@demo.com', role: 'Viewer' },
  { id: 4, name: 'Diego Alvarez', email: 'diego@demo.com', role: 'Editor' },
];

const sampleMeta = {
  total: data.length,
  per_page: data.length,
  current_page: 1,
  last_page: 1,
  from: 1,
  to: data.length,
};

const meta: Meta<typeof RDataTable<User, unknown>> = {
  title: 'Components/Data Display/RDataTable',
  component: RDataTable<User, unknown>,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    pagination: { control: 'boolean' },
    allowSearch: { control: 'boolean' },
    loading: { control: 'boolean' },
    fixed: { control: 'boolean' },
    onChange: { action: 'queryChanged' },
    onChangeSelected: { action: 'selectionChanged' },
  },
  args: {
    columns,
    data,
    pagination: true,
    allowSearch: true,
    loading: false,
    meta: sampleMeta,
    searchPlaceholder: 'Search users…',
  },
};

export default meta;

type Story = StoryObj<typeof RDataTable<User, unknown>>;

export const Playground: Story = {
  render: (args) => {
    const {
      onChange: onQueryChange,
      onChangeSelected: onSelectionChange,
      ...tableArgs
    } = args;
    const [selection, setSelection] = useState<TRDataTableSelected>({});
    const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});

    const handleChange = useCallback(
      (params: Record<string, unknown>) => {
        onQueryChange?.(params);
        setQueryParams(params);
      },
      [onQueryChange],
    );

    const handleSelectionChange = useCallback(
      (next: TRDataTableSelected) => {
        onSelectionChange?.(next);
        setSelection(next);
      },
      [onSelectionChange],
    );

    return (
      <div className='space-y-4 p-6'>
        <RDataTable<User, unknown>
          {...tableArgs}
          onChange={handleChange}
          onChangeSelected={handleSelectionChange}
        />

        <div className='grid gap-3 md:grid-cols-2'>
          <div className='rounded-lg border bg-muted/30 p-3 text-xs'>
            <div className='mb-1 font-semibold text-muted-foreground'>
              Query params
            </div>
            <pre className='whitespace-pre-wrap break-all text-muted-foreground'>
              {JSON.stringify(queryParams, null, 2)}
            </pre>
          </div>
          <div className='rounded-lg border bg-muted/30 p-3 text-xs'>
            <div className='mb-1 font-semibold text-muted-foreground'>
              Selected rows
            </div>
            <pre className='whitespace-pre-wrap break-all text-muted-foreground'>
              {JSON.stringify(selection, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithoutSearch: Story = {
  args: {
    allowSearch: false,
  },
};

export const WithMobileView: Story = {
  args: {
    renderOnMobile: (row) => (
      <div className='rounded-lg border bg-card p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h4 className='font-medium text-foreground'>{row.name}</h4>
            <p className='text-sm text-muted-foreground'>{row.email}</p>
          </div>
          <span className='inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary'>
            {row.role}
          </span>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Resize your browser to mobile width (< 768px) to see the mobile card view. The table will automatically switch between table and card layout with a smooth transition.',
      },
    },
  },
};

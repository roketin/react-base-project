import type { Meta, StoryObj } from '@storybook/react-vite';
import { RDataTable, type TRDataTableColumnDef } from '../r-data-table';

const meta: Meta<typeof RDataTable> = {
  title: 'Components/Data Display/RDataTable',
  component: RDataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RDataTable>;

// Sample data
type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
};

const sampleData: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    department: 'Engineering',
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    department: 'Design',
    status: 'active',
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Manager',
    department: 'Engineering',
    status: 'active',
    joinDate: '2022-11-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Developer',
    department: 'Engineering',
    status: 'inactive',
    joinDate: '2023-03-05',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'QA Engineer',
    department: 'Quality',
    status: 'active',
    joinDate: '2023-04-12',
  },
];

const columns: TRDataTableColumnDef<Person, unknown>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 150,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 200,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    size: 120,
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: 'Department',
    size: 130,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'joinDate',
    accessorKey: 'joinDate',
    header: 'Join Date',
    size: 120,
  },
];

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <RDataTable
      columns={columns}
      data={sampleData}
      pagination={false}
      allowSearch={false}
    />
  ),
};

export const ResizableColumns: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Drag the column borders to resize. Widths are persisted to localStorage.
      </p>
      <RDataTable
        columns={columns}
        data={sampleData}
        pagination={false}
        allowSearch={false}
        resizableColumns
        columnSizingStorageKey='demo-table'
      />
    </div>
  ),
};

export const ResizableWithSearch: Story = {
  render: () => (
    <RDataTable
      columns={columns}
      data={sampleData}
      pagination={false}
      allowSearch
      resizableColumns
      columnSizingStorageKey='demo-table-search'
    />
  ),
};

export const FixedLayoutResizable: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Fixed table layout with resizable columns - better for consistent column
        widths.
      </p>
      <RDataTable
        columns={columns}
        data={sampleData}
        pagination={false}
        allowSearch={false}
        fixed
        resizableColumns
        columnSizingStorageKey='demo-table-fixed'
      />
    </div>
  ),
};

export const PartialResizable: Story = {
  render: () => {
    const partialColumns: TRDataTableColumnDef<Person, unknown>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name (resizable)',
        size: 150,
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email (resizable)',
        size: 200,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status (fixed)',
        size: 100,
        enableResizing: false, // Disable resizing for this column
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ];

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Some columns can have resizing disabled via{' '}
          <code>enableResizing: false</code>
        </p>
        <RDataTable
          columns={partialColumns}
          data={sampleData}
          pagination={false}
          allowSearch={false}
          resizableColumns
        />
      </div>
    );
  },
};

export const ColumnToggle: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Click the "Columns" button to show/hide columns. Visibility is persisted
        to localStorage.
      </p>
      <RDataTable
        columns={columns}
        data={sampleData}
        pagination={false}
        allowSearch
        showColumnToggle
        columnVisibilityStorageKey='demo-table-visibility'
      />
    </div>
  ),
};

export const ColumnToggleWithInitialHidden: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Some columns are hidden by default. Click "Columns" to show them.
      </p>
      <RDataTable
        columns={columns}
        data={sampleData}
        pagination={false}
        allowSearch
        showColumnToggle
        initialColumnVisibility={{
          department: false,
          joinDate: false,
        }}
      />
    </div>
  ),
};

export const FullFeatured: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        All features enabled: search, column toggle, resizable columns, and
        persistence.
      </p>
      <RDataTable
        columns={columns}
        data={sampleData}
        pagination={false}
        allowSearch
        showColumnToggle
        resizableColumns
        columnSizingStorageKey='demo-full-sizing'
        columnVisibilityStorageKey='demo-full-visibility'
        toolbarEnd={
          <button className='px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md'>
            Export
          </button>
        }
      />
    </div>
  ),
};

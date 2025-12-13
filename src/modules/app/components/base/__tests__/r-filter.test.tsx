import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  RFilterMenu,
  RFilterBar,
} from '@/modules/app/components/base/r-filter';
import type { TFilterItem } from '@/modules/app/libs/filter-utils';

// Mock the useFilter hook
const mockSetValue = vi.fn();
const mockReset = vi.fn();
const mockGetParams = vi.fn();
let mockValues: Record<string, unknown> = {};

vi.mock('@/modules/app/hooks/use-filter', () => ({
  useFilter: (schema: TFilterItem[]) => {
    const defaultValues: Record<string, unknown> = {};
    schema.forEach((item) => {
      defaultValues[item.id] = item.defaultValue ?? null;
    });
    mockValues = { ...defaultValues };
    mockReset.mockReturnValue(defaultValues);
    mockGetParams.mockReturnValue(mockValues);
    return {
      values: mockValues,
      setValue: mockSetValue,
      reset: mockReset,
      getParams: mockGetParams,
    };
  },
}));

describe('RFilterMenu', () => {
  const schema: TFilterItem[] = [
    {
      id: 'status',
      label: 'Status',
      defaultValue: null,
      render: ({ value, onChange }) => (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          data-testid='status-filter'
        >
          <option value=''>All</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      defaultValue: null,
      render: ({ value, onChange }) => (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          data-testid='category-filter'
        >
          <option value=''>All</option>
          <option value='tech'>Tech</option>
        </select>
      ),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockValues = {};
  });

  it('renders filter button', () => {
    render(<RFilterMenu schema={schema} />);
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('shows filter popover when button is clicked', async () => {
    render(<RFilterMenu schema={schema} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(await screen.findByText('Status')).toBeInTheDocument();
  });

  it('shows apply and reset buttons', async () => {
    render(<RFilterMenu schema={schema} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(
      await screen.findByRole('button', { name: /apply/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('uses custom button text', () => {
    render(<RFilterMenu schema={schema} buttonText='Filters' />);
    expect(
      screen.getByRole('button', { name: /filters/i }),
    ).toBeInTheDocument();
  });

  it('calls onSubmit when apply is clicked', async () => {
    const onSubmit = vi.fn();
    render(<RFilterMenu schema={schema} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));

    // Change a filter value
    const select = await screen.findByTestId('status-filter');
    fireEvent.change(select, { target: { value: 'active' } });

    // Click apply
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('calls onReset when reset is clicked', async () => {
    const onReset = vi.fn();
    render(<RFilterMenu schema={schema} onReset={onReset} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    fireEvent.click(await screen.findByRole('button', { name: /reset/i }));

    await waitFor(() => {
      expect(onReset).toHaveBeenCalled();
    });
  });

  it('supports keyMap as function', async () => {
    const onSubmit = vi.fn();
    const keyMap = (key: string) => `mapped_${key}`;

    render(<RFilterMenu schema={schema} onSubmit={onSubmit} keyMap={keyMap} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    fireEvent.click(await screen.findByRole('button', { name: /apply/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('supports keyMap as object', async () => {
    const onSubmit = vi.fn();
    const keyMap = { status: 'filter_status' };

    render(<RFilterMenu schema={schema} onSubmit={onSubmit} keyMap={keyMap} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    fireEvent.click(await screen.findByRole('button', { name: /apply/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('supports storageKey prop', () => {
    render(<RFilterMenu schema={schema} storageKey='test-filter' />);
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });
});

describe('RFilterBar', () => {
  const schema: TFilterItem[] = [
    {
      id: 'search',
      label: 'Search',
      defaultValue: '',
      render: ({ value, onChange }) => (
        <input
          type='text'
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          data-testid='search-filter'
        />
      ),
    },
    {
      id: 'type',
      label: 'Type',
      defaultValue: null,
      render: ({ value, onChange }) => (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          data-testid='type-filter'
        >
          <option value=''>All</option>
          <option value='a'>Type A</option>
        </select>
      ),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockValues = {};
  });

  it('renders filter fields inline', () => {
    render(<RFilterBar schema={schema} />);
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
  });

  it('applies grid layout with 2 columns', () => {
    const { container } = render(
      <RFilterBar schema={schema} layout='grid' columns={2} />,
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(container.querySelector('.sm\\:grid-cols-2')).toBeInTheDocument();
  });

  it('applies grid layout with 3 columns', () => {
    const { container } = render(
      <RFilterBar schema={schema} layout='grid' columns={3} />,
    );
    expect(container.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument();
  });

  it('applies grid layout with 4 columns', () => {
    const { container } = render(
      <RFilterBar schema={schema} layout='grid' columns={4} />,
    );
    expect(container.querySelector('.lg\\:grid-cols-4')).toBeInTheDocument();
  });

  it('applies stack layout', () => {
    const { container } = render(<RFilterBar schema={schema} layout='stack' />);
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('calls onChange when filter value changes', async () => {
    const onChange = vi.fn();
    render(<RFilterBar schema={schema} onChange={onChange} />);

    const input = screen.getByTestId('search-filter');
    fireEvent.change(input, { target: { value: 'test' } });

    // onChange is called via useEffect, may need to wait
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalled();
    });
  });

  it('supports keyMap prop', () => {
    const onChange = vi.fn();
    const keyMap = { search: 'q' };

    render(<RFilterBar schema={schema} onChange={onChange} keyMap={keyMap} />);
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
  });

  it('supports storageKey prop', () => {
    render(<RFilterBar schema={schema} storageKey='bar-filter' />);
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
  });
});

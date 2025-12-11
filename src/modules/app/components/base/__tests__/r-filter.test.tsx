import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RFilterMenu,
  RFilterBar,
} from '@/modules/app/components/base/r-filter';
import type { TFilterItem } from '@/modules/app/libs/filter-utils';

// Mock the useFilter hook since it contains complex logic
vi.mock('@/modules/app/hooks/use-filter', () => ({
  useFilter: (schema: TFilterItem[]) => {
    const values: Record<string, unknown> = {};
    schema.forEach((item) => {
      values[item.id] = item.defaultValue ?? null;
    });
    return {
      values,
      setValue: vi.fn(),
      reset: () => values,
      getParams: () => values,
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
  ];

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
  ];

  it('renders filter fields inline', () => {
    render(<RFilterBar schema={schema} />);
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
  });

  it('applies grid layout', () => {
    const { container } = render(
      <RFilterBar schema={schema} layout='grid' columns={3} />,
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});

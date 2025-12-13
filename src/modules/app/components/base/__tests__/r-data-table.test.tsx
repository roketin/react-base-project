import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RDataTable } from '../r-data-table';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) =>
      params?.count ? `${key} (${params.count})` : key,
  }),
}));

vi.mock('@/modules/app/hooks/use-media-query', () => ({
  useIsMobile: () => false,
}));

describe('RDataTable', () => {
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  it('renders table with data', () => {
    render(<RDataTable columns={columns} data={data} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<RDataTable columns={columns} data={data} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<RDataTable columns={columns} data={[]} />);

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('renders custom empty content', () => {
    render(
      <RDataTable
        columns={columns}
        data={[]}
        emptyContent={<div>Custom empty message</div>}
      />,
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = render(
      <RDataTable columns={columns} data={[]} loading />,
    );

    // Should have skeleton elements
    expect(
      container.querySelectorAll('[class*="animate-pulse"]').length,
    ).toBeGreaterThan(0);
  });

  it('renders search input when allowSearch is true', () => {
    render(<RDataTable columns={columns} data={data} allowSearch />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('hides search input when allowSearch is false', () => {
    render(<RDataTable columns={columns} data={data} allowSearch={false} />);

    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('calls onChange when search value changes', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<RDataTable columns={columns} data={data} onChange={onChange} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Debounced, so advance timers
    vi.advanceTimersByTime(300);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'test' }),
    );
    vi.useRealTimers();
  });

  it('renders toolbar start content', () => {
    render(
      <RDataTable
        columns={columns}
        data={data}
        toolbarStart={<button>Filter</button>}
      />,
    );

    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders toolbar end content', () => {
    render(
      <RDataTable
        columns={columns}
        data={data}
        toolbarEnd={<button>Export</button>}
      />,
    );

    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(
      <RDataTable
        columns={columns}
        data={data}
        footer={<div>Custom Footer</div>}
      />,
    );

    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('renders pagination when pagination is true', () => {
    render(
      <RDataTable
        columns={columns}
        data={data}
        pagination
        meta={{ total: 100, per_page: 10, current_page: 1, last_page: 10 }}
      />,
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('hides pagination when pagination is false', () => {
    render(<RDataTable columns={columns} data={data} pagination={false} />);

    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
  });

  it('handles sorting', () => {
    const onChange = vi.fn();
    render(
      <RDataTable
        columns={[{ accessorKey: 'name', header: 'Name', enableSorting: true }]}
        data={data}
        onChange={onChange}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    expect(onChange).toHaveBeenCalled();
  });

  it('shows column toggle when showColumnToggle is true', () => {
    render(<RDataTable columns={columns} data={data} showColumnToggle />);

    // Should have column toggle button
    expect(
      document.querySelector('[data-slot="dropdown-menu"]'),
    ).toBeInTheDocument();
  });
});

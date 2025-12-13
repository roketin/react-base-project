import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { REmptyState } from '../r-empty-state';

describe('REmptyState', () => {
  it('renders no data state by default', () => {
    render(
      <REmptyState
        noDataTitle='No Data'
        noDataDescription='No data available'
        noResultsTitle='No Results'
      />,
    );

    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders no results state when searching', () => {
    render(
      <REmptyState
        isSearching
        noDataTitle='No Data'
        noResultsTitle='No Results Found'
        noResultsDescription='Try different search terms'
      />,
    );

    expect(screen.getByText('No Results Found')).toBeInTheDocument();
    expect(screen.getByText('Try different search terms')).toBeInTheDocument();
  });

  it('renders add button when canCreate is true', () => {
    const onAdd = vi.fn();
    render(
      <REmptyState
        noDataTitle='No Data'
        noResultsTitle='No Results'
        canCreate
        onAdd={onAdd}
        addLabel='Add Item'
      />,
    );

    const addButton = screen.getByRole('button', { name: /add item/i });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(onAdd).toHaveBeenCalled();
  });

  it('does not render add button when canCreate is false', () => {
    render(
      <REmptyState
        noDataTitle='No Data'
        noResultsTitle='No Results'
        canCreate={false}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders custom action', () => {
    render(
      <REmptyState
        noDataTitle='No Data'
        noResultsTitle='No Results'
        customAction={<button>Custom Action</button>}
      />,
    );

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <REmptyState
        noDataTitle='No Data'
        noResultsTitle='No Results'
        className='custom-class'
      />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

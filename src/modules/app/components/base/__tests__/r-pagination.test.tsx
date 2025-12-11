import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RPagination } from '@/modules/app/components/base/r-pagination';

describe('RPagination', () => {
  it('renders pagination navigation', () => {
    render(
      <RPagination currentPage={1} totalPages={10} onPageChange={() => {}} />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders current page as active', () => {
    render(
      <RPagination currentPage={5} totalPages={10} onPageChange={() => {}} />,
    );
    const activeButton = screen.getByLabelText('Go to page 5');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when clicking a page number', () => {
    const handlePageChange = vi.fn();
    render(
      <RPagination
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Go to page 2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking next', () => {
    const handlePageChange = vi.fn();
    render(
      <RPagination
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous', () => {
    const handlePageChange = vi.fn();
    render(
      <RPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Go to previous page'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    render(
      <RPagination currentPage={1} totalPages={10} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <RPagination currentPage={10} totalPages={10} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });

  it('shows first and last page buttons by default', () => {
    render(
      <RPagination currentPage={5} totalPages={10} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('hides first and last buttons when showFirstLast is false', () => {
    render(
      <RPagination
        currentPage={5}
        totalPages={10}
        onPageChange={() => {}}
        showFirstLast={false}
      />,
    );
    expect(screen.queryByLabelText('Go to first page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to last page')).not.toBeInTheDocument();
  });

  it('goes to first page when clicking first button', () => {
    const handlePageChange = vi.fn();
    render(
      <RPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Go to first page'));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('goes to last page when clicking last button', () => {
    const handlePageChange = vi.fn();
    render(
      <RPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Go to last page'));
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  it('applies custom className', () => {
    render(
      <RPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
        className='custom-pagination'
      />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <RPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
        ref={ref}
      />,
    );
    expect(ref).toHaveBeenCalled();
  });
});

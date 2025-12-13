import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RDataTableFooter from '../r-data-table-footer';

describe('RDataTableFooter', () => {
  const defaultMeta = {
    total: 100,
    per_page: 10,
    current_page: 1,
    last_page: 10,
    from: 1,
    to: 10,
  };

  it('renders showing entries text', () => {
    render(<RDataTableFooter meta={defaultMeta} />);

    expect(
      screen.getByText(/showing 1 to 10 of 100 entries/i),
    ).toBeInTheDocument();
  });

  it('renders no entries message when total is 0', () => {
    render(<RDataTableFooter meta={{ ...defaultMeta, total: 0 }} />);

    expect(screen.getByText(/no entries to display/i)).toBeInTheDocument();
  });

  it('renders per page selector', () => {
    render(<RDataTableFooter meta={defaultMeta} />);

    // rc-select renders the value - use getAllByText
    const elements = screen.getAllByText('10');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('calls onChange when page changes', () => {
    const onChange = vi.fn();
    render(<RDataTableFooter meta={defaultMeta} onChange={onChange} />);

    // Find and click next page button - use getAllByLabelText
    const nextButtons = screen.getAllByLabelText(/next/i);
    fireEvent.click(nextButtons[0]);

    expect(onChange).toHaveBeenCalledWith({ page: 2 });
  });

  it('disables controls when disabled prop is true', () => {
    const { container } = render(
      <RDataTableFooter meta={defaultMeta} disabled />,
    );

    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
  });

  it('calculates page count from total and per_page', () => {
    render(
      <RDataTableFooter meta={{ total: 55, per_page: 10, current_page: 1 }} />,
    );

    expect(
      screen.getByText(/showing 1 to 10 of 55 entries/i),
    ).toBeInTheDocument();
  });

  it('handles missing meta gracefully', () => {
    render(<RDataTableFooter />);

    expect(screen.getByText(/no entries to display/i)).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<RDataTableFooter meta={defaultMeta} />);

    // Should have pagination buttons - use getAllByLabelText
    const prevButtons = screen.getAllByLabelText(/previous/i);
    const nextButtons = screen.getAllByLabelText(/next/i);
    expect(prevButtons.length).toBeGreaterThan(0);
    expect(nextButtons.length).toBeGreaterThan(0);
  });

  it('shows correct range for middle pages', () => {
    render(
      <RDataTableFooter
        meta={{
          ...defaultMeta,
          current_page: 5,
          from: 41,
          to: 50,
        }}
      />,
    );

    expect(
      screen.getByText(/showing 41 to 50 of 100 entries/i),
    ).toBeInTheDocument();
  });
});

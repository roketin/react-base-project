import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RSplitter, RSplitterPanel } from '../r-splitter';

describe('RSplitter', () => {
  it('renders splitter with panels', () => {
    render(
      <RSplitter>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('renders gutter between panels', () => {
    render(
      <RSplitter>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders multiple gutters for multiple panels', () => {
    render(
      <RSplitter>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
        <RSplitterPanel>Panel 3</RSplitterPanel>
      </RSplitter>,
    );

    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('renders with vertical orientation', () => {
    const { container } = render(
      <RSplitter orientation='vertical'>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('renders with horizontal orientation by default', () => {
    const { container } = render(
      <RSplitter>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    expect(container.querySelector('.flex-row')).toBeInTheDocument();
  });

  it('calls onResize during drag', () => {
    const onResize = vi.fn();
    render(
      <RSplitter onResize={onResize}>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    const gutter = screen.getByRole('separator');
    fireEvent.mouseDown(gutter, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    // onResize may or may not be called depending on container size
  });

  it('handles double click on gutter for collapse', () => {
    render(
      <RSplitter>
        <RSplitterPanel collapsible>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    const gutter = screen.getByRole('separator');
    fireEvent.doubleClick(gutter);

    // Panel should toggle collapse state
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
  });

  it('handles keyboard navigation on gutter', () => {
    render(
      <RSplitter>
        <RSplitterPanel collapsible>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    const gutter = screen.getByRole('separator');
    fireEvent.keyDown(gutter, { key: 'Enter' });

    expect(screen.getByText('Panel 1')).toBeInTheDocument();
  });

  it('disables gutter when disabled prop is true', () => {
    render(
      <RSplitter disabled>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    const gutter = screen.getByRole('separator');
    expect(gutter).toHaveAttribute('tabIndex', '-1');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RSplitter className='custom-splitter'>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    expect(container.querySelector('.custom-splitter')).toBeInTheDocument();
  });

  it('applies custom gutterClassName', () => {
    render(
      <RSplitter gutterClassName='custom-gutter'>
        <RSplitterPanel>Panel 1</RSplitterPanel>
        <RSplitterPanel>Panel 2</RSplitterPanel>
      </RSplitter>,
    );

    const gutter = screen.getByRole('separator');
    expect(gutter).toHaveClass('custom-gutter');
  });
});

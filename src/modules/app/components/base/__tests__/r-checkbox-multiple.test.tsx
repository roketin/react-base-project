import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';

describe('RCheckboxMultiple', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  it('renders all options', () => {
    render(<RCheckboxMultiple options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders checked items', () => {
    render(<RCheckboxMultiple options={options} checked={['a', 'c']} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('calls onCheckedChange when checkbox is clicked', () => {
    const handleChange = vi.fn();
    render(
      <RCheckboxMultiple
        options={options}
        checked={[]}
        onCheckedChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(handleChange).toHaveBeenCalledWith(['a']);
  });

  it('removes value when unchecking', () => {
    const handleChange = vi.fn();
    render(
      <RCheckboxMultiple
        options={options}
        checked={['a', 'b']}
        onCheckedChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(handleChange).toHaveBeenCalledWith(['b']);
  });

  it('disables all checkboxes when disabled', () => {
    render(<RCheckboxMultiple options={options} disabled />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('applies horizontal layout by default', () => {
    const { container } = render(<RCheckboxMultiple options={options} />);
    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('applies vertical layout', () => {
    const { container } = render(
      <RCheckboxMultiple options={options} layout='vertical' />,
    );
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RCheckboxMultiple options={options} className='custom-class' />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RRadio } from '@/modules/app/components/base/r-radio';

describe('RRadio', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders all options', () => {
    render(<RRadio options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders radio buttons for each option', () => {
    render(<RRadio options={options} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('selects default value', () => {
    render(<RRadio options={options} defaultValue='option2' />);
    const radio = screen.getByDisplayValue('option2');
    expect(radio).toBeChecked();
  });

  it('calls onChange when option is selected', () => {
    const handleChange = vi.fn();
    render(<RRadio options={options} onChange={handleChange} />);

    fireEvent.click(screen.getByDisplayValue('option1'));
    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('renders controlled value', () => {
    render(<RRadio options={options} value='option3' />);
    expect(screen.getByDisplayValue('option3')).toBeChecked();
  });

  it('disables all options when disabled', () => {
    render(<RRadio options={options} disabled />);
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('renders with description', () => {
    const optionsWithDesc = [
      { value: 'a', label: 'Option A', description: 'Description A' },
      { value: 'b', label: 'Option B', description: 'Description B' },
    ];
    render(<RRadio options={optionsWithDesc} />);
    expect(screen.getByText('Description A')).toBeInTheDocument();
    expect(screen.getByText('Description B')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RRadio options={options} className='custom-radio' />,
    );
    expect(container.querySelector('.custom-radio')).toBeInTheDocument();
  });
});

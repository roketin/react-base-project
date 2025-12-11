import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RRadioGroup,
  RRadio,
} from '@/modules/app/components/base/r-radio-group';

describe('RRadioGroup', () => {
  it('renders all radio options', () => {
    render(
      <RRadioGroup name='test'>
        <RRadio value='a' label='Option A' />
        <RRadio value='b' label='Option B' />
        <RRadio value='c' label='Option C' />
      </RRadioGroup>,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders radio inputs', () => {
    render(
      <RRadioGroup name='test'>
        <RRadio value='a' label='Option A' />
        <RRadio value='b' label='Option B' />
      </RRadioGroup>,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('selects default value', () => {
    render(
      <RRadioGroup name='test' defaultValue='b'>
        <RRadio value='a' label='Option A' />
        <RRadio value='b' label='Option B' />
      </RRadioGroup>,
    );
    expect(screen.getByDisplayValue('b')).toBeChecked();
  });

  it('calls onChange when option is selected', () => {
    const handleChange = vi.fn();
    render(
      <RRadioGroup name='test' onChange={handleChange}>
        <RRadio value='a' label='Option A' />
        <RRadio value='b' label='Option B' />
      </RRadioGroup>,
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('renders with controlled value', () => {
    render(
      <RRadioGroup name='test' value='b'>
        <RRadio value='a' label='Option A' />
        <RRadio value='b' label='Option B' />
      </RRadioGroup>,
    );
    expect(screen.getByDisplayValue('b')).toBeChecked();
  });

  it('renders with label', () => {
    render(
      <RRadioGroup name='test' label='Choose option'>
        <RRadio value='a' label='A' />
      </RRadioGroup>,
    );
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <RRadioGroup name='test' error='Please select an option'>
        <RRadio value='a' label='A' />
      </RRadioGroup>,
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <RRadioGroup name='test' helperText='Select one option'>
        <RRadio value='a' label='A' />
      </RRadioGroup>,
    );
    expect(screen.getByText('Select one option')).toBeInTheDocument();
  });

  it('disables all radios when group is disabled', () => {
    render(
      <RRadioGroup name='test' disabled>
        <RRadio value='a' label='A' />
        <RRadio value='b' label='B' />
      </RRadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('applies vertical orientation by default', () => {
    const { container } = render(
      <RRadioGroup name='test'>
        <RRadio value='a' label='A' />
      </RRadioGroup>,
    );
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('applies horizontal orientation', () => {
    const { container } = render(
      <RRadioGroup name='test' orientation='horizontal'>
        <RRadio value='a' label='A' />
      </RRadioGroup>,
    );
    expect(container.querySelector('.flex-row')).toBeInTheDocument();
  });

  it('renders radio with description', () => {
    render(
      <RRadioGroup name='test'>
        <RRadio value='a' label='Option A' description='Description for A' />
      </RRadioGroup>,
    );
    expect(screen.getByText('Description for A')).toBeInTheDocument();
  });

  it('throws error when RRadio used outside RRadioGroup', () => {
    expect(() => {
      render(<RRadio value='a' label='A' />);
    }).toThrow('RRadio must be used within RRadioGroup');
  });
});

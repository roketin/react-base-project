import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RInputFormat } from '@/modules/app/components/base/r-input-format';

describe('RInputFormat', () => {
  const phoneFormat = {
    mask: [
      '+',
      '6',
      '2',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  it('renders input', () => {
    render(<RInputFormat format={phoneFormat} placeholder='Phone' />);
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RInputFormat format={phoneFormat} label='Phone Number' />);
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<RInputFormat format={phoneFormat} error='Invalid phone number' />);
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <RInputFormat
        format={phoneFormat}
        helperText='Format: +62 xxx-xxxx-xxxx'
      />,
    );
    expect(screen.getByText('Format: +62 xxx-xxxx-xxxx')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<RInputFormat format={phoneFormat} disabled placeholder='Phone' />);
    expect(screen.getByPlaceholderText('Phone')).toBeDisabled();
  });
});

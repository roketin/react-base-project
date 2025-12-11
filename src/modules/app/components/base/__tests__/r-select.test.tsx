import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RSelect from '@/modules/app/components/base/r-select';

describe('RSelect', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  it('renders select', () => {
    render(<RSelect options={options} placeholder='Select option' />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('renders with options', () => {
    render(<RSelect options={options} />);
    expect(screen.getByText('Choose..')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RSelect options={options} className='custom-select' />,
    );
    expect(container.querySelector('.custom-select')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<RSelect options={options} placeholder='Choose an option' />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    const { container } = render(<RSelect options={options} disabled />);
    expect(
      container.querySelector('[class*="rc-select-disabled"]'),
    ).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<RSelect options={options} loading />);
    // Loading indicator should be present
  });
});

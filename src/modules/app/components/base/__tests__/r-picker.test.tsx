import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RPicker,
  RFormDatePicker,
} from '@/modules/app/components/base/r-picker';

describe('RPicker', () => {
  it('renders date picker', () => {
    render(<RPicker placeholder='Select date' />);
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<RPicker className='custom-picker' />);
    expect(container.querySelector('.custom-picker')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<RPicker disabled placeholder='Select date' />);
    expect(screen.getByPlaceholderText('Select date')).toBeDisabled();
  });

  it('renders with different picker types', () => {
    render(<RPicker picker='month' placeholder='Select month' />);
    expect(screen.getByPlaceholderText('Select month')).toBeInTheDocument();
  });
});

describe('RFormDatePicker', () => {
  it('renders form date picker', () => {
    render(<RFormDatePicker placeholder='Pick a date' />);
    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
  });

  it('renders with Date value', () => {
    const date = new Date('2024-01-15');
    render(<RFormDatePicker value={date} placeholder='Date' />);
    expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
  });
});

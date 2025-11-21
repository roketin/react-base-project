import Dashboard from '@/modules/dashboard/components/pages/dashboard';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Dashboard', () => {
  it('renders dashboard content correctly', () => {
    render(<Dashboard />);

    // Check for main sections
    expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();

    // Check for specific data points
    expect(screen.getByText('IDR 150.000.000')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Imam Stevano')).toBeInTheDocument();
  });
});

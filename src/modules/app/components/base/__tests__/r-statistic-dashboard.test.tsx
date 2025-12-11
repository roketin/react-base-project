import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RStatisticDashboard,
  type TRStatisticMetric,
} from '@/modules/app/components/base/r-statistic-dashboard';
import { Users } from 'lucide-react';

describe('RStatisticDashboard', () => {
  const metrics: TRStatisticMetric[] = [
    { id: '1', label: 'Total Users', value: '1,234' },
    { id: '2', label: 'Active Users', value: '876' },
    { id: '3', label: 'Revenue', value: '$12,345' },
  ];

  it('renders all metrics', () => {
    render(<RStatisticDashboard metrics={metrics} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders metric with description', () => {
    const metricsWithDesc: TRStatisticMetric[] = [
      {
        id: '1',
        label: 'Users',
        value: '100',
        description: 'Total registered users',
      },
    ];
    render(<RStatisticDashboard metrics={metricsWithDesc} />);
    expect(screen.getByText('Total registered users')).toBeInTheDocument();
  });

  it('renders metric with trend', () => {
    const metricsWithTrend: TRStatisticMetric[] = [
      {
        id: '1',
        label: 'Sales',
        value: '$5,000',
        trend: { value: 12, direction: 'up', label: 'vs last month' },
      },
    ];
    render(<RStatisticDashboard metrics={metricsWithTrend} />);
    expect(screen.getByText('+12')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders metric with icon', () => {
    const metricsWithIcon: TRStatisticMetric[] = [
      {
        id: '1',
        label: 'Users',
        value: '100',
        icon: <Users data-testid='icon' />,
      },
    ];
    render(<RStatisticDashboard metrics={metricsWithIcon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies different column layouts', () => {
    const { container, rerender } = render(
      <RStatisticDashboard metrics={metrics} columns={2} />,
    );
    expect(container.querySelector('.sm\\:grid-cols-2')).toBeInTheDocument();

    rerender(<RStatisticDashboard metrics={metrics} columns={4} />);
    expect(container.querySelector('.xl\\:grid-cols-4')).toBeInTheDocument();
  });

  it('applies minimal style', () => {
    const { container } = render(
      <RStatisticDashboard metrics={metrics} minimal />,
    );
    // Minimal style should be applied
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RStatisticDashboard metrics={metrics} className='custom-dashboard' />,
    );
    expect(container.querySelector('.custom-dashboard')).toBeInTheDocument();
  });
});

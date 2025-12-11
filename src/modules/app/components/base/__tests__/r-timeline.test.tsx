import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RTimeline } from '@/modules/app/components/base/r-timeline';

describe('RTimeline', () => {
  const items = [
    { id: '1', title: 'Step 1', description: 'First step description' },
    { id: '2', title: 'Step 2', description: 'Second step description' },
    { id: '3', title: 'Step 3', description: 'Third step description' },
  ];

  it('renders all timeline items', () => {
    render(<RTimeline items={items} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders descriptions', () => {
    render(<RTimeline items={items} />);
    expect(screen.getByText('First step description')).toBeInTheDocument();
    expect(screen.getByText('Second step description')).toBeInTheDocument();
  });

  it('renders with timestamps', () => {
    const itemsWithTimestamp = [
      { id: '1', title: 'Event', timestamp: 'Jan 1, 2024' },
    ];
    render(<RTimeline items={itemsWithTimestamp} />);
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('renders with custom icons', () => {
    const itemsWithIcon = [
      {
        id: '1',
        title: 'Custom',
        icon: <span data-testid='custom-icon'>🎯</span>,
      },
    ];
    render(<RTimeline items={itemsWithIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const itemsWithChildren = [
      { id: '1', title: 'Parent', children: <p>Child content</p> },
    ];
    render(<RTimeline items={itemsWithChildren} />);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders metadata', () => {
    const itemsWithMeta = [
      { id: '1', title: 'With Meta', metadata: 'Some metadata' },
    ];
    render(<RTimeline items={itemsWithMeta} />);
    expect(screen.getByText('Some metadata')).toBeInTheDocument();
  });

  it('renders actions', () => {
    const itemsWithActions = [
      { id: '1', title: 'With Actions', actions: <button>Action</button> },
    ];
    render(<RTimeline items={itemsWithActions} />);
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('applies ghost variant', () => {
    const { container } = render(<RTimeline items={items} variant='ghost' />);
    expect(container.firstChild).toHaveClass('bg-background/40');
  });

  it('applies solid variant by default', () => {
    const { container } = render(<RTimeline items={items} />);
    expect(container.firstChild).toHaveClass('bg-background');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RTimeline items={items} className='custom-timeline' />,
    );
    expect(container.firstChild).toHaveClass('custom-timeline');
  });

  it('renders with completed status', () => {
    const completedItems = [
      { id: '1', title: 'Done', status: 'completed' as const },
    ];
    const { container } = render(<RTimeline items={completedItems} />);
    expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
  });

  it('renders with error status', () => {
    const errorItems = [{ id: '1', title: 'Failed', status: 'error' as const }];
    const { container } = render(<RTimeline items={errorItems} />);
    expect(container.querySelector('.bg-destructive')).toBeInTheDocument();
  });
});

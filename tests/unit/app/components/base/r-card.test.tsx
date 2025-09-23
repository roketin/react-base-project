import { RCard } from '@/modules/app/components/base/r-card';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('RCard', () => {
  it('renders title, description, action and footer when provided', () => {
    render(
      <RCard
        title='Card Title'
        description='Card Description'
        action={<button>Action</button>}
        footer={<div>Footer Content</div>}
      >
        <p>Child Content</p>
      </RCard>,
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders only header when only header is provided', () => {
    render(<RCard header={<div>Custom Header</div>} />);
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('does not render header section if no header, title, description, or action is provided', () => {
    render(<RCard />);
    // tidak ada heading, description, action
    expect(screen.queryByText('Card Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Card Description')).not.toBeInTheDocument();
  });
});

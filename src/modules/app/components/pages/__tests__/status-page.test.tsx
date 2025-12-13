import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusPage from '@/modules/app/components/pages/status-page';

// Mock useTheme hook
vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('StatusPage', () => {
  it('renders title and description', () => {
    render(<StatusPage title='Test Title' description='Test description' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with code badge', () => {
    render(
      <StatusPage code='404' title='Not Found' description='Page not found' />,
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders without code badge when code is not provided', () => {
    render(<StatusPage title='Error' description='Something went wrong' />);
    expect(screen.queryByText(/^\d{3}$/)).not.toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(
      <StatusPage
        title='Error'
        description='Error occurred'
        action={<button>Go Back</button>}
      />,
    );
    expect(
      screen.getByRole('button', { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusPage title='Test' description='Test' className='custom-class' />,
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders with different status types', () => {
    const { rerender } = render(
      <StatusPage title='Info' description='Info message' status='info' />,
    );
    expect(screen.getByText('Info')).toBeInTheDocument();

    rerender(
      <StatusPage
        title='Success'
        description='Success message'
        status='success'
      />,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(
      <StatusPage
        title='Warning'
        description='Warning message'
        status='warning'
      />,
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();

    rerender(
      <StatusPage title='Error' description='Error message' status='error' />,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});

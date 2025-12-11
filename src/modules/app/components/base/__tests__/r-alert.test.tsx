import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RAlert } from '@/modules/app/components/base/r-alert';

describe('RAlert', () => {
  it('renders with default variant', () => {
    render(<RAlert title='Default Alert' />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Default Alert')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<RAlert title='Alert Title' description='Alert description text' />);

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description text')).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    render(<RAlert variant='success' title='Success!' />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with error variant', () => {
    render(<RAlert variant='error' title='Error occurred' />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    render(<RAlert variant='warning' title='Warning!' />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with info variant', () => {
    render(<RAlert variant='info' title='Information' />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows close button when closable is true', () => {
    render(<RAlert title='Closable Alert' closable />);
    expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<RAlert title='Closable' closable onClose={handleClose} />);

    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when closable is false', () => {
    render(<RAlert title='Not Closable' closable={false} />);
    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(
      <RAlert
        title='Custom Icon'
        icon={<span data-testid='custom-icon'>🌟</span>}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('hides icon when icon is null', () => {
    const { container } = render(<RAlert title='No Icon' icon={null} />);
    // When icon is null, there should be no icon container
    expect(
      container.querySelector('.shrink-0.mt-0\\.5'),
    ).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(
      <RAlert title='With Action' action={<button>Take Action</button>} />,
    );
    expect(
      screen.getByRole('button', { name: /take action/i }),
    ).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <RAlert title='With Children'>
        <p>This is child content</p>
      </RAlert>,
    );
    expect(screen.getByText('This is child content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<RAlert title='Custom Class' className='my-custom-class' />);
    expect(screen.getByRole('alert')).toHaveClass('my-custom-class');
  });
});

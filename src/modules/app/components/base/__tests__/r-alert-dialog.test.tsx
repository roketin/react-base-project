import RAlertDialog, {
  type TRAlertDialogProps,
} from '@/modules/app/components/base/r-alert-dialog';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

const defaultProps: TRAlertDialogProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: 'Confirm Action',
  description: 'Are you sure?',
  onOk: vi.fn(),
  onCancel: vi.fn(),
};

describe('RAlertDialog', () => {
  it('renders title and description', () => {
    render(<RAlertDialog {...defaultProps} />);

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onOk when ok button clicked', async () => {
    render(<RAlertDialog {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));
    expect(defaultProps.onOk).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button clicked', async () => {
    render(<RAlertDialog {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /no/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('hides cancel button when hideCancel is true', () => {
    render(<RAlertDialog {...defaultProps} hideCancel />);

    expect(
      screen.queryByRole('button', { name: /no/i }),
    ).not.toBeInTheDocument();
  });

  it('renders extra buttons and icon when provided', () => {
    render(
      <RAlertDialog
        {...defaultProps}
        extraButtons={<button>Extra</button>}
        icon={<span data-testid='icon'>*</span>}
      />,
    );

    expect(screen.getByText('Extra')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

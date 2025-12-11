import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RPanelHeader } from '@/modules/app/components/base/r-panel-header';

describe('RPanelHeader', () => {
  it('renders title', () => {
    render(<RPanelHeader title='Panel Title' />);
    expect(screen.getByText('Panel Title')).toBeInTheDocument();
  });

  it('renders close button when showClose is true', () => {
    render(<RPanelHeader title='Title' showClose onClose={() => {}} />);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<RPanelHeader title='Title' showClose onClose={handleClose} />);

    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders cancel button when showCancel is true', () => {
    render(<RPanelHeader title='Title' showCancel onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn();
    render(<RPanelHeader title='Title' showCancel onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalled();
  });

  it('renders ok button when showOk is true', () => {
    render(<RPanelHeader title='Title' showOk onOk={() => {}} />);
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('calls onOk when ok button is clicked', () => {
    const handleOk = vi.fn();
    render(<RPanelHeader title='Title' showOk onOk={handleOk} />);

    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(handleOk).toHaveBeenCalled();
  });

  it('renders custom actions', () => {
    render(
      <RPanelHeader title='Title' actions={<button>Custom Action</button>} />,
    );
    expect(
      screen.getByRole('button', { name: /custom action/i }),
    ).toBeInTheDocument();
  });

  it('renders custom left content', () => {
    render(
      <RPanelHeader title='Title' leftContent={<span>Custom Left</span>} />,
    );
    expect(screen.getByText('Custom Left')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(<RPanelHeader title='Title' showClose showCancel showOk loading />);
    expect(screen.getByLabelText('Close')).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('uses custom button labels', () => {
    render(
      <RPanelHeader
        title='Title'
        showCancel
        showOk
        cancelButton={{ label: 'Discard' }}
        okButton={{ label: 'Save' }}
      />,
    );
    expect(
      screen.getByRole('button', { name: /discard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RPanelHeader title='Title' className='custom-header' />,
    );
    expect(container.querySelector('.custom-header')).toBeInTheDocument();
  });
});

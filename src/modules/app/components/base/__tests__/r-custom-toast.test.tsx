import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CustomToast } from '../r-custom-toast';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    dismiss: vi.fn(),
  },
}));

describe('CustomToast', () => {
  it('renders toast with title', () => {
    render(<CustomToast title='Test Title' toastId='1' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders toast with description', () => {
    render(
      <CustomToast
        title='Test Title'
        description='Test Description'
        toastId='1'
      />,
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders success variant', () => {
    render(<CustomToast title='Success' variant='success' toastId='1' />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders warning variant', () => {
    render(<CustomToast title='Warning' variant='warning' toastId='1' />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders error variant', () => {
    render(<CustomToast title='Error' variant='error' toastId='1' />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders info variant', () => {
    render(<CustomToast title='Info' variant='info' toastId='1' />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('dismisses toast on close button click', () => {
    render(<CustomToast title='Test' toastId='test-id' />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(toast.dismiss).toHaveBeenCalledWith('test-id');
  });

  it('renders progress bar', () => {
    render(<CustomToast title='Test' toastId='1' duration={5000} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

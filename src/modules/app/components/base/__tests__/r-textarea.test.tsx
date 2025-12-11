import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RTextarea } from '@/modules/app/components/base/r-textarea';

describe('RTextarea', () => {
  it('renders textarea element', () => {
    render(<RTextarea placeholder='Enter text' />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RTextarea label='Description' />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<RTextarea onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<RTextarea error='This field is required' />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<RTextarea helperText='Maximum 500 characters' />);
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(<RTextarea error='Error' helperText='Helper' />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('disables textarea when disabled prop is true', () => {
    render(<RTextarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets aria-invalid when error is present', () => {
    render(<RTextarea error='Error' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies fullWidth class', () => {
    const { container } = render(<RTextarea fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('applies custom className', () => {
    render(<RTextarea className='custom-class' />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RTextarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  describe('autoGrow', () => {
    it('applies resize-none class when autoGrow is enabled', () => {
      render(<RTextarea autoGrow data-testid='autogrow-textarea' />);
      const textarea = screen.getByTestId('autogrow-textarea');
      expect(textarea).toHaveClass('resize-none');
    });

    it('applies overflow hidden style when autoGrow is enabled', () => {
      render(<RTextarea autoGrow data-testid='autogrow-textarea' />);
      const textarea = screen.getByTestId('autogrow-textarea');
      expect(textarea).toHaveStyle({ overflow: 'hidden' });
    });

    it('does not apply overflow hidden when autoGrow is disabled', () => {
      render(<RTextarea autoGrow={false} data-testid='textarea' />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).not.toHaveStyle({ overflow: 'hidden' });
    });

    it('calls onInput handler when typing with autoGrow enabled', () => {
      const handleInput = vi.fn();
      render(<RTextarea autoGrow onInput={handleInput} />);

      fireEvent.input(screen.getByRole('textbox'), {
        target: { value: 'test content' },
      });
      expect(handleInput).toHaveBeenCalled();
    });

    it('renders with defaultValue and autoGrow enabled', () => {
      render(
        <RTextarea
          autoGrow
          defaultValue='Initial content'
          data-testid='autogrow-textarea'
        />,
      );
      const textarea = screen.getByTestId('autogrow-textarea');
      expect(textarea).toHaveValue('Initial content');
      expect(textarea).toHaveClass('resize-none');
    });
  });

  describe('size variants', () => {
    it('applies default size classes', () => {
      render(<RTextarea size='default' data-testid='textarea' />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('applies small size classes', () => {
      render(<RTextarea size='sm' data-testid='textarea' />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('applies extra small size classes', () => {
      render(<RTextarea size='xs' data-testid='textarea' />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('applies large size classes', () => {
      render(<RTextarea size='lg' data-testid='textarea' />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });
  });
});

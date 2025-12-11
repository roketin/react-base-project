import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RResult } from '@/modules/app/components/base/r-result';

describe('RResult', () => {
  it('renders with empty status by default', () => {
    render(<RResult title='No Data' />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<RResult title='Title' description='Description text' />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders with success status', () => {
    render(<RResult status='success' title='Success!' />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders with error status', () => {
    render(<RResult status='error' title='Error occurred' />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders with warning status', () => {
    render(<RResult status='warning' title='Warning' />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders with info status', () => {
    render(<RResult status='info' title='Information' />);
    expect(screen.getByText('Information')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<RResult title='Complete' action={<button>Go Back</button>} />);
    expect(
      screen.getByRole('button', { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <RResult title='Result'>
        <p>Additional content</p>
      </RResult>,
    );
    expect(screen.getByText('Additional content')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(
      <RResult
        title='Custom'
        icon={<span data-testid='custom-icon'>🎉</span>}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders illustration', () => {
    render(
      <RResult
        title='Illustration'
        illustration={<img data-testid='illustration' alt='test' />}
      />,
    );
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<RResult title='With Badge' badge='NEW' />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(<RResult title='Small' size='sm' />);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<RResult title='Large' size='lg' />);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RResult title='Custom' className='custom-result' />,
    );
    expect(container.firstChild).toHaveClass('custom-result');
  });

  it('centers content by default', () => {
    const { container } = render(<RResult title='Centered' />);
    expect(container.firstChild).toHaveClass('items-center', 'text-center');
  });

  it('aligns to start when specified', () => {
    const { container } = render(<RResult title='Left' align='start' />);
    expect(container.firstChild).toHaveClass('items-start', 'text-left');
  });
});

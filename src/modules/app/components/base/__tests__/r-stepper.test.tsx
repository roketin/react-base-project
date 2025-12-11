import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RStepper, type Step } from '@/modules/app/components/base/r-stepper';

describe('RStepper', () => {
  const steps: Step[] = [
    { id: '1', label: 'Step 1' },
    { id: '2', label: 'Step 2' },
    { id: '3', label: 'Step 3' },
  ];

  it('renders all steps', () => {
    render(<RStepper steps={steps} currentIndex={0} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('shows current step highlighted', () => {
    render(<RStepper steps={steps} currentIndex={1} />);
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('renders horizontal variant by default', () => {
    const { container } = render(<RStepper steps={steps} currentIndex={0} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('renders vertical variant', () => {
    render(<RStepper steps={steps} currentIndex={0} variant='vertical' />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('renders card variant', () => {
    render(<RStepper steps={steps} currentIndex={0} variant='card' />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('renders line variant', () => {
    render(<RStepper steps={steps} currentIndex={0} variant='line' />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('calls onClick when step is clicked', () => {
    const handleClick = vi.fn();
    const clickableSteps: Step[] = [
      { id: '1', label: 'Step 1', onClick: handleClick },
      { id: '2', label: 'Step 2' },
    ];
    render(<RStepper steps={clickableSteps} currentIndex={1} />);

    fireEvent.click(screen.getByText('Step 1'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows disabled step', () => {
    const disabledSteps: Step[] = [
      { id: '1', label: 'Step 1', disabled: true },
      { id: '2', label: 'Step 2' },
    ];
    render(<RStepper steps={disabledSteps} currentIndex={0} />);
    const step1 = screen.getByText('Step 1').closest('li');
    expect(step1).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RStepper steps={steps} currentIndex={0} className='custom-stepper' />,
    );
    expect(container.firstChild).toHaveClass('custom-stepper');
  });
});

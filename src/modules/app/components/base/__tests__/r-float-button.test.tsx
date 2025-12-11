import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RFloatButton,
  RFloatButtonGroup,
  RFloatButtonMenu,
} from '@/modules/app/components/base/r-float-button';
import { Plus } from 'lucide-react';

describe('RFloatButton', () => {
  it('renders float button', () => {
    render(<RFloatButton icon={<Plus />} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<RFloatButton onClick={handleClick} icon={<Plus />} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with badge', () => {
    render(<RFloatButton icon={<Plus />} badge='5' />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with tooltip', () => {
    render(<RFloatButton icon={<Plus />} tooltip='Add item' />);
    expect(screen.getByTitle('Add item')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(
      <RFloatButton variant='secondary' icon={<Plus />} />,
    );
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();
  });

  it('disables button when disabled', () => {
    render(<RFloatButton disabled icon={<Plus />} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RFloatButton ref={ref} icon={<Plus />} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('RFloatButtonGroup', () => {
  it('renders children', () => {
    render(
      <RFloatButtonGroup>
        <RFloatButton icon={<Plus />} position='none' />
        <RFloatButton icon={<Plus />} position='none' />
      </RFloatButtonGroup>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('applies position classes', () => {
    const { container } = render(
      <RFloatButtonGroup position='bottom-left'>
        <RFloatButton icon={<Plus />} position='none' />
      </RFloatButtonGroup>,
    );
    expect(container.firstChild).toHaveClass('bottom-6', 'left-6');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <RFloatButtonGroup ref={ref}>
        <RFloatButton icon={<Plus />} position='none' />
      </RFloatButtonGroup>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('RFloatButtonMenu', () => {
  it('renders menu container', () => {
    const { container } = render(
      <RFloatButtonMenu
        mainButton={<RFloatButton icon={<Plus />} position='none' />}
      >
        <RFloatButton icon={<Plus />} position='none' />
      </RFloatButtonMenu>,
    );
    // Just verify container renders
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders main button inside menu', () => {
    render(
      <RFloatButtonMenu
        mainButton={
          <RFloatButton
            icon={<Plus />}
            position='none'
            data-testid='main-btn'
          />
        }
      >
        <RFloatButton icon={<Plus />} position='none' />
      </RFloatButtonMenu>,
    );
    expect(screen.getByTestId('main-btn')).toBeInTheDocument();
  });
});

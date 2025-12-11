import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RButtonGroup,
  RButtonGroupItem,
} from '@/modules/app/components/base/r-button-group';

describe('RButtonGroup', () => {
  it('renders with group role', () => {
    render(
      <RButtonGroup>
        <RButtonGroupItem>Button 1</RButtonGroupItem>
        <RButtonGroupItem>Button 2</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders all button items', () => {
    render(
      <RButtonGroup>
        <RButtonGroupItem>Button 1</RButtonGroupItem>
        <RButtonGroupItem>Button 2</RButtonGroupItem>
        <RButtonGroupItem>Button 3</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(
      <RButtonGroup>
        <RButtonGroupItem>Button</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('applies vertical orientation', () => {
    const { container } = render(
      <RButtonGroup orientation='vertical'>
        <RButtonGroupItem>Button</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies gap when not attached', () => {
    const { container } = render(
      <RButtonGroup attached={false}>
        <RButtonGroupItem>Button 1</RButtonGroupItem>
        <RButtonGroupItem>Button 2</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(container.firstChild).toHaveClass('gap-2');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RButtonGroup className='custom-group'>
        <RButtonGroupItem>Button</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(container.firstChild).toHaveClass('custom-group');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <RButtonGroup ref={ref}>
        <RButtonGroupItem>Button</RButtonGroupItem>
      </RButtonGroup>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('RButtonGroupItem', () => {
  it('renders button', () => {
    render(<RButtonGroupItem>Click Me</RButtonGroupItem>);
    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<RButtonGroupItem onClick={handleClick}>Click</RButtonGroupItem>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows active state', () => {
    render(<RButtonGroupItem active>Active</RButtonGroupItem>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('disables button', () => {
    render(<RButtonGroupItem disabled>Disabled</RButtonGroupItem>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<RButtonGroupItem className='custom-item'>Item</RButtonGroupItem>);
    expect(screen.getByRole('button')).toHaveClass('custom-item');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<RButtonGroupItem ref={ref}>Button</RButtonGroupItem>);
    expect(ref).toHaveBeenCalled();
  });
});

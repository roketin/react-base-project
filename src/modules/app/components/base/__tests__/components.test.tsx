import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RBtn from '../r-btn';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import { RCheckbox } from '../r-checkbox';
import { RRadioGroup, RRadio } from '../r-radio-group';
import { RLabel } from '../r-label';
import { RSwitch } from '../r-switch';
import { RSlider } from '../r-slider';
import { RBadge } from '../r-badge';
import { RSeparator } from '../r-separator';
import { RSkeleton } from '../r-skeleton';

import { RPagination } from '../r-pagination';
import { RTable, RThead, RTbody, RTr, RTh, RTd } from '../r-simple-table';
import { RProgress, RProgressCircular } from '../r-progress';

describe('Base Components', () => {
  describe('RLabel', () => {
    it('renders label with text', () => {
      render(<RLabel>Label Text</RLabel>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<RLabel variant='default'>Default</RLabel>);
      expect(screen.getByText('Default')).toBeInTheDocument();

      rerender(<RLabel variant='error'>Error</RLabel>);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      const { container } = render(<RLabel required>Required Field</RLabel>);
      expect(container.querySelector('label')).toHaveClass(
        "after:content-['*']",
      );
    });

    it('associates with input via htmlFor', () => {
      render(
        <>
          <RLabel htmlFor='test-input'>Test Label</RLabel>
          <input id='test-input' />
        </>,
      );
      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-input');
    });
  });

  describe('RBtn', () => {
    it('renders button with text', () => {
      render(<RBtn>Click Me</RBtn>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<RBtn variant='default'>Default</RBtn>);
      expect(screen.getByText('Default')).toBeInTheDocument();

      rerender(<RBtn variant='destructive'>Destructive</RBtn>);
      expect(screen.getByText('Destructive')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<RBtn loading>Submit</RBtn>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('RInput', () => {
    it('renders input with label', () => {
      render(<RInput label='Email' placeholder='Enter email' />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<RInput label='Email' error='Email is required' />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows helper text', () => {
      render(<RInput label='Username' helperText='Min 3 characters' />);
      expect(screen.getByText('Min 3 characters')).toBeInTheDocument();
    });
  });

  describe('RTextarea', () => {
    it('renders textarea with label', () => {
      render(<RTextarea label='Description' placeholder='Enter description' />);
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<RTextarea label='Message' error='Message is required' />);
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  describe('RCheckbox', () => {
    it('renders checkbox with label', () => {
      render(<RCheckbox label='Accept terms' />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<RCheckbox label='Terms' error='You must accept' />);
      expect(screen.getByText('You must accept')).toBeInTheDocument();
    });

    it('can be checked', () => {
      render(<RCheckbox label='Subscribe' checked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('RRadioGroup', () => {
    it('renders radio group with options', () => {
      render(
        <RRadioGroup name='plan' label='Choose plan'>
          <RRadio value='free' label='Free' />
          <RRadio value='pro' label='Pro' />
        </RRadioGroup>,
      );
      expect(screen.getByText('Choose plan')).toBeInTheDocument();
      expect(screen.getByLabelText('Free')).toBeInTheDocument();
      expect(screen.getByLabelText('Pro')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(
        <RRadioGroup name='plan' error='Please select a plan'>
          <RRadio value='free' label='Free' />
        </RRadioGroup>,
      );
      expect(screen.getByText('Please select a plan')).toBeInTheDocument();
    });
  });

  describe('RSwitch', () => {
    it('renders switch with label', () => {
      render(<RSwitch label='Enable notifications' />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<RSwitch label='Accept terms' error='Required' />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('can be checked', () => {
      render(<RSwitch label='Toggle' checked />);
      const switchInput = screen.getByRole('checkbox');
      expect(switchInput).toBeChecked();
    });
  });

  describe('RSlider', () => {
    it('renders slider with label', () => {
      render(<RSlider label='Volume' />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<RSlider label='Volume' error='Too high' />);
      expect(screen.getByText('Too high')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<RSlider label='Volume' value={75} showValue />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  describe('RBadge', () => {
    it('renders badge with text', () => {
      render(<RBadge>Badge Text</RBadge>);
      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<RBadge variant='default'>Default</RBadge>);
      expect(screen.getByText('Default')).toBeInTheDocument();

      rerender(<RBadge variant='success'>Success</RBadge>);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('renders removable badge', () => {
      render(
        <RBadge removable onRemove={() => {}}>
          Removable
        </RBadge>,
      );
      expect(screen.getByText('Removable')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });
  });

  describe('RSeparator', () => {
    it('renders separator', () => {
      const { container } = render(<RSeparator />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders with vertical orientation', () => {
      const { container } = render(<RSeparator orientation='vertical' />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('w-px');
    });
  });

  describe('RSkeleton', () => {
    it('renders skeleton', () => {
      const { container } = render(<RSkeleton />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders with circular variant', () => {
      const { container } = render(<RSkeleton variant='circular' />);
      const skeleton = container.querySelector('div');
      expect(skeleton).toHaveClass('rounded-full');
    });
  });

  describe('RPagination', () => {
    it('renders pagination', () => {
      render(
        <RPagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
      );
      expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    });

    it('shows current page', () => {
      render(
        <RPagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
      );
      const currentPage = screen.getByLabelText('Go to page 3');
      expect(currentPage).toBeInTheDocument();
    });
  });

  describe('RTable', () => {
    it('renders table', () => {
      render(
        <RTable>
          <RThead>
            <RTr>
              <RTh>Header</RTh>
            </RTr>
          </RThead>
          <RTbody>
            <RTr>
              <RTd>Cell</RTd>
            </RTr>
          </RTbody>
        </RTable>,
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });
  });

  describe('RProgress', () => {
    it('renders progress bar', () => {
      const { container } = render(<RProgress value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('shows value when showValue is true', () => {
      render(<RProgress value={75} showValue />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { container } = render(<RProgress value={50} variant='success' />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('RProgressCircular', () => {
    it('renders circular progress', () => {
      const { container } = render(<RProgressCircular value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('shows value when showValue is true', () => {
      render(<RProgressCircular value={75} showValue />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders indeterminate state', () => {
      const { container } = render(<RProgressCircular indeterminate />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });
  });
});

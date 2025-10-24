import { RStepper, type Step } from '@/modules/app/components/base/r-stepper';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const baseSteps: Step[] = [
  { id: '1', label: 'Initialize' },
  { id: '2', label: 'Configure', loading: false },
  { id: '3', label: 'Validate', disabled: false },
  { id: '4', label: 'Complete', disabled: false },
];

const meta: Meta<typeof RStepper> = {
  title: 'Base/RStepper',
  component: RStepper,
  tags: ['autodocs'],
  argTypes: {
    steps: {
      control: 'object',
    },
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical', 'minimal', 'card', 'line'],
    },
    currentIndex: {
      control: { type: 'number', min: 0 },
    },
    className: {
      control: 'text',
    },
  },
  args: {
    steps: baseSteps,
    className: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof RStepper>;

// Helper component to create interactive stories
const StepperWrapper = ({ variant }: { variant: any }) => {
  const [index, setIndex] = useState(0);
  const [steps] = useState<Step[]>([
    { id: '1', label: 'Initialize' },
    { id: '2', label: 'Configure', loading: false },
    { id: '3', label: 'Validate', disabled: false },
    { id: '4', label: 'Complete', disabled: false },
  ]);

  const handleClick = (i: number, step: Step) => {
    if (step.disabled) return;
    setIndex(i);
  };

  return (
    <div className='p-6 bg-gray-50'>
      <RStepper
        variant={variant}
        steps={steps.map((s, i) => ({
          ...s,
          onClick: handleClick,
          loading: i === 1 && index === 1, // demo loading state
        }))}
        currentIndex={index}
        className='bg-white rounded-xl p-4 shadow-sm'
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    currentIndex: 1,
  },
};

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    currentIndex: 2,
  },
};

export const Card: Story = {
  render: () => <StepperWrapper variant='card' />,
};

export const Minimal: Story = {
  render: () => <StepperWrapper variant='minimal' />,
};

export const Line: Story = {
  render: () => <StepperWrapper variant='line' />,
};

export const WithDisabledAndLoading: Story = {
  args: {
    steps: [
      { id: '1', label: 'Start', onClick: () => console.log('Clicked Step 1') },
      { id: '2', label: 'In Progress', loading: true },
      { id: '3', label: 'Disabled Step', disabled: true },
      { id: '4', label: 'Finish' },
    ],
    currentIndex: 1,
    variant: 'horizontal',
  },
};

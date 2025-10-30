import type { Meta, StoryObj } from '@storybook/react-vite';
import { RTextarea } from '../r-textarea';

const meta: Meta<typeof RTextarea> = {
  title: 'Base/Form/RTextarea',
  component: RTextarea,
  tags: ['autodocs'],
  args: {
    label: 'Summary',
    placeholder: 'Describe the update you shipped this week…',
    rows: 4,
    showCount: true,
    countLimit: 280,
    description:
      'Share context about recent work. Character count shown below.',
  },
};

export default meta;

type Story = StoryObj<typeof RTextarea>;

export const Playground: Story = {};

export const WordCounting: Story = {
  args: {
    label: 'Meeting agenda',
    rows: 5,
    countType: 'word',
    showCount: true,
    defaultValue:
      'Discuss launch timeline Draft press release Review QA findings',
    description: 'Word count is useful for agendas or checklists.',
  },
};

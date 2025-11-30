import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppBootstrapLoading } from '../app-bootstrap-loading';

const meta: Meta<typeof AppBootstrapLoading> = {
  title: 'Components/Other/AppBootstrapLoading',
  component: AppBootstrapLoading,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AppBootstrapLoading>;

export const Default: Story = {};

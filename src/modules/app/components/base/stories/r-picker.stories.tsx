import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';

import { RPicker, type RPickerProps } from '../r-picker';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const meta: Meta<typeof RPicker> = {
  title: 'Base/Form/RPicker',
  component: RPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    picker: {
      control: 'select',
      options: ['date', 'week', 'month', 'quarter', 'year'],
    },
    showNow: { control: 'boolean' },
    disabled: { control: 'boolean' },
    format: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    picker: 'date',
    format: 'DD-MM-YYYY',
    showNow: true,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof RPicker>;

const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? dayjs());

    return (
      <RPicker
        {...(args as RPickerProps)}
        value={value}
        onChange={(next) => {
          setValue(next ?? null);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const DatePicker: Story = {
  ...Template,
};

export const MonthPicker: Story = {
  ...Template,
  args: {
    picker: 'month',
    format: 'MMMM YYYY',
    value: dayjs(),
  },
};

export const WeekPicker: Story = {
  ...Template,
  args: {
    picker: 'week',
    format: "'[Week\] WW, YYYY",
    value: dayjs(),
  },
};

export const YearPicker: Story = {
  ...Template,
  args: {
    picker: 'year',
    format: 'YYYY',
    value: dayjs(),
  },
};

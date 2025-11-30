import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { RRangePicker, type TRRangePickerProps } from '../r-range-picker';

dayjs.extend(isoWeek);

const meta: Meta<typeof RRangePicker> = {
  title: 'Components/Form Controls/RRangePicker',
  component: RRangePicker,
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
    allowClear: { control: 'boolean' },
    format: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    picker: 'date',
    format: 'DD-MM-YYYY',
    showNow: true,
    allowClear: true,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof RRangePicker>;

const Template: Story = {
  render: (args) => {
    const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>([
      dayjs().startOf('day'),
      dayjs().add(7, 'day'),
    ]);

    return (
      <RRangePicker
        {...(args as TRRangePickerProps)}
        value={value}
        onChange={(next) => {
          setValue(next ?? null);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const DateRange: Story = {
  ...Template,
};

export const MonthRange: Story = {
  ...Template,
  args: {
    picker: 'month',
    format: 'MMMM YYYY',
    value: [dayjs().startOf('month'), dayjs().add(3, 'month')],
  },
};

export const WeekRange: Story = {
  ...Template,
  args: {
    picker: 'week',
    format: "'[Week\] WW, YYYY",
    value: [dayjs().startOf('week'), dayjs().add(2, 'week')],
  },
};

export const DisabledRange: Story = {
  ...Template,
  args: {
    disabled: true,
    value: [dayjs().subtract(1, 'week'), dayjs()],
  },
};

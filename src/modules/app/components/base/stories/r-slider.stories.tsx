import type { Meta, StoryObj } from '@storybook/react-vite';
import { RSlider } from '../r-slider';
import { useState } from 'react';

const meta = {
  title: 'Components/Form Controls/RSlider',
  component: RSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Volume',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Brightness',
    showValue: true,
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Temperature',
    showValue: true,
    showMinMax: true,
    min: 0,
    max: 100,
  },
};

export const CustomRange: Story = {
  args: {
    label: 'Price',
    showValue: true,
    showMinMax: true,
    min: 0,
    max: 1000,
    step: 10,
    defaultValue: 500,
  },
};

export const WithFormatter: Story = {
  args: {
    label: 'Price',
    showValue: true,
    showMinMax: true,
    min: 0,
    max: 1000,
    step: 10,
    defaultValue: 500,
    formatValue: (val) => `$${val}`,
  },
};

export const WithError: Story = {
  args: {
    label: 'Volume',
    showValue: true,
    error: 'Volume is too high',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Opacity',
    showValue: true,
    helperText: 'Adjust the opacity level',
    min: 0,
    max: 100,
    defaultValue: 80,
    formatValue: (val) => `${val}%`,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled slider',
    showValue: true,
    disabled: true,
    defaultValue: 50,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div className='w-80 space-y-4'>
        <RSlider
          label='Volume'
          value={value}
          onValueChange={setValue}
          showValue
          showMinMax
        />
        <p className='text-sm text-slate-600'>Current value: {value}</p>
      </div>
    );
  },
};

export const PercentageSlider: Story = {
  render: () => {
    const [percentage, setPercentage] = useState(75);
    return (
      <div className='w-80'>
        <RSlider
          label='Completion'
          value={percentage}
          onValueChange={setPercentage}
          min={0}
          max={100}
          step={1}
          showValue
          showMinMax
          formatValue={(val) => `${val}%`}
        />
      </div>
    );
  },
};

export const PriceSlider: Story = {
  render: () => {
    const [price, setPrice] = useState(500);
    return (
      <div className='w-80'>
        <RSlider
          label='Budget'
          value={price}
          onValueChange={setPrice}
          min={0}
          max={5000}
          step={50}
          showValue
          showMinMax
          formatValue={(val) => `$${val.toLocaleString()}`}
          helperText='Set your maximum budget'
        />
      </div>
    );
  },
};

export const TemperatureSlider: Story = {
  render: () => {
    const [temp, setTemp] = useState(22);
    return (
      <div className='w-80'>
        <RSlider
          label='Temperature'
          value={temp}
          onValueChange={setTemp}
          min={16}
          max={30}
          step={0.5}
          showValue
          showMinMax
          formatValue={(val) => `${val}°C`}
          helperText='Adjust room temperature'
        />
      </div>
    );
  },
};

export const MultipleSliders: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      volume: 70,
      brightness: 80,
      contrast: 50,
    });

    return (
      <div className='w-80 space-y-6'>
        <h3 className='text-lg font-semibold'>Display Settings</h3>
        <RSlider
          label='Volume'
          value={settings.volume}
          onValueChange={(val) => setSettings({ ...settings, volume: val })}
          showValue
          formatValue={(val) => `${val}%`}
        />
        <RSlider
          label='Brightness'
          value={settings.brightness}
          onValueChange={(val) => setSettings({ ...settings, brightness: val })}
          showValue
          formatValue={(val) => `${val}%`}
        />
        <RSlider
          label='Contrast'
          value={settings.contrast}
          onValueChange={(val) => setSettings({ ...settings, contrast: val })}
          showValue
          formatValue={(val) => `${val}%`}
        />
      </div>
    );
  },
};

export const RangeSlider: Story = {
  render: () => {
    const [age, setAge] = useState(25);
    return (
      <div className='w-80'>
        <RSlider
          label='Age'
          value={age}
          onValueChange={setAge}
          min={18}
          max={100}
          step={1}
          showValue
          showMinMax
          formatValue={(val) => `${val} years`}
        />
      </div>
    );
  },
};

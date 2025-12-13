import type { Meta, StoryObj } from '@storybook/react-vite';
import { RAlert } from '../r-alert';
import { useState } from 'react';
import RBtn from '../r-btn';
import { Rocket } from 'lucide-react';

const meta = {
  title: 'Components/Feedback/RAlert',
  component: RAlert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Alert',
    description: 'This is a default alert message.',
  },
  decorators: [
    (Story) => (
      <div className='w-[400px]'>
        <Story />
      </div>
    ),
  ],
};

export const Variants: Story = {
  render: () => (
    <div className='w-[450px] space-y-4'>
      <RAlert
        variant='default'
        title='Default'
        description='This is a default alert for general information.'
      />
      <RAlert
        variant='info'
        title='Information'
        description='This is an informational alert message.'
      />
      <RAlert
        variant='success'
        title='Success'
        description='Your action has been completed successfully.'
      />
      <RAlert
        variant='warning'
        title='Warning'
        description='Please review this important warning message.'
      />
      <RAlert
        variant='error'
        title='Error'
        description='An error occurred while processing your request.'
      />
    </div>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <div className='w-[450px] space-y-4'>
      <RAlert
        variant='info'
        description='This alert has no title, only description.'
      />
      <RAlert
        variant='success'
        description='Operation completed successfully!'
      />
      <RAlert
        variant='warning'
        description='Your session will expire in 5 minutes.'
      />
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <div className='w-[450px] space-y-4'>
      <RAlert
        variant='info'
        icon={null}
        title='No Icon'
        description='This alert has no icon displayed.'
      />
      <RAlert
        variant='success'
        icon={null}
        title='Clean Look'
        description='Sometimes you want a cleaner appearance.'
      />
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div className='w-[450px] space-y-4'>
      <RAlert
        variant='info'
        icon={<Rocket className='h-5 w-5 text-blue-600' />}
        title='New Feature'
        description='Check out our latest feature release!'
      />
    </div>
  ),
};

export const Closable: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      {
        id: 1,
        variant: 'info' as const,
        title: 'Info',
        description: 'Click X to dismiss this alert.',
      },
      {
        id: 2,
        variant: 'success' as const,
        title: 'Success',
        description: 'This alert can be closed.',
      },
      {
        id: 3,
        variant: 'warning' as const,
        title: 'Warning',
        description: 'Dismissible warning message.',
      },
    ]);

    return (
      <div className='w-[450px] space-y-4'>
        {alerts.map((alert) => (
          <RAlert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            closable
            onClose={() => setAlerts(alerts.filter((a) => a.id !== alert.id))}
          />
        ))}
        {alerts.length === 0 && (
          <p className='text-center text-slate-500'>All alerts dismissed</p>
        )}
      </div>
    );
  },
};

export const WithAction: Story = {
  render: () => (
    <div className='w-[450px] space-y-4'>
      <RAlert
        variant='info'
        title='Update Available'
        description='A new version is available. Would you like to update now?'
        action={
          <div className='flex gap-2'>
            <RBtn size='sm'>Update Now</RBtn>
            <RBtn size='sm' variant='outline'>
              Later
            </RBtn>
          </div>
        }
      />
      <RAlert
        variant='warning'
        title='Subscription Expiring'
        description='Your subscription will expire in 3 days.'
        action={
          <RBtn size='sm' variant='soft-warning'>
            Renew Subscription
          </RBtn>
        }
      />
      <RAlert
        variant='error'
        title='Payment Failed'
        description='We could not process your payment. Please update your payment method.'
        action={
          <RBtn size='sm' variant='soft-destructive'>
            Update Payment
          </RBtn>
        }
      />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <div className='w-[450px]'>
      <RAlert variant='info' title='System Requirements'>
        <ul className='list-disc list-inside mt-2 space-y-1'>
          <li>Node.js 18 or higher</li>
          <li>npm 9 or higher</li>
          <li>At least 4GB RAM</li>
        </ul>
      </RAlert>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className='w-[450px]'>
      <RAlert
        variant='warning'
        title='Important Notice'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        closable
      />
    </div>
  ),
};

export const InlineAlerts: Story = {
  render: () => (
    <div className='w-[600px] space-y-6'>
      <div className='p-4 border rounded-lg space-y-4'>
        <h3 className='font-semibold'>Form Validation</h3>
        <RAlert
          variant='error'
          description='Please fix the following errors before submitting.'
        />
        <div className='space-y-2'>
          <input
            type='text'
            placeholder='Email'
            className='w-full px-3 py-2 border rounded-md'
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full px-3 py-2 border rounded-md'
          />
        </div>
      </div>

      <div className='p-4 border rounded-lg space-y-4'>
        <h3 className='font-semibold'>Success State</h3>
        <RAlert
          variant='success'
          title='Profile Updated'
          description='Your profile has been updated successfully.'
        />
      </div>
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className='w-[450px] space-y-4'>
        <RBtn onClick={() => setVisible(!visible)}>
          {visible ? 'Hide' : 'Show'} Alert
        </RBtn>

        <RAlert
          variant='info'
          title='Fade Animation'
          description='This alert fades in and out.'
          animate='fade'
          visible={visible}
        />
      </div>
    );
  },
};

export const AnimationVariants: Story = {
  render: () => {
    const [visibleAlerts, setVisibleAlerts] = useState<Record<string, boolean>>(
      {
        fade: true,
        'slide-up': true,
        'slide-down': true,
        'slide-left': true,
        'slide-right': true,
        scale: true,
      },
    );

    const toggleAlert = (key: string) => {
      setVisibleAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className='w-[500px] space-y-6'>
        <div className='flex flex-wrap gap-2'>
          {Object.keys(visibleAlerts).map((key) => (
            <RBtn
              key={key}
              size='sm'
              variant={visibleAlerts[key] ? 'default' : 'outline'}
              onClick={() => toggleAlert(key)}
            >
              {key}
            </RBtn>
          ))}
        </div>

        <div className='space-y-4'>
          <RAlert
            variant='info'
            title='Fade'
            description='Simple fade animation'
            animate='fade'
            visible={visibleAlerts.fade}
          />
          <RAlert
            variant='success'
            title='Slide Up'
            description='Slides up from below'
            animate='slide-up'
            visible={visibleAlerts['slide-up']}
          />
          <RAlert
            variant='warning'
            title='Slide Down'
            description='Slides down from above'
            animate='slide-down'
            visible={visibleAlerts['slide-down']}
          />
          <RAlert
            variant='error'
            title='Slide Left'
            description='Slides in from the right'
            animate='slide-left'
            visible={visibleAlerts['slide-left']}
          />
          <RAlert
            variant='default'
            title='Slide Right'
            description='Slides in from the left'
            animate='slide-right'
            visible={visibleAlerts['slide-right']}
          />
          <RAlert
            variant='info'
            title='Scale'
            description='Scales up from smaller size'
            animate='scale'
            visible={visibleAlerts.scale}
          />
        </div>
      </div>
    );
  },
};

export const AnimatedClosable: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'info' as const, title: 'Info Alert' },
      { id: 2, variant: 'success' as const, title: 'Success Alert' },
      { id: 3, variant: 'warning' as const, title: 'Warning Alert' },
    ]);

    const removeAlert = (id: number) => {
      setAlerts(alerts.filter((a) => a.id !== id));
    };

    const resetAlerts = () => {
      setAlerts([
        { id: 1, variant: 'info' as const, title: 'Info Alert' },
        { id: 2, variant: 'success' as const, title: 'Success Alert' },
        { id: 3, variant: 'warning' as const, title: 'Warning Alert' },
      ]);
    };

    return (
      <div className='w-[450px] space-y-4'>
        <RBtn onClick={resetAlerts} variant='outline' size='sm'>
          Reset Alerts
        </RBtn>

        <div className='space-y-3'>
          {alerts.map((alert) => (
            <RAlert
              key={alert.id}
              variant={alert.variant}
              title={alert.title}
              description='Click X to dismiss with animation'
              closable
              animate='slide-left'
              visible={true}
              onClose={() => removeAlert(alert.id)}
            />
          ))}
        </div>

        {alerts.length === 0 && (
          <p className='text-center text-muted-foreground'>
            All alerts dismissed
          </p>
        )}
      </div>
    );
  },
};

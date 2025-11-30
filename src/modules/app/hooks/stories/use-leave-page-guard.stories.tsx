import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo } from 'react';
import { RInput } from '@/modules/app/components/base/r-input';
import {
  RouterProvider,
  createMemoryRouter,
  useNavigate,
} from 'react-router-dom';
import { useDirtyTracker, useLeavePageGuard } from '../use-leave-page-guard';
import RBtn from '@/modules/app/components/base/r-btn';

const meta: Meta = {
  title: 'Hooks/useLeavePageGuard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const DemoForm = () => {
  const dirty = useDirtyTracker({ initialValue: '' });
  const guard = useLeavePageGuard({
    enabled: dirty.isDirty,
    message: 'You have unsaved input. Are you sure you want to leave?',
    alertConfig: {
      title: 'Unsaved changes',
      description: 'Leaving this view will discard your progress.',
      okText: 'Discard changes',
      cancelText: 'Continue editing',
    },
  });
  const navigate = useNavigate();

  const withGuard = useCallback(
    async (action: () => void) => {
      const approve = await guard.confirmNavigation();
      if (approve) {
        action();
      }
    },
    [guard],
  );

  return (
    <div className='flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border/60 bg-background p-6'>
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold'>Leave page guard demo</h2>
        <p className='text-sm text-muted-foreground'>
          Type something and try the RBtns to trigger the guard.
        </p>
      </div>

      <RInput
        placeholder='Type to make form dirty…'
        value={dirty.current}
        onChange={(event) => dirty.updateCurrent(event.target.value)}
      />

      <div className='flex flex-wrap gap-2'>
        <RBtn
          onClick={() =>
            withGuard(() => {
              dirty.resetBaseline();
              navigate('/guard-demo/confirmation');
            })
          }
        >
          Navigate to confirmation
        </RBtn>
        <RBtn
          variant='outline'
          onClick={dirty.resetBaseline}
          disabled={!dirty.isDirty}
        >
          Mark as saved
        </RBtn>
      </div>

      <div className='rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground'>
        <p>Dirty state: {dirty.isDirty ? 'Yes' : 'No'}</p>
        <p>Can safely leave: {guard.canSafelyLeave ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

const ConfirmationView = () => {
  const navigate = useNavigate();
  return (
    <div className='flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border/60 bg-background p-6'>
      <div className='space-y-1 text-center'>
        <h2 className='text-lg font-semibold'>Navigation confirmed</h2>
        <p className='text-sm text-muted-foreground'>
          The guard allowed navigation to complete successfully.
        </p>
      </div>
      <RBtn onClick={() => navigate('/guard-demo')}>
        Return to guarded form
      </RBtn>
    </div>
  );
};

const DemoRouter = () => {
  const router = useMemo(
    () =>
      createMemoryRouter(
        [
          { path: '/guard-demo', element: <DemoForm /> },
          {
            path: '/guard-demo/confirmation',
            element: <ConfirmationView />,
          },
        ],
        { initialEntries: ['/guard-demo'] },
      ),
    [],
  );
  return <RouterProvider router={router} />;
};

export const Playground: Story = {
  render: () => <DemoRouter />,
};

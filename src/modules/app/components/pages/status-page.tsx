import type { ReactNode } from 'react';
import {
  RResult,
  type TRResultStatus,
} from '@/modules/app/components/base/r-result';
import { cn } from '@/modules/app/libs/utils';
import { useTheme } from '@/modules/app/hooks/use-theme';

type StatusPageProps = {
  code?: string;
  title: string;
  description: string;
  action?: ReactNode;
  status?: TRResultStatus;
  brand?: ReactNode;
  className?: string;
};

const StatusPage = ({
  code,
  title,
  description,
  action,
  status = 'info',
  className,
}: StatusPageProps) => {
  // Initialize theme
  useTheme();

  return (
    <div
      className={cn(
        'h-full min-h-screen w-full px-6 py-16',
        'flex items-center justify-center',
        className,
      )}
    >
      <div className='flex w-full max-w-xl flex-col items-center gap-8 text-center'>
        <RResult
          status={status}
          badge={
            code ? (
              <div className='inline-flex items-center justify-center rounded-full bg-destructive/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-destructive'>
                {code}
              </div>
            ) : null
          }
          title={title}
          description={description}
          action={action}
          align='center'
          size='md'
        />
      </div>
    </div>
  );
};

export default StatusPage;

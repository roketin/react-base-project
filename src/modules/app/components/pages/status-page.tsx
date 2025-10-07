import type { ReactNode } from 'react';

type StatusPageProps = {
  code?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

const StatusPage = ({ code, title, description, action }: StatusPageProps) => {
  return (
    <div className='grid min-h-[60vh] place-items-center px-4 py-16 text-center'>
      <div className='space-y-6 max-w-md'>
        {code && (
          <span className='inline-flex items-center justify-center rounded-full bg-destructive/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-destructive'>
            {code}
          </span>
        )}
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold'>{title}</h1>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        {action && <div className='flex justify-center'>{action}</div>}
      </div>
    </div>
  );
};

export default StatusPage;

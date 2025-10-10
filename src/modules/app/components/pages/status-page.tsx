import { RBrand } from '@/modules/app/components/base/r-brand';
import type { ReactNode } from 'react';

type StatusPageProps = {
  code?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

const StatusPage = ({ code, title, description, action }: StatusPageProps) => {
  return (
    <div className='h-full flex items-center justify-center px-4 text-center bg-pattern'>
      <div className='space-y-6 max-w-md bg-background/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm p-16 rounded-lg shadow-xl shadow-gray-100 relative z-10'>
        <div>
          <RBrand className='mx-auto inline-flex' />
        </div>
        {code && (
          <div className='inline-flex items-center justify-center rounded-full bg-destructive/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-destructive'>
            {code}
          </div>
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

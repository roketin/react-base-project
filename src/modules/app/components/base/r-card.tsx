import { cn } from '@/modules/app/libs/utils';
import React from 'react';

type TRCardProps = {
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const RCard: React.FC<TRCardProps> = ({
  header,
  title,
  description,
  action,
  children,
  footer,
  className,
}) => (
  <div
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className,
    )}
  >
    {(header || title || description || action) && (
      <div className='flex flex-col space-y-1.5 p-6'>
        {header}
        {title && (
          <h3 className='text-2xl font-semibold leading-none tracking-tight'>
            {title}
          </h3>
        )}
        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
        {action && <div className='flex items-center gap-2'>{action}</div>}
      </div>
    )}
    {children && <div className='p-6 pt-0'>{children}</div>}
    {footer && <div className='flex items-center p-6 pt-0'>{footer}</div>}
  </div>
);

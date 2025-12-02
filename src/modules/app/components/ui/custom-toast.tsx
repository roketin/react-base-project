import {
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Circle,
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { cn } from '@/modules/app/libs/utils';
import { RProgress } from '@/modules/app/components/base/r-progress';

type CustomToastProps = {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  toastId: string | number;
};

export const CustomToast = ({
  title,
  description,
  variant = 'error',
  duration = 4000,
  toastId,
}: CustomToastProps) => {
  const handleClose = () => {
    sonnerToast.dismiss(toastId);
  };

  const variantStyles = {
    default: 'border-primary/20',
    success: 'border-green-600/20',
    warning: 'border-yellow-600/20',
    error: 'border-red-600/20',
    info: 'border-blue-600/20',
  };

  const variantIcons = {
    default: <Circle className='h-5 w-5 text-primary' />,
    success: <CheckCircle2 className='h-5 w-5 text-green-600' />,
    warning: <AlertTriangle className='h-5 w-5 text-yellow-600' />,
    error: <AlertCircle className='h-5 w-5 text-red-600' />,
    info: <Info className='h-5 w-5 text-blue-600' />,
  };

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border bg-background p-4 shadow-lg',
        variantStyles[variant],
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3 flex-1'>
          <div className='shrink-0 mt-0.5'>{variantIcons[variant]}</div>
          <div className='flex-1 space-y-1'>
            <div className='font-semibold text-sm'>{title}</div>
            {description && (
              <div className='text-sm text-muted-foreground whitespace-pre-line'>
                {description}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className='cursor-pointer  shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>
      </div>
      <div className='mt-3'>
        <RProgress
          variant={variant}
          size='sm'
          autoAnimate
          animationDuration={duration}
        />
      </div>
    </div>
  );
};

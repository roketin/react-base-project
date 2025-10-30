import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/app/components/ui/tooltip';
import { cn } from '@/modules/app/libs/utils';

type RTooltipRenderArgs = {
  open: boolean;
};

type RTooltipProps = {
  content: ReactNode | ((args: RTooltipRenderArgs) => ReactNode);
  children: ReactNode;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  avoidCollisions?: boolean;
  withArrow?: boolean;
  className?: string;
  contentClassName?: string;
  sideOffset?: number;
  alignOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

function RTooltip({
  content,
  children,
  delayDuration = 80,
  side = 'top',
  align = 'center',
  avoidCollisions = true,
  withArrow = true,
  className,
  contentClassName,
  sideOffset = 4,
  alignOffset = 0,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
}: RTooltipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const actualOpen = open ?? internalOpen;

  if (!children) {
    return null;
  }

  const handleOpenChange = (next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const trigger = (
    <TooltipTrigger
      asChild
      data-disabled={disabled ? 'true' : undefined}
      className={className}
    >
      {children}
    </TooltipTrigger>
  );

  const renderContent =
    typeof content === 'function'
      ? (state: RTooltipRenderArgs) => content(state)
      : () => content;

  return (
    <TooltipProvider delayDuration={disabled ? 0 : delayDuration}>
      <Tooltip
        open={disabled ? false : actualOpen}
        defaultOpen={disabled ? false : defaultOpen}
        onOpenChange={disabled ? undefined : handleOpenChange}
      >
        {trigger}
        {!disabled ? (
          <TooltipContent
            withArrow={withArrow}
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            className={cn('max-w-xs text-left leading-snug', contentClassName)}
          >
            {renderContent({ open: actualOpen })}
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  );
}

export type { RTooltipProps };
export { RTooltip };

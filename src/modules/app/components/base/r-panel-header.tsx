import { type ReactNode, useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

import RBtn from '@/modules/app/components/base/r-btn';
import { cn } from '@/modules/app/libs/utils';
import { buttonVariants } from '@/modules/app/libs/ui-variants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/modules/app/components/ui/dropdown-menu';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonSize = VariantProps<typeof buttonVariants>['size'];
type IconPlacement = 'start' | 'end';

type ActionButtonConfig<TPayload = unknown> = {
  label?: string;
  icon?: ReactNode;
  iconPlacement?: IconPlacement;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  payload?: TPayload;
};

type CloseButtonConfig<TPayload = unknown> = ActionButtonConfig<TPayload>;

type OkButtonConfig<TPayload = unknown> = ActionButtonConfig<TPayload> & {
  loadingIcon?: ReactNode;
};

export type TRPanelHeaderProps<TPayload = unknown> = {
  title: string | ReactNode;
  className?: string;
  id?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  loading?: boolean;
  showClose?: boolean;
  showCancel?: boolean;
  showOk?: boolean;
  closeButton?: CloseButtonConfig<TPayload>;
  cancelButton?: ActionButtonConfig<TPayload>;
  okButton?: OkButtonConfig<TPayload>;
  /** Custom actions to render on the right side (replaces default buttons) */
  actions?: ReactNode;
  /** Custom left content to render (replaces close button and title) */
  leftContent?: ReactNode;
  /** Make header sticky at the top */
  sticky?: boolean;
  /** Offset from top when sticky (default: 0) */
  stickyOffset?: number;
  /** Z-index for sticky header (default: 40) */
  zIndex?: number;
  /** Additional class names to apply when sticky is active */
  stickyClassName?: string;
  /** Enable responsive mode with dropdown menu on mobile (default: false) */
  responsive?: boolean;
};

export function RPanelHeader<TPayload = unknown>({
  title,
  className,
  id,
  onClose,
  onCancel,
  onOk,
  showClose = false,
  showCancel = false,
  showOk = false,
  loading = false,
  closeButton,
  cancelButton,
  okButton,
  actions,
  leftContent,
  sticky = false,
  stickyOffset = 0,
  zIndex = 40,
  stickyClassName,
  responsive = false,
}: TRPanelHeaderProps<TPayload>) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sticky || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: [0, 1],
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [sticky]);
  const closeLabel = closeButton?.label ?? 'Close';
  const closeIconNode = closeButton?.icon ?? <ArrowLeft className='size-4' />;
  const closeVariant = closeButton?.variant ?? 'outline';
  const closeSize = closeButton?.size ?? 'icon';
  const closeIconPlacement = closeButton?.iconPlacement ?? 'start';
  const closeDisabled = closeButton?.disabled ?? false;

  const cancelLabel = cancelButton?.label ?? 'Cancel';
  const cancelIcon = cancelButton?.icon ?? null;
  const cancelVariant = cancelButton?.variant ?? 'outline';
  const cancelSize = cancelButton?.size ?? 'default';
  const cancelIconPlacement = cancelButton?.iconPlacement ?? 'start';
  const cancelDisabled = cancelButton?.disabled ?? false;

  const okLabel = okButton?.label ?? 'Ok';
  const okIcon = okButton?.icon ?? null;
  const okVariant = okButton?.variant ?? 'default';
  const okSize = okButton?.size ?? 'default';
  const okIconPlacement = okButton?.iconPlacement ?? 'end';

  const okDisabled = okButton?.disabled ?? false;

  const closeIconStart =
    closeSize === 'icon'
      ? undefined
      : closeIconPlacement === 'start'
        ? closeIconNode
        : undefined;
  const closeIconEnd =
    closeSize === 'icon'
      ? undefined
      : closeIconPlacement === 'end'
        ? closeIconNode
        : undefined;
  const closeButtonContent = closeSize === 'icon' ? closeIconNode : closeLabel;

  return (
    <>
      {/* Sentinel element to detect when header becomes sticky */}
      {sticky && (
        <div
          ref={sentinelRef}
          style={{ height: '1px', marginTop: '-1px' }}
          aria-hidden='true'
        />
      )}

      <div
        ref={headerRef}
        id={id}
        className={cn(
          'flex items-center justify-between gap-3 border-b border-slate-100 py-4 mb-4 bg-white/80 backdrop-blur-sm transition-all duration-200',
          sticky && 'sticky',
          isSticky && stickyClassName,
          className,
        )}
        style={
          sticky
            ? {
                top: `${stickyOffset}px`,
                zIndex,
              }
            : undefined
        }
      >
        {/* Left Content */}
        {leftContent ? (
          leftContent
        ) : (
          <div className='flex items-center gap-3'>
            {showClose && (
              <RBtn
                type='button'
                size={closeSize}
                variant={closeVariant}
                onClick={onClose}
                aria-label={closeLabel}
                disabled={loading || closeDisabled}
                iconStart={closeIconStart}
                iconEnd={closeIconEnd}
              >
                {closeButtonContent}
              </RBtn>
            )}
            {typeof title === 'string' ? (
              <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
            ) : (
              title
            )}
          </div>
        )}

        {/* Right Actions */}
        {actions ? (
          responsive ? (
            <>
              {/* Desktop: Show all actions */}
              <div className='hidden lg:flex items-center gap-2'>{actions}</div>
              {/* Mobile: Show dropdown menu */}
              <div className='lg:hidden'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <RBtn variant='outline' size='icon'>
                      <MoreVertical className='h-4 w-4' />
                    </RBtn>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <div className='p-2 space-y-1'>{actions}</div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            actions
          )
        ) : (
          <div className='flex items-center gap-2'>
            {showCancel && (
              <RBtn
                type='button'
                onClick={onCancel}
                disabled={loading || cancelDisabled}
                variant={cancelVariant}
                size={cancelSize}
                iconStart={
                  cancelIconPlacement === 'start' ? cancelIcon : undefined
                }
                iconEnd={cancelIconPlacement === 'end' ? cancelIcon : undefined}
              >
                {cancelLabel}
              </RBtn>
            )}
            {showOk && (
              <RBtn
                type='button'
                onClick={onOk}
                disabled={loading || okDisabled}
                variant={okVariant}
                size={okSize}
                iconStart={
                  !loading && okIconPlacement === 'start' ? okIcon : undefined
                }
                iconEnd={
                  !loading && okIconPlacement === 'end' ? okIcon : undefined
                }
                loading={loading}
              >
                {okLabel}
              </RBtn>
            )}
          </div>
        )}
      </div>
    </>
  );
}

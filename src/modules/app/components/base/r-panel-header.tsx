import { type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

import RBtn from '@/modules/app/components/base/r-btn';
import { buttonVariants } from '@/modules/app/components/ui/variants/button-variants';
import { cn } from '@/modules/app/libs/utils';

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
  title: string;
  className?: string;
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
};

export function RPanelHeader<TPayload = unknown>({
  title,
  className,
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
}: TRPanelHeaderProps<TPayload>) {
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
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-slate-100 py-4 mb-4',
        className,
      )}
    >
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
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
      </div>
      <div className='flex items-center gap-2'>
        {showCancel && (
          <RBtn
            type='button'
            onClick={onCancel}
            disabled={loading || cancelDisabled}
            variant={cancelVariant}
            size={cancelSize}
            iconStart={cancelIconPlacement === 'start' ? cancelIcon : undefined}
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
            iconEnd={!loading && okIconPlacement === 'end' ? okIcon : undefined}
            loading={loading}
          >
            {okLabel}
          </RBtn>
        )}
      </div>
    </div>
  );
}

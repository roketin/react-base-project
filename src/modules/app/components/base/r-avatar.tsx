import { forwardRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'rounded' | 'square';

const SIZE_MAP: Record<AvatarSize, string> = {
  xxs: 'size-5 text-[8px]',
  xs: 'size-8 text-xs',
  sm: 'size-10 text-sm',
  md: 'size-12 text-base',
  lg: 'size-16 text-lg',
  xl: 'size-20 text-xl',
};

type TRAvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  imageClassName?: string;
  fallback?: ReactNode;
  presence?: 'online' | 'offline' | 'busy' | 'away';
  badge?: ReactNode;
  gradient?: boolean;
};

const PRESENCE_COLORS: Record<
  NonNullable<TRAvatarProps['presence']>,
  string
> = {
  online: 'bg-emerald-500',
  offline: 'bg-muted-foreground/40',
  busy: 'bg-destructive',
  away: 'bg-amber-400',
};

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const [first, second] = parts;
  if (!second) {
    return first.slice(0, 2).toUpperCase();
  }
  return `${first[0]}${second[0]}`.toUpperCase();
}

function getGradientFromName(name?: string) {
  if (!name) {
    return 'from-primary/80 via-primary/60 to-primary/80';
  }
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `from-[hsl(${hue},85%,65%)] via-[hsl(${(hue + 40) % 360},80%,60%)] to-[hsl(${(hue + 80) % 360},75%,55%)]`;
}

export const RAvatar = forwardRef<HTMLDivElement, TRAvatarProps>(
  function RAvatar(
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      className,
      imageClassName,
      fallback,
      presence,
      badge,
      gradient = true,
    },
    ref,
  ) {
    const initials = useMemo(() => getInitials(name), [name]);
    const showImage = Boolean(src);
    const gradientClass = gradient ? getGradientFromName(name) : '';
    const shapeClass =
      shape === 'circle'
        ? 'rounded-full'
        : shape === 'rounded'
          ? 'rounded-xl'
          : 'rounded-lg';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center bg-muted text-foreground font-semibold uppercase',
          SIZE_MAP[size],
          shapeClass,
          className,
        )}
        aria-label={alt ?? name ?? 'Avatar'}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? 'Avatar'}
            className={cn('size-full object-cover', shapeClass, imageClassName)}
          />
        ) : fallback ? (
          fallback
        ) : (
          <span
            className={cn(
              'size-full flex items-center justify-center',
              gradient ? `bg-linear-to-br ${gradientClass}` : 'bg-muted',
              shapeClass,
            )}
          >
            <span className='px-1 text-current'>{initials || '?'}</span>
          </span>
        )}

        {presence ? (
          <span
            className={cn(
              'absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background',
              PRESENCE_COLORS[presence],
            )}
          />
        ) : null}

        {badge ? <div className='absolute -top-1 -right-1'>{badge}</div> : null}
      </div>
    );
  },
);

RAvatar.displayName = 'RAvatar';

export default RAvatar;

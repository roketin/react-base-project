import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

export type TRAspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** Aspect ratio as number (e.g., 16/9) or string (e.g., "16/9") */
  ratio?: number | string;
  /** Common preset ratios */
  preset?: 'square' | 'video' | 'portrait' | 'wide' | 'ultrawide' | 'golden';
  children?: ReactNode;
};

// ============================================================================
// PRESETS
// ============================================================================

const RATIO_PRESETS: Record<
  NonNullable<TRAspectRatioProps['preset']>,
  number
> = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
  ultrawide: 32 / 9,
  golden: 1.618,
};

// ============================================================================
// COMPONENT
// ============================================================================

export const RAspectRatio = forwardRef<HTMLDivElement, TRAspectRatioProps>(
  ({ ratio, preset, className, children, style, ...props }, ref) => {
    // Determine the ratio value
    let aspectRatio: number;

    if (preset) {
      aspectRatio = RATIO_PRESETS[preset];
    } else if (typeof ratio === 'string') {
      const [width, height] = ratio.split('/').map(Number);
      aspectRatio = width && height ? width / height : 1;
    } else {
      aspectRatio = ratio ?? 1;
    }

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{
          ...style,
          aspectRatio: aspectRatio,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

RAspectRatio.displayName = 'RAspectRatio';

// ============================================================================
// ASPECT RATIO IMAGE (convenience component)
// ============================================================================

export type TRAspectRatioImageProps = Omit<TRAspectRatioProps, 'children'> & {
  src: string;
  alt: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  imgClassName?: string;
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
};

export const RAspectRatioImage = forwardRef<
  HTMLDivElement,
  TRAspectRatioImageProps
>(
  (
    {
      src,
      alt,
      objectFit = 'cover',
      objectPosition = 'center',
      imgClassName,
      fallback,
      onLoad,
      onError,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };

    return (
      <RAspectRatio ref={ref} {...props}>
        {hasError && fallback ? (
          <div className='absolute inset-0 flex items-center justify-center bg-muted'>
            {fallback}
          </div>
        ) : (
          <>
            {isLoading && (
              <div className='absolute inset-0 animate-pulse bg-muted' />
            )}
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'absolute inset-0 h-full w-full',
                isLoading && 'opacity-0',
                imgClassName,
              )}
              style={{
                objectFit,
                objectPosition,
              }}
            />
          </>
        )}
      </RAspectRatio>
    );
  },
);

RAspectRatioImage.displayName = 'RAspectRatioImage';

// ============================================================================
// ASPECT RATIO VIDEO (convenience component)
// ============================================================================

import { useState } from 'react';

export type TRAspectRatioVideoProps = Omit<TRAspectRatioProps, 'children'> & {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  videoClassName?: string;
  /** For YouTube/Vimeo embeds */
  embedUrl?: string;
  /** Allow fullscreen for embeds */
  allowFullscreen?: boolean;
};

export const RAspectRatioVideo = forwardRef<
  HTMLDivElement,
  TRAspectRatioVideoProps
>(
  (
    {
      src,
      poster,
      autoPlay = false,
      loop = false,
      muted = false,
      controls = true,
      videoClassName,
      embedUrl,
      allowFullscreen = true,
      preset = 'video',
      ...props
    },
    ref,
  ) => {
    return (
      <RAspectRatio ref={ref} preset={preset} {...props}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className={cn('absolute inset-0 h-full w-full', videoClassName)}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen={allowFullscreen}
            title='Embedded video'
          />
        ) : (
          <video
            src={src}
            poster={poster}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              videoClassName,
            )}
          />
        )}
      </RAspectRatio>
    );
  },
);

RAspectRatioVideo.displayName = 'RAspectRatioVideo';

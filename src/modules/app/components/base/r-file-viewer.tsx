import {
  getFileExtensionFromFile,
  getFileExtensionFromString,
  getFileGroupType,
} from '@/modules/app/libs/file-utils';
import { cn } from '@/modules/app/libs/utils';
import {
  memo,
  useEffect,
  useMemo,
  useState,
  type ImgHTMLAttributes,
} from 'react';
import RDialog from '@/modules/app/components/base/r-dialog';
import { RImg } from '@/modules/app/components/base/r-img';
import { RLoading } from '@/modules/app/components/base/r-loading';

export type TRFileViewer = {
  show?: boolean;
  src: File | string | null;
  onClose: () => void;
};

const generateObjectUrl = ({
  isFileObject,
  src,
}: {
  isFileObject: boolean;
  src: File | string | null;
}) => {
  if (isFileObject) {
    return URL.createObjectURL(src as File);
  }
  return src as string;
};

const RFileViewer = ({ src, show = false, onClose }: TRFileViewer) => {
  // Check is file
  const isFileObject = useMemo<boolean>(
    () => !(!src || !(src instanceof File)),
    [src],
  );

  // Get file group type
  const mimeType = useMemo(() => {
    if (!src) return undefined;
    if (isFileObject) {
      const file = src as File;
      return file.type || undefined;
    }
    if (typeof src === 'string' && src.startsWith('data:')) {
      const match = /^data:([^;]+)/i.exec(src);
      return match?.[1];
    }
    return undefined;
  }, [isFileObject, src]);

  const fileGroupType = useMemo(() => {
    if (!src) {
      return 'custom';
    }

    const ext = isFileObject
      ? getFileExtensionFromFile(src as unknown as File)
      : getFileExtensionFromString(src as string);

    return getFileGroupType(ext, mimeType);
  }, [isFileObject, mimeType, src]);

  // Actual src
  const actualSrc = useMemo<string | null>(() => {
    if (!src) return null;
    return generateObjectUrl({
      isFileObject,
      src,
    });
  }, [isFileObject, src]);

  useEffect(() => {
    if (!isFileObject || !actualSrc) return undefined;
    return () => {
      URL.revokeObjectURL(actualSrc);
    };
  }, [actualSrc, isFileObject]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomable, setIsZoomable] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (!show) {
      setIsZoomed(false);
    }
  }, [show, src]);

  useEffect(() => {
    setIsZoomable(false);
    setImageDimensions({ width: 0, height: 0 });
    setZoomScale(1);
  }, [actualSrc]);

  const handleImageLoad: ImgHTMLAttributes<HTMLImageElement>['onLoad'] = (
    event,
  ) => {
    const target = event.currentTarget;
    const naturalWidth = target?.naturalWidth ?? 0;
    const naturalHeight = target?.naturalHeight ?? 0;

    setImageDimensions({
      width: naturalWidth,
      height: naturalHeight,
    });
    setIsZoomed(false);
    setZoomScale(1);

    if (typeof window !== 'undefined') {
      const { innerWidth, innerHeight } = window;
      const isLargeImage =
        naturalWidth >= innerWidth || naturalHeight >= innerHeight;
      if (isLargeImage) {
        setIsZoomable(false);
        setIsZoomed(false);
        setZoomScale(1);
        return;
      }

      const widthScale = innerWidth / naturalWidth;
      const heightScale = innerHeight / naturalHeight;
      const scaleToFit = Math.min(widthScale, heightScale);

      const clampedScale = Number.isFinite(scaleToFit)
        ? Math.min(Math.max(scaleToFit, 1), 4)
        : 1;

      setZoomScale(clampedScale);
      setIsZoomable(clampedScale > 1.01);
    } else {
      setIsZoomable(false);
      setIsZoomed(false);
      setZoomScale(1);
    }
  };

  const imageStyles =
    isZoomable && imageDimensions.width && imageDimensions.height
      ? {
          width: `${imageDimensions.width}px`,
          height: `${imageDimensions.height}px`,
          maxWidth: isZoomed ? '100%' : `${imageDimensions.width}px`,
          maxHeight: isZoomed ? '100%' : `${imageDimensions.height}px`,
        }
      : {
          maxWidth: '100%',
          maxHeight: '100%',
        };

  return (
    <RDialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      hideHeader
      hideFooter
      showCloseButton
      fullscreen
      contentClassName='bg-black/30 backdrop-blur-md'
    >
      {fileGroupType === 'image' && actualSrc && (
        <div className='flex h-full w-full items-center justify-center p-4 overflow-hidden'>
          <RImg
            src={actualSrc}
            alt='File preview'
            onClick={() => {
              if (!isZoomable) return;
              setIsZoomed((prev) => !prev);
            }}
            lazy={false}
            className={cn(
              'items-center justify-center',
              isZoomable
                ? isZoomed
                  ? 'h-full w-full max-h-full max-w-full'
                  : 'h-auto w-auto'
                : 'h-full w-full max-h-full max-w-full',
            )}
            imageClassName={cn(
              'rounded-md shadow-lg transition-transform duration-200 ease-out object-contain',
              isZoomable
                ? isZoomed
                  ? 'cursor-zoom-out w-full h-full'
                  : 'cursor-zoom-in w-auto h-auto'
                : 'cursor-default w-full h-full',
            )}
            onLoad={handleImageLoad}
            loader={
              <div className='absolute inset-0 grid place-items-center'>
                <RLoading hideLabel iconClassName='size-8 text-white' />
              </div>
            }
            style={{
              ...imageStyles,
              transform: `scale(${isZoomable && isZoomed ? zoomScale : 1})`,
              transition:
                'transform 250ms ease, max-width 250ms ease, max-height 250ms ease',
              transformOrigin: 'center center',
            }}
          />
        </div>
      )}

      {fileGroupType === 'pdf' && actualSrc && (
        <div className='flex h-full w-full items-center justify-center'>
          <iframe
            title='viewer'
            className='h-[80vh] w-full max-w-5xl border-0 rounded-md bg-white shadow-lg'
            src={actualSrc}
          />
        </div>
      )}

      {fileGroupType === 'doc' && actualSrc && !isFileObject && (
        <div className='flex h-full w-full items-center justify-center'>
          <iframe
            title='office-viewer'
            className='h-[80vh] w-full max-w-5xl border-0 rounded-md bg-white shadow-lg'
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(actualSrc)}`}
          />
        </div>
      )}

      {fileGroupType === 'doc' && actualSrc && isFileObject && (
        <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-sm text-muted-foreground'>
          <span>Office Online preview requires a publicly accessible URL.</span>
          <span className='text-xs'>
            Please upload the document or download it locally to view.
          </span>
        </div>
      )}

      {fileGroupType === 'custom' && (
        <div className='flex h-full items-center justify-center p-4 text-sm text-muted-foreground'>
          File not supported.
        </div>
      )}
    </RDialog>
  );
};

export default memo(RFileViewer);

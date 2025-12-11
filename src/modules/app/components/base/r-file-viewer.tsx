import {
  getFileExtensionFromFile,
  getFileExtensionFromString,
  getFileGroupType,
} from '@/modules/app/libs/file-utils';
import { cn } from '@/modules/app/libs/utils';
import { memo, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

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
  const isFileObject = useMemo<boolean>(
    () => !(!src || !(src instanceof File)),
    [src],
  );

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
    if (!src) return 'custom';
    const ext = isFileObject
      ? getFileExtensionFromFile(src as unknown as File)
      : getFileExtensionFromString(src as string);
    return getFileGroupType(ext, mimeType);
  }, [isFileObject, mimeType, src]);

  const actualSrc = useMemo<string | null>(() => {
    if (!src) return null;
    return generateObjectUrl({ isFileObject, src });
  }, [isFileObject, src]);

  useEffect(() => {
    if (!isFileObject || !actualSrc) return undefined;
    return () => {
      URL.revokeObjectURL(actualSrc);
    };
  }, [actualSrc, isFileObject]);

  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!show) setIsZoomed(false);
  }, [show, src]);

  // Lock body scroll when open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm'
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className='absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer'
          >
            <X size={20} />
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              width: isZoomed ? 'calc(100vw - 40px)' : 'auto',
              height: isZoomed ? 'calc(100svh - 40px)' : 'auto',
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'relative',
              isZoomed ? 'overflow-hidden' : 'overflow-hidden',
            )}
            style={{
              maxWidth: isZoomed ? undefined : '90vw',
              maxHeight: isZoomed ? undefined : '90svh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {fileGroupType === 'image' && actualSrc && (
              <motion.img
                src={actualSrc}
                alt='File preview'
                onClick={() => setIsZoomed((prev) => !prev)}
                animate={{
                  scale: isZoomed ? 1.5 : 1,
                  borderRadius: isZoomed ? '0px' : '8px',
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={cn(
                  'shadow-2xl object-contain block mx-auto',
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
                )}
                style={{
                  maxWidth: isZoomed ? 'calc(100vw - 40px)' : '85vw',
                  maxHeight: isZoomed ? 'calc(100svh - 40px)' : '85svh',
                  transformOrigin: 'center center',
                }}
              />
            )}

            {fileGroupType === 'pdf' && actualSrc && (
              <iframe
                title='PDF viewer'
                className='h-[85vh] w-[85vw] max-w-5xl rounded-lg bg-white shadow-2xl'
                src={actualSrc}
              />
            )}

            {fileGroupType === 'doc' && actualSrc && !isFileObject && (
              <iframe
                title='Office viewer'
                className='h-[85vh] w-[85vw] max-w-5xl rounded-lg bg-white shadow-2xl'
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(actualSrc)}`}
              />
            )}

            {fileGroupType === 'doc' && actualSrc && isFileObject && (
              <div className='rounded-lg bg-white/10 p-8 text-center text-white'>
                <p>Office Online preview requires a publicly accessible URL.</p>
                <p className='mt-2 text-sm text-white/70'>
                  Please upload the document or download it locally to view.
                </p>
              </div>
            )}

            {fileGroupType === 'custom' && (
              <div className='rounded-lg bg-white/10 p-8 text-center text-white'>
                File type not supported for preview.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(RFileViewer);

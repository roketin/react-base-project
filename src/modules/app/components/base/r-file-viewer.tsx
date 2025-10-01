import { Dialog, DialogContent } from '@/modules/app/components/ui/dialog';
import {
  getFileExtensionFromFile,
  getFileExtensionFromString,
  getFileGroupType,
} from '@/modules/app/libs/file-utils';
import { memo, useMemo } from 'react';

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
  const fileGroupType = useMemo(() => {
    if (!src) {
      return 'custom';
    }

    const ext = isFileObject
      ? getFileExtensionFromFile(src as unknown as File)
      : getFileExtensionFromString(src as string);

    return getFileGroupType(ext);
  }, [isFileObject, src]);

  // Actual src
  const actualSrc = useMemo<string>(() => {
    return generateObjectUrl({
      isFileObject,
      src,
    });
  }, [isFileObject, src]);

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className='bg-black rounded-lg'
      >
        {fileGroupType === 'image' && (
          <div
            role='img'
            style={{
              height: '100%',
              width: '100%',
              backgroundImage: `url(${actualSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
            className='rounded-lg'
          ></div>
        )}

        {fileGroupType === 'pdf' && src && (
          <iframe
            title='viewer'
            className='w-full h-full border-0'
            src={actualSrc}
          />
        )}

        {fileGroupType === 'custom' && (
          <div className='flex items-center justify-center h-full p-4 box-border'>
            File not supported.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(RFileViewer);

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import {
  AudioWaveform,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  Search,
  Trash,
} from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import Button from '@/modules/app/components/ui/button';
import { DEFAULT_EXT } from '@/modules/app/constants/app.constant';
import {
  getFileExtensionFromFile,
  getFileExtensionFromString,
  getFileGroupType,
  type TGroupFileType,
} from '@/modules/app/libs/file-utils';

export type TRFileUploaderRef = {
  focus: () => void;
  removeFile: () => void;
};

export type TRFileUploaderProps = {
  value: File | string | null;
  accept: string[];
  width: string;
  height: string;
  disabledUpload: boolean;
  disabledDelete: boolean;
  showPreview: boolean;
  thumbnailSize: 'cover' | 'contain';
  onChange: (file: File | null) => void;
  onRemove: () => void;
  onPreview: (file: File | string) => void;
  icon: 'image' | 'music' | 'excel';
  compress?: boolean;
  onBlur?: () => void;
};

export type TRFileUploaderThumbsProps = Partial<TRFileUploaderProps> & {
  file: File | null;
  fileThumbnail: string | null;
  groupType: TGroupFileType;
  isValidAcceptWithType: boolean;
  handleFileChange: (file: File) => void;
  handleFileRemove: () => void;
};

/**
 * RFileThumbnail component renders the file thumbnail preview,
 * handles file selection, drag-and-drop, and file removal.
 */
const RFileThumbnail = forwardRef<TRFileUploaderRef, TRFileUploaderThumbsProps>(
  (props, ref) => {
    const {
      disabledUpload,
      disabledDelete,
      width,
      height,
      accept,
      fileThumbnail,
      showPreview,
      file,
      isValidAcceptWithType,
      thumbnailSize,
      onPreview,
      handleFileChange,
      handleFileRemove,
      icon,
      groupType,
    } = props;

    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    /**
     * Handle trigger file input click to open file dialog.
     */
    const handleFileClick = useCallback(() => {
      if (!disabledUpload) fileRef.current?.click();
    }, [disabledUpload]);

    /**
     * Handle file input change event, passing the selected file to parent handler.
     * @param e ChangeEvent<HTMLInputElement>
     */
    const handleFileChange_internal = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentFile = (e.target.files?.[0] ?? null) as File;
        handleFileChange(currentFile);
      },
      [handleFileChange],
    );

    /**
     * Handle file removal triggered by user, clears input and calls remove handler.
     * @param e React.MouseEvent<HTMLElement>
     */
    const handleFileRemove_internal = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (fileRef.current) {
          fileRef.current.value = '';
        }

        handleFileRemove();
      },
      [handleFileRemove],
    );

    /**
     * Handle drag over event to indicate drag state.
     * @param e React.DragEvent<HTMLDivElement>
     */
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    /**
     * Handle drag leave event to reset drag state.
     */
    const handleDragLeave = useCallback(() => {
      setIsDragOver(false);
    }, []);

    /**
     * Handle drop event to accept dropped file if uploading is enabled.
     * @param e React.DragEvent<HTMLDivElement>
     */
    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabledUpload) {
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) {
            handleFileChange(droppedFile);
          }
        }
      },
      [disabledUpload, handleFileChange],
    );

    useImperativeHandle(ref, () => ({
      focus: () => fileRef.current?.focus(),
      removeFile: () => {
        if (fileRef.current) fileRef.current.value = '';
        handleFileRemove();
      },
    }));

    /**
     * Memoized value to determine if deleting the file is allowed.
     */
    const isAllowDelete = useMemo<boolean>(
      () => Boolean((file || fileThumbnail) && !disabledDelete),
      [file, fileThumbnail, disabledDelete],
    );

    /**
     * Memoized value to determine if previewing the file is allowed.
     */
    const isAllowPreview = useMemo<boolean>(
      () => Boolean((file || fileThumbnail) && showPreview),
      [file, fileThumbnail, showPreview],
    );

    /**
     * Render the thumbnail content based on file type and availability.
     * @returns React.ReactNode
     */
    const renderThumbnail = () => {
      if (fileThumbnail) {
        if (groupType === 'image' && isValidAcceptWithType) {
          return (
            <img
              src={fileThumbnail}
              alt={fileThumbnail}
              style={{ width, height }}
              className={cn({
                'object-cover': thumbnailSize === 'cover',
                'object-contain': thumbnailSize === 'contain',
              })}
            />
          );
        }
        return (
          <div className='flex items-center flex-col justify-center h-full'>
            <FileArchive size={50} />
            <div className='text-xs mt-3 text-center w-full break-words px-2'>
              {file?.name}
            </div>
          </div>
        );
      }

      const icons: Record<string, React.ReactNode> = {
        image: <FileImage size={50} />,
        music: <AudioWaveform size={50} />,
        excel: <FileSpreadsheet size={50} />,
      };

      return (
        <div className='flex items-center flex-col justify-center h-full'>
          {icons[icon ?? 'image']}
          {!disabledUpload && (
            <div className='text-sm mt-2'>Choose File...</div>
          )}
        </div>
      );
    };

    return (
      <div style={{ width }}>
        <div
          style={{ width, height }}
          role='presentation'
          onClick={handleFileClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'overflow-hidden rounded-md bg-gray-50 relative border border-gray-200 shadow-lg shadow-gray-50 transition-all ease-in-out',
            !disabledUpload ? 'cursor-pointer hover:bg-gray-100' : '',
            isDragOver ? 'border-blue-500' : '',
          )}
        >
          {isAllowDelete && (
            <Button
              title='Remove file'
              onClick={handleFileRemove_internal}
              className='absolute top-2 right-2'
              variant='destructive'
            >
              <Trash size={15} />
            </Button>
          )}

          {isAllowPreview && (
            <Button
              variant='outline'
              className='absolute top-2 left-2'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (onPreview && (file || fileThumbnail)) {
                  onPreview(file || (fileThumbnail as string));
                }
              }}
            >
              <Search size={15} />
            </Button>
          )}

          {renderThumbnail()}

          <input
            data-testid='fileInput'
            type='file'
            className='hidden'
            accept={`${accept
              ?.map((ext) => {
                return `.${ext}`;
              })
              .join(',')}`}
            ref={fileRef}
            onChange={handleFileChange_internal}
          />
        </div>
      </div>
    );
  },
);

RFileThumbnail.displayName = 'RFileThumbnail';

/**
 * RFileUploader component manages the file upload state,
 * including compression, validation, and rendering the thumbnail component.
 */
const RFileUploader = forwardRef<
  TRFileUploaderRef,
  Partial<TRFileUploaderProps>
>((props, ref) => {
  const {
    onChange,
    accept = DEFAULT_EXT.IMAGES,
    value = null,
    width = '200px',
    height = '200px',
    disabledUpload = false,
    disabledDelete = false,
    onRemove,
    onPreview,
    showPreview = false,
    thumbnailSize = 'cover',
    icon = 'image',
    compress = true,
    onBlur,
  } = props;

  const [file, setFile] = useState<File | null>(null);
  const [fileThumb, setFileThumb] = useState<string | null>();

  /**
   * Effect to synchronize local file state with the external value prop.
   */
  useEffect(() => {
    if (value instanceof File) {
      setFile(value);
    } else if (value === '') {
      setFileThumb(null);
      setFile(null);
    } else {
      setFileThumb(value);
    }
  }, [value]);

  /**
   * Memoized file thumbnail URL or string for preview.
   */
  const fileThumbnail = useMemo<string | null>(() => {
    if (file) {
      return URL.createObjectURL(file);
    } else if (fileThumb) {
      return fileThumb;
    }
    return null;
  }, [file, fileThumb]);

  /**
   * Memoized file group type based on file extension.
   */
  const groupType = useMemo<TGroupFileType>(() => {
    const fileActual =
      file && fileThumbnail
        ? getFileExtensionFromFile(file)
        : getFileExtensionFromString(fileThumbnail ?? '');

    return getFileGroupType(fileActual);
  }, [file, fileThumbnail]);

  /**
   * Memoized boolean to check if file type is valid for image preview.
   */
  const isValidAcceptWithType = useMemo<boolean>(
    () => groupType === 'image',
    [groupType],
  );

  /**
   * Compress image file to reduce size before upload.
   * @param file Image file to compress
   * @returns Promise<File> compressed file
   */
  async function compressImage(file: File): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context not available'));
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              URL.revokeObjectURL(url);
              resolve(compressedFile);
            } else {
              URL.revokeObjectURL(url);
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          0.7,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Image load error'));
      };
      img.src = url;
    });
  }

  /**
   * Handle file change event, optionally compressing images before setting state.
   * @param currentFile Selected file
   */
  const handleFileChange = useCallback(
    async (currentFile: File) => {
      if (currentFile) {
        let fileToSet = currentFile;
        if (compress && currentFile.type.startsWith('image/')) {
          try {
            fileToSet = await compressImage(currentFile);
          } catch {
            fileToSet = currentFile;
          }
        }
        setFile(fileToSet);
        setFileThumb(null);

        if (onChange) {
          onChange(fileToSet);
        }
        onBlur?.();
      }
    },
    [onChange, compress, onBlur],
  );

  /**
   * Handle file removal, resetting state and calling callbacks.
   */
  const handleFileRemove = useCallback(() => {
    setFile(null);
    setFileThumb(null);

    if (onRemove) {
      onRemove();
    }

    if (onChange) {
      onChange(null);
    }
    onBlur?.();
  }, [onRemove, onChange, onBlur]);

  return (
    <div className='flex flex-col'>
      <RFileThumbnail
        ref={ref}
        {...{
          onChange,
          accept,
          disabledDelete,
          disabledUpload,
          height,
          width,
          handleFileChange,
          handleFileRemove,
          fileThumbnail,
          onPreview,
          showPreview,
          file,
          groupType,
          isValidAcceptWithType,
          thumbnailSize,
          icon,
          onBlur,
        }}
      />
    </div>
  );
});

RFileUploader.displayName = 'RFileUploader';

export default RFileUploader;

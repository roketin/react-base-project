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

const ICON_MAP: Record<'image' | 'music' | 'excel', React.ReactNode> = {
  image: <FileImage size={24} />,
  music: <AudioWaveform size={24} />,
  excel: <FileSpreadsheet size={24} />,
};

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
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          resolve(
            new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }),
          );
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

export type TRFileUploaderRef = {
  focus: () => void;
  removeFile: () => void;
};

export type TRFileUploaderProps = {
  value?: File | string | null;
  accept?: string[];
  width?: string;
  height?: string;
  disabledUpload?: boolean;
  disabledDelete?: boolean;
  showPreview?: boolean;
  thumbnailSize?: 'cover' | 'contain';
  onChange?: (file: File | null) => void;
  onRemove?: () => void;
  onPreview?: (file: File | string) => void;
  icon?: 'image' | 'music' | 'excel';
  compress?: boolean;
  onBlur?: () => void;
};

type TRFileUploaderThumbsProps = {
  acceptAttr?: string;
  disabledUpload: boolean;
  disabledDelete: boolean;
  width: string;
  height: string;
  showPreview: boolean;
  thumbnailSize: 'cover' | 'contain';
  icon: 'image' | 'music' | 'excel';
  previewSrc: string | null;
  previewTarget: File | string | null;
  fileName?: string;
  isImagePreview: boolean;
  onPreview?: (file: File | string) => void;
  handleFileChange: (file: File | null) => void;
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
      acceptAttr,
      previewSrc,
      previewTarget,
      showPreview,
      fileName,
      isImagePreview,
      thumbnailSize,
      onPreview,
      handleFileChange,
      handleFileRemove,
      icon,
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
        handleFileChange(e.target.files?.[0] ?? null);
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
          handleFileChange(e.dataTransfer.files?.[0] ?? null);
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

    const isAllowDelete = useMemo(
      () => Boolean((previewSrc || fileName) && !disabledDelete),
      [previewSrc, fileName, disabledDelete],
    );

    const isAllowPreview = useMemo(
      () => Boolean(previewTarget && showPreview),
      [previewTarget, showPreview],
    );

    const thumbnailContent = useMemo(() => {
      if (previewSrc) {
        if (isImagePreview) {
          return (
            <img
              src={previewSrc}
              alt={fileName ?? 'preview'}
              style={{ width, height }}
              className={cn({
                'object-cover': thumbnailSize === 'cover',
                'object-contain': thumbnailSize === 'contain',
              })}
            />
          );
        }

        return (
          <div className='flex h-full flex-col items-center justify-center px-2 text-center'>
            <FileArchive size={50} />
            {fileName && (
              <div className='mt-3 w-full break-words text-xs'>{fileName}</div>
            )}
          </div>
        );
      }

      return (
        <div className='flex h-full items-center justify-center gap-2'>
          {ICON_MAP[icon]}
          {!disabledUpload && <div className='text-sm'>Choose File...</div>}
        </div>
      );
    }, [
      previewSrc,
      isImagePreview,
      fileName,
      disabledUpload,
      icon,
      height,
      thumbnailSize,
      width,
    ]);

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
            'overflow-hidden rounded-md bg-white relative border border-gray-200 shadow-lg shadow-gray-50 transition-all ease-in-out',
            !disabledUpload ? 'cursor-pointer hover:bg-gray-50' : '',
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

                if (onPreview && previewTarget) {
                  onPreview(previewTarget);
                }
              }}
            >
              <Search size={15} />
            </Button>
          )}

          {thumbnailContent}

          <input
            data-testid='fileInput'
            type='file'
            className='hidden'
            accept={acceptAttr}
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
const RFileUploader = forwardRef<TRFileUploaderRef, TRFileUploaderProps>(
  (props, ref) => {
    const {
      onChange,
      accept = DEFAULT_EXT.IMAGES,
      value = null,
      width = '100%',
      height = '150px',
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
    const [remotePreview, setRemotePreview] = useState<string | null>(null);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
      if (value instanceof File) {
        setFile(value);
        setRemotePreview(null);
      } else {
        setFile(null);
        setRemotePreview(value ?? null);
      }
    }, [value]);

    useEffect(() => {
      if (!file) {
        setObjectUrl(null);
        return;
      }

      const url = URL.createObjectURL(file);
      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }, [file]);

    const previewSrc = objectUrl ?? remotePreview;

    const groupType = useMemo<TGroupFileType>(() => {
      if (file) {
        return getFileGroupType(getFileExtensionFromFile(file));
      }
      return getFileGroupType(getFileExtensionFromString(previewSrc ?? ''));
    }, [file, previewSrc]);

    const acceptAttr = useMemo(() => {
      if (!accept?.length) return undefined;
      return accept
        .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
        .join(',');
    }, [accept]);

    const isImagePreview = groupType === 'image';

    const handleFileChange = useCallback(
      async (currentFile: File | null) => {
        if (!currentFile) {
          setFile(null);
          setRemotePreview(null);
          onChange?.(null);
          onBlur?.();
          return;
        }

        let nextFile = currentFile;

        if (compress && currentFile.type.startsWith('image/')) {
          try {
            nextFile = await compressImage(currentFile);
          } catch {
            nextFile = currentFile;
          }
        }

        setFile(nextFile);
        setRemotePreview(null);
        onChange?.(nextFile);
        onBlur?.();
      },
      [compress, onBlur, onChange],
    );

    const handleFileRemove = useCallback(() => {
      setFile(null);
      setRemotePreview(null);
      onRemove?.();
      onChange?.(null);
      onBlur?.();
    }, [onBlur, onChange, onRemove]);

    return (
      <div className='flex flex-col'>
        <RFileThumbnail
          ref={ref}
          acceptAttr={acceptAttr}
          disabledDelete={disabledDelete}
          disabledUpload={disabledUpload}
          height={height}
          width={width}
          showPreview={showPreview}
          thumbnailSize={thumbnailSize}
          icon={icon}
          previewSrc={previewSrc}
          previewTarget={file ?? remotePreview ?? null}
          fileName={file?.name}
          isImagePreview={isImagePreview}
          onPreview={onPreview}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
        />
      </div>
    );
  },
);

RFileUploader.displayName = 'RFileUploader';

export default RFileUploader;

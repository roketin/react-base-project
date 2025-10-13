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

/**
 * Compresses an image file by drawing it onto a canvas and exporting it as a JPEG blob.
 * @param file - The original image File object to compress.
 * @returns A Promise that resolves with a new compressed File object in JPEG format.
 * @throws Will reject if the canvas context is unavailable, image loading fails, or compression fails.
 *
 * Side effects:
 * - Creates an object URL for the image file.
 * - Revokes the object URL after processing.
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
  maxSizeMB?: number;
  adaptiveThumbnail?: boolean;
  'aria-invalid'?: boolean;
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
  adaptiveThumbnail?: boolean;
  ariaInvalid?: boolean;
};

/**
 * RFileThumbnail component renders the file thumbnail preview,
 * handles file selection, drag-and-drop, and file removal.
 *
 * @param props - Properties controlling the thumbnail's behavior and appearance.
 * @param ref - Forwarded ref to expose imperative methods like focus and removeFile.
 * @returns JSX element representing the file thumbnail with interactive controls.
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
      adaptiveThumbnail,
      ariaInvalid,
    } = props;

    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    /**
     * Handles the click event on the thumbnail container to trigger the hidden file input.
     * Opens the file selection dialog if uploading is not disabled.
     */
    const handleFileClick = useCallback(() => {
      if (!disabledUpload) fileRef.current?.click();
    }, [disabledUpload]);

    /**
     * Handles the change event on the hidden file input.
     * Passes the selected file (or null if none) to the parent handler.
     *
     * @param e - ChangeEvent triggered when user selects a file.
     */
    const handleFileChange_internal = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] ?? null);
      },
      [handleFileChange],
    );

    /**
     * Handles the click event on the remove button to clear the selected file.
     * Prevents event propagation and default behavior.
     * Clears the file input value and calls the parent's remove handler.
     *
     * @param e - MouseEvent triggered by clicking the remove button.
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
     * Handles the drag over event on the thumbnail container.
     * Prevents default to allow drop and sets the drag over state to true.
     *
     * @param e - DragEvent triggered when a file is dragged over the container.
     */
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    /**
     * Handles the drag leave event on the thumbnail container.
     * Resets the drag over state to false.
     */
    const handleDragLeave = useCallback(() => {
      setIsDragOver(false);
    }, []);

    /**
     * Handles the drop event on the thumbnail container.
     * Prevents default behavior, resets drag over state,
     * and if uploading is enabled, passes the dropped file to the parent handler.
     *
     * @param e - DragEvent triggered when a file is dropped onto the container.
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

    /**
     * Exposes imperative methods to parent components via ref.
     * - focus: sets focus on the hidden file input.
     * - removeFile: clears the file input and calls the remove handler.
     */
    useImperativeHandle(ref, () => ({
      focus: () => fileRef.current?.focus(),
      removeFile: () => {
        if (fileRef.current) fileRef.current.value = '';
        handleFileRemove();
      },
    }));

    /**
     * Memoizes whether the delete button should be shown.
     * Shown only if there is a preview or filename and deletion is not disabled.
     */
    const isAllowDelete = useMemo(
      () => Boolean((previewSrc || fileName) && !disabledDelete),
      [previewSrc, fileName, disabledDelete],
    );

    /**
     * Memoizes whether the preview button should be shown.
     * Shown only if there is a preview target and preview is enabled.
     */
    const isAllowPreview = useMemo(
      () => Boolean(previewTarget && showPreview),
      [previewTarget, showPreview],
    );

    /**
     * Memoizes the content to display inside the thumbnail container.
     * Displays image preview if available and is an image.
     * Otherwise, displays a file icon and filename or upload instructions.
     */
    const thumbnailContent = useMemo(() => {
      if (previewSrc) {
        if (isImagePreview) {
          if (adaptiveThumbnail) {
            return (
              <img
                src={previewSrc}
                alt={fileName ?? 'preview'}
                className={cn('max-h-[400px] w-auto mx-auto', {
                  'object-cover': thumbnailSize === 'cover',
                  'object-contain': thumbnailSize === 'contain',
                })}
              />
            );
          }

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
          {!disabledUpload && (
            <div className='text-sm text-gray-600'>
              Drag &amp; drop file here or click to upload
            </div>
          )}
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
      adaptiveThumbnail,
    ]);

    return (
      <div style={{ width }}>
        <div
          style={
            adaptiveThumbnail
              ? previewSrc
                ? { width }
                : { width, height }
              : { width, height }
          }
          role='presentation'
          onClick={handleFileClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'overflow-hidden rounded-md bg-white relative border border-gray-200 shadow-lg shadow-gray-50 transition-all ease-in-out',
            !disabledUpload ? 'cursor-pointer hover:bg-gray-50' : '',
            isDragOver ? 'border-blue-500' : '',
            { 'border-destructive ring-destructive/40': ariaInvalid },
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

/**
 * RFileUploader component manages the file upload state,
 * including compression, validation, and rendering the thumbnail component.
 *
 * @param props - Properties controlling uploader behavior such as accepted file types, size limits, and callbacks.
 * @param ref - Forwarded ref to expose imperative methods for the thumbnail component.
 * @returns JSX element representing the file uploader with thumbnail preview and controls.
 */
const RFileUploader = forwardRef<TRFileUploaderRef, TRFileUploaderProps>(
  (props, ref) => {
    const {
      onChange,
      accept = DEFAULT_EXT.IMAGES,
      value = null,
      width = '100%',
      height = '100px',
      disabledUpload = false,
      disabledDelete = false,
      onRemove,
      onPreview,
      showPreview = false,
      thumbnailSize = 'cover',
      icon = 'image',
      compress = true,
      onBlur,
      maxSizeMB = 1,
      adaptiveThumbnail = true,
      'aria-invalid': ariaInvalid,
    } = props;

    const [file, setFile] = useState<File | null>(null);
    const [remotePreview, setRemotePreview] = useState<string | null>(null);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    /**
     * Synchronizes internal file and remote preview state based on the controlled value prop.
     * If value is a File, sets it as the current file and clears remote preview.
     * If value is a string (URL), clears file and sets remote preview.
     */
    useEffect(() => {
      if (value instanceof File) {
        setFile(value);
        setRemotePreview(null);
      } else {
        setFile(null);
        setRemotePreview(value ?? null);
      }
    }, [value]);

    /**
     * Creates an object URL for the current file to use as preview source.
     * Cleans up the object URL when the file changes or component unmounts.
     */
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

    // Determines the source URL to use for preview, preferring the local object URL over remote preview.
    const previewSrc = objectUrl ?? remotePreview;

    /**
     * Memoizes the group type of the file based on its extension.
     * Uses file extension from the File object if available, otherwise uses previewSrc.
     */
    const groupType = useMemo<TGroupFileType>(() => {
      if (file) {
        return getFileGroupType(getFileExtensionFromFile(file));
      }
      return getFileGroupType(getFileExtensionFromString(previewSrc ?? ''));
    }, [file, previewSrc]);

    /**
     * Memoizes the accept attribute string for the file input
     * by joining the accepted extensions with commas, ensuring each starts with a dot.
     */
    const acceptAttr = useMemo(() => {
      if (!accept?.length) return undefined;
      return accept
        .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
        .join(',');
    }, [accept]);

    // Determines if the preview is an image based on the group type.
    const isImagePreview = groupType === 'image';

    /**
     * Handles changes to the selected file.
     * Compresses the image if enabled and the file is an image.
     * Updates internal state and calls onChange and onBlur callbacks.
     *
     * @param currentFile - The newly selected file or null if cleared.
     */
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

    /**
     * Handles removal of the current file.
     * Clears internal file and preview state.
     * Calls onRemove, onChange, and onBlur callbacks.
     */
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
          adaptiveThumbnail={adaptiveThumbnail}
          ariaInvalid={ariaInvalid}
        />
        <div className='mt-2 text-xs text-gray-500'>
          Allowed extensions: {accept.join(', ')} | Max size: {maxSizeMB}MB
        </div>
      </div>
    );
  },
);

export default RFileUploader;

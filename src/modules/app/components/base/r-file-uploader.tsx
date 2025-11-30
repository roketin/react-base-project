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
  Upload,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/modules/app/libs/utils';
import RBtn from '@/modules/app/components/base/r-btn';
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
  value?: File | string | Array<File | string> | null;
  accept?: string[];
  width?: string;
  height?: string;
  disabledUpload?: boolean;
  disabledDelete?: boolean;
  showPreview?: boolean;
  thumbnailSize?: 'cover' | 'contain';
  onChange?: (file: File | Array<File> | null) => void;
  onRemove?: (file?: File | string) => void;
  onPreview?: (file: File | string) => void;
  icon?: 'image' | 'music' | 'excel';
  compress?: boolean;
  onBlur?: () => void;
  maxSizeMB?: number;
  adaptiveThumbnail?: boolean;
  'aria-invalid'?: boolean;
  variant?: 'default' | 'compact';
  label?: string;
  uploadProgress?: number; // 0-100 for progress bar
  isUploading?: boolean; // true when actively uploading
  showDescription?: boolean; // show/hide file info description
  multiple?: boolean;
  maxFiles?: number;
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
  handleFileChange: (file: File | FileList | null) => void;
  handleFileRemove: () => void;
  adaptiveThumbnail?: boolean;
  ariaInvalid?: boolean;
  multiple?: boolean;
};

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
        const files = props.multiple
          ? e.target.files
          : (e.target.files?.[0] ?? null);
        // Clear value so selecting the same file twice still triggers onChange
        if (fileRef.current) {
          fileRef.current.value = '';
        }
        handleFileChange(files);
      },
      [handleFileChange, props.multiple],
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
          const files = props.multiple
            ? e.dataTransfer.files
            : (e.dataTransfer.files?.[0] ?? null);
          if (fileRef.current) {
            fileRef.current.value = '';
          }
          if (props.multiple) {
            handleFileChange(files as FileList);
          } else {
            handleFileChange(files as File | null);
          }
        }
      },
      [disabledUpload, handleFileChange, props.multiple],
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
              <div className='mt-3 w-full wrap-break-word text-xs'>
                {fileName}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className='flex h-full flex-col items-center justify-center gap-3 p-6 text-center'>
          <div className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
            {ICON_MAP[icon]}
          </div>
          {!disabledUpload && (
            <div className='space-y-1'>
              <div className='text-sm font-medium text-foreground'>
                Drag & drop file here
              </div>
              <div className='text-xs text-muted-foreground'>
                or click to browse
              </div>
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
            'overflow-hidden rounded-lg relative transition-all ease-in-out',
            previewSrc
              ? 'border-2 border-solid border-border bg-background shadow-sm'
              : 'border-2 border-dashed border-muted-foreground/25 bg-muted/5',
            !disabledUpload && !previewSrc
              ? 'cursor-pointer hover:border-primary/50 hover:bg-primary/5'
              : '',
            !disabledUpload && previewSrc ? 'cursor-pointer' : '',
            isDragOver ? 'border-primary bg-primary/10 scale-[0.98]' : '',
            { 'border-destructive ring-2 ring-destructive/20': ariaInvalid },
          )}
        >
          {isAllowDelete && (
            <RBtn
              title='Remove file'
              onClick={handleFileRemove_internal}
              className='absolute top-2 right-2'
              variant='soft-destructive'
            >
              <Trash size={15} />
            </RBtn>
          )}

          {isAllowPreview && (
            <RBtn
              variant='outline'
              className='absolute top-2 left-2'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                e.preventDefault();

                if (onPreview && previewTarget) {
                  onPreview(previewTarget);
                }
              }}
            >
              <Search size={15} />
            </RBtn>
          )}

          {thumbnailContent}

          <input
            data-testid='fileInput'
            type='file'
            className='hidden'
            accept={acceptAttr}
            ref={fileRef}
            onChange={handleFileChange_internal}
            multiple={props.multiple}
          />
        </div>
      </div>
    );
  },
);

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
      variant = 'default',
      label = 'Upload Image',
      showDescription = true,
      uploadProgress = 0,
      isUploading = false,
      multiple = false,
      maxFiles,
    } = props;

    const [files, setFiles] = useState<File[]>([]);
    const [remotePreviews, setRemotePreviews] = useState<string[]>([]);
    const [objectUrls, setObjectUrls] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    /**
     * Synchronizes internal file and remote preview state based on the controlled value prop.
     */
    useEffect(() => {
      if (Array.isArray(value)) {
        const newFiles: File[] = [];
        const newRemotes: string[] = [];
        value.forEach((v) => {
          if (v instanceof File) newFiles.push(v);
          else if (typeof v === 'string') newRemotes.push(v);
        });
        setFiles(newFiles);
        setRemotePreviews(newRemotes);
      } else if (value instanceof File) {
        setFiles([value]);
        setRemotePreviews([]);
      } else if (typeof value === 'string') {
        setFiles([]);
        setRemotePreviews([value]);
      } else {
        setFiles([]);
        setRemotePreviews([]);
      }
    }, [value]);

    /**
     * Creates object URLs for the current files to use as preview sources.
     */
    useEffect(() => {
      const urls = files.map((f) => URL.createObjectURL(f));
      setObjectUrls(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [files]);

    // Combine local object URLs and remote previews
    // For single mode, we just take the first available
    const allPreviews = [...objectUrls, ...remotePreviews];
    const previewSrc = allPreviews[0] ?? null;
    const currentFile = files[0] ?? null;

    const itemsToRender = useMemo(() => {
      const items: Array<{
        file?: File;
        preview?: string;
        name: string;
        size?: number;
        index: number;
        groupType: TGroupFileType;
      }> = [];

      files.forEach((f, index) => {
        items.push({
          file: f,
          preview: objectUrls[index],
          name: f.name,
          size: f.size,
          index: index,
          groupType: getFileGroupType(getFileExtensionFromFile(f)),
        });
      });

      remotePreviews.forEach((r, index) => {
        items.push({
          preview: r,
          name: r.split('/').pop() ?? 'Remote File',
          index: files.length + index,
          groupType: getFileGroupType(getFileExtensionFromString(r)),
        });
      });

      return items;
    }, [files, objectUrls, remotePreviews]);

    /**
     * Memoizes the group type of the file based on its extension.
     */
    const groupType = useMemo<TGroupFileType>(() => {
      if (currentFile) {
        return getFileGroupType(getFileExtensionFromFile(currentFile));
      }
      return getFileGroupType(getFileExtensionFromString(previewSrc ?? ''));
    }, [currentFile, previewSrc]);

    /**
     * Memoizes the accept attribute string for the file input
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
     * Handles changes to the selected file(s).
     */
    const handleFileChange = useCallback(
      async (inputFiles: FileList | File | null) => {
        if (!inputFiles) return;

        const newFilesList =
          inputFiles instanceof FileList
            ? Array.from(inputFiles)
            : [inputFiles];

        if (newFilesList.length === 0) return;

        const processedFiles: File[] = [];

        for (const f of newFilesList) {
          let nextFile = f;
          if (compress && f.type.startsWith('image/')) {
            try {
              nextFile = await compressImage(f);
            } catch {
              nextFile = f;
            }
          }
          processedFiles.push(nextFile);
        }

        let updatedFiles: File[];
        if (multiple) {
          updatedFiles = [...files, ...processedFiles];
          if (maxFiles && updatedFiles.length > maxFiles) {
            // If we have a mix of files and remotes, this logic gets tricky because 'files' only tracks local files.
            // But 'value' prop might have remotes.
            // However, here we are updating 'files' state.
            // Let's check total count including remotes.
            const currentTotal = files.length + remotePreviews.length;
            const slotsAvailable = maxFiles - currentTotal;

            if (slotsAvailable <= 0) {
              // Already full, can't add more.
              // Actually, usually the button is hidden, but if drag/drop happens:
              return;
            }

            // Take only what fits
            const filesToAdd = processedFiles.slice(0, slotsAvailable);
            updatedFiles = [...files, ...filesToAdd];
          }
        } else {
          updatedFiles = [processedFiles[0]];
        }

        setFiles(updatedFiles);
        setRemotePreviews([]); // Clear remotes on new upload usually

        if (multiple) {
          onChange?.(updatedFiles);
        } else {
          onChange?.(updatedFiles[0]);
        }
        onBlur?.();
      },
      [
        compress,
        files,
        multiple,
        onBlur,
        onChange,
        maxFiles,
        remotePreviews.length,
      ],
    );

    /**
     * Handles removal of a file.
     */
    const handleFileRemove = useCallback(
      (index: number = 0) => {
        if (multiple) {
          const fileToRemove = files[index];

          // Logic to remove from the combined view
          // We have files... then remotes...
          // Actually, let's simplify: we usually don't mix them in the 'value' prop easily without complex logic.
          // But for now, let's assume we remove from 'files' if index < files.length, else from 'remotePreviews'

          const newFiles = [...files];
          const newRemotes = [...remotePreviews];

          if (index < files.length) {
            newFiles.splice(index, 1);
            onRemove?.(fileToRemove);
          } else {
            const remoteIndex = index - files.length;
            newRemotes.splice(remoteIndex, 1);
            onRemove?.(remotePreviews[remoteIndex]);
          }

          setFiles(newFiles);
          setRemotePreviews(newRemotes);

          onChange?.([...newFiles]); // Note: we typically only pass back Files to onChange.
          // If we want to persist remotes, the parent needs to handle it via 'value'.
          // But standard behavior for file input is to report current *new* files.
          // However, for a controlled component, we might want to return everything.
          // Given the type definition `onChange?: (file: File | Array<File> | null) => void;`,
          // it seems we only emit Files. The parent is responsible for merging if they want to keep strings.
          // BUT, if we remove a remote string, we should probably let the parent know the new state?
          // Issue: onChange signature doesn't support strings.
          // Let's stick to emitting Files. If user removes a remote file,
          // the parent should update 'value' to remove that string.
          // Since we can't emit strings in onChange, we rely on parent updating 'value' prop.
          // Wait, if we are controlled, we shouldn't set state locally?
          // We are doing both (syncing in useEffect).

          // For now, let's just emit the remaining Files.
          onChange?.(newFiles);
        } else {
          setFiles([]);
          setRemotePreviews([]);
          onRemove?.();
          onChange?.(null);
        }
        onBlur?.();
      },
      [files, multiple, onBlur, onChange, onRemove, remotePreviews],
    );

    /**
     * Handles the change event on the hidden file input for compact variant.
     */
    /**
     * Handles the change event on the hidden file input for compact variant.
     */
    const handleFileChangeInternal = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files);
      },
      [handleFileChange],
    );

    /**
     * Handles the click event to trigger file input for compact variant.
     */
    const handleUploadClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabledUpload) fileRef.current?.click();
      },
      [disabledUpload],
    );

    // Format file size
    const formatFileSize = useCallback((bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }, []);

    const { t } = useTranslation('app');

    const defaultDesc = t('fileUploader.description', {
      extensions: accept.join(', '),
      maxSize: maxSizeMB,
    });

    // Shared render item function (reused from compact logic, but adapted if needed)
    const renderListItem = (item: (typeof itemsToRender)[0]) => {
      const itemIsImage = item.groupType === 'image';
      const hasPreview = item.preview && itemIsImage;

      return (
        <div
          key={item.index}
          className='flex justify-between gap-4 rounded-lg border border-border bg-background p-4'
        >
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {/* Icon or Image Preview */}
            {hasPreview ? (
              <div className='relative group shrink-0'>
                <img
                  src={item.preview}
                  alt={item.name || 'preview'}
                  className='size-10 rounded-lg object-cover'
                />
              </div>
            ) : (
              <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0'>
                {ICON_MAP[icon]}
              </div>
            )}

            {/* File Info */}
            <div className='flex-1 min-w-0 overflow-hidden'>
              <p className='text-sm font-medium text-foreground truncate'>
                {item.name || label}
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                {isUploading
                  ? `Uploading... ${uploadProgress}%`
                  : item.size
                    ? formatFileSize(item.size)
                    : defaultDesc}
              </p>
            </div>
          </div>

          {/* Remove Button for non-image or explicit action */}
          {!disabledDelete && !isUploading && (
            <RBtn
              variant='soft-destructive'
              size='icon'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                handleFileRemove(item.index);
              }}
              className='shrink-0 text-destructive hover:text-destructive/80'
            >
              <Trash size={16} />
            </RBtn>
          )}
        </div>
      );
    };

    // Compact variant render
    if (variant === 'compact') {
      return (
        <div className='space-y-2 min-w-0 min-h-0'>
          {itemsToRender.map(renderListItem)}

          {/* Upload Button (Always visible to add more files if multiple, or if empty) */}
          {(multiple || itemsToRender.length === 0) &&
            (!maxFiles || itemsToRender.length < maxFiles) && (
              <div
                className={cn(
                  'flex min-w-0 min-h-0 gap-4 rounded-lg border border-dashed border-border bg-muted/5 p-4',
                  {
                    'border-solid': itemsToRender.length === 0,
                  },
                )}
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0'>
                    <Upload size={20} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {itemsToRender.length > 0 ? 'Add more files' : label}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {defaultDesc}
                    </p>
                  </div>
                </div>
                <RBtn
                  variant='outline'
                  onClick={handleUploadClick}
                  disabled={disabledUpload || isUploading}
                  className='gap-2 shrink-0 w-auto'
                >
                  <Upload size={16} />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </RBtn>
              </div>
            )}

          {/* Hidden File Input */}
          <input
            type='file'
            className='hidden'
            accept={acceptAttr}
            ref={fileRef}
            onChange={handleFileChangeInternal}
            multiple={multiple}
          />

          {/* Progress Bar */}
          {isUploading && (
            <div className='w-full h-1.5 bg-muted rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary transition-all duration-300 ease-out'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      );
    }

    // Default variant render
    return (
      <div className='flex flex-col gap-4'>
        {multiple && itemsToRender.length > 0 ? (
          <div className='flex flex-col gap-2'>
            {itemsToRender.map(renderListItem)}

            {/* Add button below list */}
            {!disabledUpload &&
              (!maxFiles || itemsToRender.length < maxFiles) && (
                <RBtn
                  variant='outline'
                  className='w-full border-dashed'
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileRef.current?.click();
                  }}
                >
                  <Upload size={16} className='mr-2' />
                  Add more files
                </RBtn>
              )}
          </div>
        ) : (
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
            previewTarget={currentFile ?? previewSrc ?? null}
            fileName={currentFile?.name}
            isImagePreview={isImagePreview}
            onPreview={onPreview}
            handleFileChange={handleFileChange}
            handleFileRemove={() => handleFileRemove(0)}
            adaptiveThumbnail={adaptiveThumbnail}
            ariaInvalid={ariaInvalid}
            multiple={multiple}
          />
        )}

        {/* Hidden Input for Multiple Mode (Default variant) */}
        {multiple && (
          <input
            type='file'
            className='hidden'
            accept={acceptAttr}
            ref={fileRef}
            onChange={handleFileChangeInternal}
            multiple={multiple}
          />
        )}

        {showDescription && (
          <div className='text-sm text-muted-foreground'>{defaultDesc}</div>
        )}
      </div>
    );
  },
);

export default RFileUploader;

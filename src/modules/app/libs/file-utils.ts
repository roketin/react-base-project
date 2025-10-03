import { DEFAULT_EXT } from '@/modules/app/constants/app.constant';

/**
 * Get file extension from file
 * @param file
 */
export const getFileExtensionFromFile = (file: File): string => {
  const extensionMatch = RegExp(/\.([0-9a-z]+)(?:[?#]|$)/i).exec(file.name);
  return extensionMatch ? extensionMatch[1].toLowerCase() : '';
};

/**
 * Get file extension from string
 * @param fileString
 * @returns
 */
export const getFileExtensionFromString = (fileString: string): string => {
  const extensionMatch = RegExp(/\.([0-9a-z]+)(?:[?#]|$)/i).exec(fileString);
  return extensionMatch ? extensionMatch[1].toLowerCase() : '';
};

/**
 * Get file group segment
 * @param ext
 * @returns
 */
export type TGroupFileType = 'image' | 'pdf' | 'doc' | 'audio' | 'custom';
export const getFileGroupType = (ext: string): TGroupFileType => {
  if (DEFAULT_EXT.IMAGES.includes(ext)) {
    return 'image';
  }
  if (DEFAULT_EXT.PDF.includes(ext)) {
    return 'pdf';
  }
  if (DEFAULT_EXT.OFFICE.includes(ext)) {
    return 'doc';
  }
  if (DEFAULT_EXT.AUDIO.includes(ext)) {
    return 'audio';
  }
  return 'custom';
};

/**
 * Format Bytes
 * @param bytes
 * @param decimals
 * @returns
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Convert byte to MB
 * @param num
 * @returns
 */
export const byteToMb = (num: number) => 1024 * 1024 * num;

export const downloadBlob = (blob: Blob, name = 'file.txt') => {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove link from body
  document.body.removeChild(link);
};

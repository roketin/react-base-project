import { DEFAULT_EXT } from '@/modules/app/constants/app.constant';

/**
 * Extracts the file extension from a File object.
 * @param {File} file - The file from which to extract the extension.
 * @returns {string} The lowercase file extension without the leading dot.
 */
export const getFileExtensionFromFile = (file: File): string => {
  const extensionMatch = RegExp(/\.([0-9a-z]+)(?:[?#]|$)/i).exec(file.name);
  return extensionMatch ? extensionMatch[1].toLowerCase() : '';
};

/**
 * Extracts the file extension from a filename string.
 * @param {string} fileString - The filename or path string.
 * @returns {string} The lowercase file extension without the leading dot.
 */
export const getFileExtensionFromString = (fileString: string): string => {
  const extensionMatch = RegExp(/\.([0-9a-z]+)(?:[?#]|$)/i).exec(fileString);
  return extensionMatch ? extensionMatch[1].toLowerCase() : '';
};

/**
 * Defines the possible file group types.
 */
export type TGroupFileType = 'image' | 'pdf' | 'doc' | 'audio' | 'custom';

/**
 * Determines the file group type based on the file extension.
 * @param {string} ext - The file extension to classify.
 * @returns {TGroupFileType} The corresponding file group type.
 */
export const getFileGroupType = (
  ext: string,
  mimeType?: string,
): TGroupFileType => {
  const normalizedExt = ext?.toLowerCase?.() ?? '';
  const normalizedMime = mimeType?.toLowerCase?.() ?? '';

  if (normalizedExt && DEFAULT_EXT.IMAGES.includes(normalizedExt)) {
    return 'image';
  }
  if (normalizedExt && DEFAULT_EXT.PDF.includes(normalizedExt)) {
    return 'pdf';
  }
  if (normalizedExt && DEFAULT_EXT.OFFICE.includes(normalizedExt)) {
    return 'doc';
  }
  if (normalizedExt && DEFAULT_EXT.AUDIO.includes(normalizedExt)) {
    return 'audio';
  }

  if (normalizedMime) {
    if (normalizedMime.startsWith('image/')) return 'image';
    if (normalizedMime === 'application/pdf') return 'pdf';
    if (
      normalizedMime.startsWith('audio/') ||
      normalizedMime === 'application/ogg'
    ) {
      return 'audio';
    }
    if (
      normalizedMime.includes('spreadsheetml') ||
      normalizedMime.includes('wordprocessingml') ||
      normalizedMime.includes('presentationml') ||
      normalizedMime.includes('msword') ||
      normalizedMime.includes('msexcel') ||
      normalizedMime.includes('powerpoint') ||
      normalizedMime === 'application/vnd.ms-powerpoint'
    ) {
      return 'doc';
    }
  }
  return 'custom';
};

/**
 * Converts a byte value into a human-readable string with appropriate units.
 * @param {number} bytes - The number of bytes.
 * @param {number} [decimals=2] - The number of decimal places to include.
 * @returns {string} The formatted string representing the bytes in suitable units.
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
 * Converts a numeric value to bytes assuming the input is in megabytes.
 * @param {number} num - The number in megabytes.
 * @returns {number} The equivalent number of bytes.
 */
export const byteToMb = (num: number) => 1024 * 1024 * num;

/**
 * Initiates a download of a Blob object as a file with a specified filename.
 * @param {Blob} blob - The Blob object to download.
 * @param {string} [name='file.txt'] - The desired filename for the downloaded file.
 */
export const downloadBlob = (blob: Blob, name = 'file.txt') => {
  // Create a URL representing the Blob object in memory
  const blobUrl = URL.createObjectURL(blob);

  // Create an anchor element for download
  const link = document.createElement('a');

  // Set the href attribute to the Blob URL and assign the download filename
  link.href = blobUrl;
  link.download = name;

  // Append the anchor to the document body to make it part of the DOM
  document.body.appendChild(link);

  // Programmatically trigger a click event on the anchor to start download
  // This approach ensures compatibility with browsers like Firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove the anchor element from the DOM after triggering the download
  document.body.removeChild(link);
};

export const DEFAULT_EXT = {
  IMAGES: ['jpg', 'jpeg', 'png', 'webp'],
  PDF: ['pdf'],
  DOC: ['docx', 'doc'],
  OFFICE: ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'],
  AUDIO: ['mp3', 'wav', 'ogg'],
};

export const DEFAULT_FILE_SIZE = {
  min: 0,
  max: 1,
};

export const DEFAULT_QUERY_PARAMS = {
  page: 1,
  per_page: 10,
};

// Common Indonesian date formats for consistent usage across the app
export const DATE_FORMAT = {
  /** e.g. 31/12/2024 */
  numeric: 'DD/MM/YYYY',
  /** e.g. 31 Des 2024 */
  short: 'DD MMM YYYY',
  /** e.g. Selasa, 31 Desember 2024 */
  long: 'dddd, DD MMMM YYYY',
  /** e.g. 14:05 */
  time: 'HH:mm',
  /** e.g. 31 Des 2024, 14:05 */
  datetime: 'DD MMM YYYY, HH:mm',
  /** e.g. Selasa, 31 Desember 2024, 14:05 */
  datetimeLong: 'dddd, DD MMMM YYYY, HH:mm',
};

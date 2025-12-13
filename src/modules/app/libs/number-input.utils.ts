/**
 * Utility functions for numeric input formatting and validation.
 */

export type TFormatConfig = {
  allowDecimal: boolean;
  decimalLimit: number;
};

export type TPatternOptions = {
  allowDecimal: boolean;
  allowExtraDecimal: boolean;
  decimalLimit: number;
  negative: boolean;
};

/** Remove thousand separators (commas) from string */
export const stripGrouping = (value: string): string => value.replace(/,/g, '');

/** Remove leading zeros except for decimal numbers like "0.5" */
export const removeLeadingZeros = (value: string): string =>
  /^0\d+/.test(value) ? value.replace(/^0+/, '') : value;

/** Check if value is empty or zero */
export const isZeroValue = (value: string): boolean => {
  if (value === '') return true;
  const numeric = Number(value);
  return !Number.isNaN(numeric) && numeric === 0;
};

/** Create regex pattern for input validation */
export const createInputPattern = ({
  allowDecimal,
  allowExtraDecimal,
  decimalLimit,
  negative,
}: TPatternOptions): RegExp => {
  const signPart = negative ? '-?' : '';
  const decimalPart = allowDecimal
    ? allowExtraDecimal
      ? '(?:\\.\\d*)?'
      : `(?:\\.\\d{0,${decimalLimit}})?`
    : '';

  return new RegExp(`^${signPart}\\d*${decimalPart}$`);
};

// Safe thousand separator without backtracking regex
const addThousandSeparators = (value: string): string => {
  const parts = value.split('');
  const result: string[] = [];
  let count = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result.unshift(',');
    }
    result.unshift(parts[i]);
    count++;
  }
  return result.join('');
};

/** Add thousand separators to integer string */
const formatInteger = (value: string): string => addThousandSeparators(value);

/** Safe rounding to avoid floating point issues */
const safeRound = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/** Format raw numeric string for display with grouping and decimals */
export const formatDisplayValue = (
  raw: string,
  { allowDecimal, decimalLimit }: TFormatConfig,
  hasPercentRestriction: boolean,
): string => {
  if (!raw) return '';

  const sanitized = stripGrouping(raw);

  if (hasPercentRestriction && Number(sanitized) > 100) {
    return 'OVER';
  }

  const sign = sanitized.startsWith('-') ? '-' : '';
  const unsigned = sanitized.replace('-', '');
  const shouldFormatDecimal = allowDecimal && decimalLimit > 0;

  let integerPart: string;
  let decimalPart = '';

  if (shouldFormatDecimal) {
    const numeric = Number(`${sign}${unsigned}`);

    if (Number.isFinite(numeric)) {
      const rounded = safeRound(numeric, decimalLimit);
      const normalized = Math.abs(rounded).toFixed(decimalLimit);
      [integerPart, decimalPart] = normalized.split('.') as [string, string];
    } else {
      [integerPart, decimalPart = ''] = unsigned.split('.');
    }

    decimalPart = decimalPart.padEnd(decimalLimit, '0').slice(0, decimalLimit);
  } else {
    integerPart = unsigned.split('.')[0] ?? '';
  }

  const groupedInteger = integerPart
    ? formatInteger(integerPart)
    : shouldFormatDecimal
      ? '0'
      : '';

  const decimalSegment =
    shouldFormatDecimal && decimalLimit > 0 ? `.${decimalPart}` : '';

  return `${sign}${groupedInteger}${decimalSegment}`.trim();
};

/** Convert prop value to raw string */
export const toRawString = (
  value: string | number | readonly string[] | undefined | null,
): string => {
  if (value === null || value === undefined) return '';
  return stripGrouping(String(value));
};

/** Clean pasted text, keeping only valid numeric characters */
export const cleanPastedValue = (
  text: string,
  allowNegative: boolean,
): string => {
  const stripped = stripGrouping(text);
  return allowNegative
    ? stripped.replace(/[^0-9.-]/g, '')
    : stripped.replace(/[^0-9.]/g, '');
};

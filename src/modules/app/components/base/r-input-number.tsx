import { RInput } from '@/modules/app/components/base/r-input';
import { safeRound } from '@/modules/app/libs/utils';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

export type TRInputNumberProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  decimalLimit?: number;
  isOnBlurFormat?: boolean;
  onChange?: (value: number) => void;
  negative?: boolean;
  isFormatOnChange?: boolean;
  allowExtraDecimal?: boolean;
  hasPercentRestriction?: boolean;
  allowDecimal?: boolean;
};

/**
 * RInputNumber - a numeric input component with formatting, decimal limits, and optional negative numbers.
 *
 * Props:
 * - decimalLimit: number of decimal places to format the value (default: 2)
 * - isOnBlurFormat: whether to format the value on blur (default: false)
 * - onChange: callback when the numeric value changes
 * - negative: allow negative numbers (default: false)
 * - isFormatOnChange: format value when the `value` prop changes (default: true)
 * - allowExtraDecimal: allow extra decimals beyond decimalLimit (default: false)
 * - hasPercentRestriction: if true, values > 100 show "OVER"
 * - allowDecimal: allow decimal input (default: true)
 */
type TPatternOptions = {
  allowDecimal: boolean;
  allowExtraDecimal: boolean;
  decimalLimit: number;
  negative: boolean;
};

type TFormatConfig = {
  allowDecimal: boolean;
  decimalLimit: number;
};

const GROUP_SEPARATOR_REGEX = /\B(?=(\d{3})+(?!\d))/g;

const stripGrouping = (value: string) => value.replace(/,/g, '');

const removeLeadingZeros = (value: string) =>
  /^0\d+/.test(value) ? value.replace(/^0+/, '') : value;

const isZeroValue = (value: string) => {
  if (value === '') return true;
  const numeric = Number(value);
  return !Number.isNaN(numeric) && numeric === 0;
};

const createPattern = ({
  allowDecimal,
  allowExtraDecimal,
  decimalLimit,
  negative,
}: TPatternOptions) => {
  const signPart = negative ? '-?' : '';
  const decimalPart = allowDecimal
    ? allowExtraDecimal
      ? '(?:\\.\\d*)?'
      : `(?:\\.\\d{0,${decimalLimit}})?`
    : '';

  return new RegExp(`^${signPart}\\d*${decimalPart}$`);
};

const formatInteger = (value: string) =>
  value.replace(GROUP_SEPARATOR_REGEX, ',');

const formatDisplayValue = (
  raw: string,
  { allowDecimal, decimalLimit }: TFormatConfig,
  hasPercentRestriction: boolean,
) => {
  if (!raw) return '';

  const sanitized = stripGrouping(raw);

  if (hasPercentRestriction && Number(sanitized) > 100) {
    return 'OVER';
  }

  const sign = sanitized.startsWith('-') ? '-' : '';
  const unsigned = sanitized.replace('-', '');

  const shouldFormatDecimal = allowDecimal && decimalLimit > 0;

  let integerPart = unsigned;
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

const toRawString = (value: TRInputNumberProps['value']) => {
  if (value === null || value === undefined) return '';
  return stripGrouping(String(value));
};

const RInputNumber = ({
  decimalLimit = 2,
  onChange,
  isOnBlurFormat = false,
  negative = false,
  value,
  isFormatOnChange = true,
  allowExtraDecimal = false,
  hasPercentRestriction = false,
  allowDecimal = true,
  ...props
}: TRInputNumberProps) => {
  const {
    onKeyDown: inputOnKeyDown,
    onBlur: inputOnBlur,
    onFocus: inputOnFocus,
    onPaste: inputOnPaste,
    ...restProps
  } = props;

  const formatConfig = useMemo<TFormatConfig>(
    () => ({
      allowDecimal,
      decimalLimit: allowDecimal ? decimalLimit : 0,
    }),
    [allowDecimal, decimalLimit],
  );

  const inputPattern = useMemo(
    () =>
      createPattern({
        allowDecimal,
        allowExtraDecimal,
        decimalLimit,
        negative,
      }),
    [allowDecimal, allowExtraDecimal, decimalLimit, negative],
  );

  const blockedKeys = useMemo(() => {
    const keys = new Set(['e', 'E', '+']);
    if (!allowDecimal) keys.add('.');
    if (!negative) keys.add('-');
    return keys;
  }, [allowDecimal, negative]);

  const initialRaw = toRawString(value);
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (!initialRaw) return '';
    return isFormatOnChange
      ? formatDisplayValue(initialRaw, formatConfig, hasPercentRestriction)
      : initialRaw;
  });

  const isChangedByOnChange = useRef(false);
  const rawValueRef = useRef<string>(initialRaw);

  /**
   * Formats the input value according to decimalLimit and formatting rules.
   * Adds thousand separators and pads decimals as needed.
   * Shows "OVER" if hasPercentRestriction is true and value exceeds 100.
   */
  const applyFormattedDisplay = useCallback(
    (raw: string) => {
      setDisplayValue(
        raw ? formatDisplayValue(raw, formatConfig, hasPercentRestriction) : '',
      );
    },
    [formatConfig, hasPercentRestriction],
  );

  /**
   * Syncs external `value` prop changes into the input display,
   * only if the value wasn't changed by the user's typing.
   */
  useEffect(() => {
    if (isChangedByOnChange.current) {
      isChangedByOnChange.current = false;
      return;
    }

    const nextRaw = toRawString(value);
    rawValueRef.current = nextRaw;

    if (!isFormatOnChange) {
      setDisplayValue(nextRaw);
      return;
    }

    if (!nextRaw) {
      setDisplayValue('');
      return;
    }

    applyFormattedDisplay(nextRaw);
  }, [value, isFormatOnChange, applyFormattedDisplay]);

  /**
   * Prevents invalid keys during typing.
   * Forbids 'e', 'E', '+', '-' by default, and optionally '.' if decimals are not allowed.
   * Allows negative sign if enabled and at the correct position.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === '-' && negative) {
        const target = event.currentTarget;
        const { value: currentValue, selectionStart } = target;
        if (selectionStart === 0 && !currentValue.includes('-')) {
          inputOnKeyDown?.(event);
          return;
        }
        event.preventDefault();
        inputOnKeyDown?.(event);
        return;
      }

      if (blockedKeys.has(event.key)) {
        event.preventDefault();
      }

      inputOnKeyDown?.(event);
    },
    [blockedKeys, negative, inputOnKeyDown],
  );

  /**
   * Handles input value changes during typing.
   * Validates against allowed pattern based on negative and decimal rules.
   * Updates displayValue and triggers onChange callback with numeric value.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let { value } = event.target;

      value = removeLeadingZeros(value);

      if (!inputPattern.test(value)) {
        return;
      }

      rawValueRef.current = value;
      setDisplayValue(value);
      isChangedByOnChange.current = true;
      onChange?.(+value);
    },
    [inputPattern, onChange],
  );

  /**
   * Formats the value on blur if `isOnBlurFormat` is true.
   * Converts raw input into formatted display, respecting decimal and percent rules.
   */
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (!isOnBlurFormat || event.target.matches(':focus')) {
        inputOnBlur?.(event);
        return;
      }

      const rawValue = stripGrouping(rawValueRef.current);

      if (!rawValue) {
        setDisplayValue('');
        inputOnBlur?.(event);
        return;
      }

      applyFormattedDisplay(rawValue);
      onChange?.(+rawValue);
      inputOnBlur?.(event);
    },
    [applyFormattedDisplay, isOnBlurFormat, onChange, inputOnBlur],
  );

  /**
   * Handles focus event on the input.
   * Clears the display if the value is zero, otherwise removes formatting for editing.
   */
  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const raw = rawValueRef.current;

      if (isZeroValue(raw)) {
        setDisplayValue('');
        rawValueRef.current = '';
      } else if (raw) {
        setDisplayValue(stripGrouping(raw));
      }

      inputOnFocus?.(event);
    },
    [inputOnFocus],
  );

  /**
   * Handles pasted input.
   * Cleans non-numeric characters and validates the pasted content before updating.
   */
  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const cleaned = negative
        ? stripGrouping(event.clipboardData.getData('Text')).replace(
            /[^0-9.-]/g,
            '',
          )
        : stripGrouping(event.clipboardData.getData('Text')).replace(
            /[^0-9.]/g,
            '',
          );

      if (!inputPattern.test(cleaned)) {
        return;
      }

      rawValueRef.current = cleaned;
      setDisplayValue(cleaned);
      isChangedByOnChange.current = true;
      onChange?.(+cleaned);

      inputOnPaste?.(event);
    },
    [inputPattern, negative, onChange, inputOnPaste],
  );

  return (
    <RInput
      value={displayValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPaste={handlePaste}
      {...restProps}
    />
  );
};

export { RInputNumber };

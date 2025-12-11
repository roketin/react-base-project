import {
  RInput,
  type TRInputProps,
} from '@/modules/app/components/base/r-input';
import {
  cleanPastedValue,
  createInputPattern,
  formatDisplayValue,
  isZeroValue,
  removeLeadingZeros,
  stripGrouping,
  toRawString,
  type TFormatConfig,
} from '@/modules/app/libs/number-input.utils';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

type TBaseInputProps = Omit<TRInputProps, 'onChange' | 'value'>;

export type TRInputNumberProps = TBaseInputProps & {
  /** Number of decimal places (default: 2) */
  decimalLimit?: number;
  /** Format value on blur instead of on change */
  isOnBlurFormat?: boolean;
  /** Callback when numeric value changes */
  onChange?: (value: number) => void;
  /** Allow negative numbers */
  negative?: boolean;
  /** Format value when external prop changes (default: true) */
  formatOnPropChange?: boolean;
  /** Allow decimals beyond decimalLimit during input */
  allowExtraDecimal?: boolean;
  /** Show "OVER" when value exceeds 100 */
  hasPercentRestriction?: boolean;
  /** Allow decimal input (default: true) */
  allowDecimal?: boolean;
  /** Input value */
  value?: number | string;
};

/** Keys that are always blocked in numeric input */
const ALWAYS_BLOCKED_KEYS = new Set(['e', 'E', '+']);

const RInputNumber = ({
  decimalLimit = 2,
  onChange,
  isOnBlurFormat = false,
  negative = false,
  value,
  formatOnPropChange = true,
  allowExtraDecimal = false,
  hasPercentRestriction = false,
  allowDecimal = true,
  onKeyDown: inputOnKeyDown,
  onBlur: inputOnBlur,
  onFocus: inputOnFocus,
  onPaste: inputOnPaste,
  ...restProps
}: TRInputNumberProps) => {
  const formatConfig = useMemo<TFormatConfig>(
    () => ({
      allowDecimal,
      decimalLimit: allowDecimal ? decimalLimit : 0,
    }),
    [allowDecimal, decimalLimit],
  );

  const inputPattern = useMemo(
    () =>
      createInputPattern({
        allowDecimal,
        allowExtraDecimal,
        decimalLimit,
        negative,
      }),
    [allowDecimal, allowExtraDecimal, decimalLimit, negative],
  );

  const initialRaw = toRawString(value);
  const [displayValue, setDisplayValue] = useState<string>(() =>
    initialRaw && formatOnPropChange
      ? formatDisplayValue(initialRaw, formatConfig, hasPercentRestriction)
      : initialRaw,
  );

  const isChangedByOnChange = useRef(false);
  const rawValueRef = useRef<string>(initialRaw);

  const applyFormattedDisplay = useCallback(
    (raw: string) => {
      setDisplayValue(
        raw ? formatDisplayValue(raw, formatConfig, hasPercentRestriction) : '',
      );
    },
    [formatConfig, hasPercentRestriction],
  );

  // Sync external value prop changes
  useEffect(() => {
    if (isChangedByOnChange.current) {
      isChangedByOnChange.current = false;
      return;
    }

    const nextRaw = toRawString(value);
    rawValueRef.current = nextRaw;

    if (!formatOnPropChange || !nextRaw) {
      setDisplayValue(nextRaw);
      return;
    }

    applyFormattedDisplay(nextRaw);
  }, [value, formatOnPropChange, applyFormattedDisplay]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      // Handle negative sign
      if (key === '-' && negative) {
        const { value: currentValue, selectionStart } = event.currentTarget;
        if (selectionStart !== 0 || currentValue.includes('-')) {
          event.preventDefault();
        }
        inputOnKeyDown?.(event);
        return;
      }

      // Block invalid keys
      if (
        ALWAYS_BLOCKED_KEYS.has(key) ||
        (!allowDecimal && key === '.') ||
        (!negative && key === '-')
      ) {
        event.preventDefault();
      }

      inputOnKeyDown?.(event);
    },
    [allowDecimal, negative, inputOnKeyDown],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = removeLeadingZeros(event.target.value);

      if (!inputPattern.test(newValue)) return;

      rawValueRef.current = newValue;
      setDisplayValue(newValue);
      isChangedByOnChange.current = true;
      onChange?.(+newValue);
    },
    [inputPattern, onChange],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (isOnBlurFormat && !event.target.matches(':focus')) {
        const rawValue = stripGrouping(rawValueRef.current);

        if (rawValue) {
          applyFormattedDisplay(rawValue);
          onChange?.(+rawValue);
        } else {
          setDisplayValue('');
        }
      }

      inputOnBlur?.(event);
    },
    [applyFormattedDisplay, isOnBlurFormat, onChange, inputOnBlur],
  );

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

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const cleaned = cleanPastedValue(
        event.clipboardData.getData('Text'),
        negative,
      );

      if (!inputPattern.test(cleaned)) return;

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
